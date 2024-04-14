package main

import (
	"log"
	"time"

	"bridge/content/bob"
	"bridge/etherman"

	"bridge/config"
	"bridge/content/datastore"
	"bridge/context"
	"github.com/urfave/cli/v2"
)

const (
	envChainIdList       = "CHAIN_ID_LIST"
	redisNewDepositEvent = "NEW_DEPOSIT_EVENT"

	MAX_CHANEL = 20
)

func beforeStartCrawler(c *cli.Context) error {
	cfg, err := config.Load(c)
	if err != nil {
		return err
	}
	context.SetContextSQL(cfg.Database)
	context.SetContextRedisClient(cfg.Redis)
	context.SetChainClient()
	return nil
}

func startCrawler(c *cli.Context) error {
	chainClient, err := etherman.NewAllClient(Config().Etherman)
	if err != nil {
		return err
	}

	events := make(chan etherman.EventDatastore, MAX_CHANEL)

	for _, chain := range chainClient {
		go func(chain *etherman.Client) {
			query := etherman.DefaultQuery(chain.Cfg)

			err = chain.SubcribeNewEvents(ctx, query, events)
			if err != nil {
				log.Println(err)
				return
			}
		}(chain)
	}

	for {
		select {
		case event := <-events:

			tx := datastore.DatastoreTransaction{}
			transaction, err := tx.Insert(ctx, SQLRepository(), EventDatastoreToBob(event))
			if err != nil {
				log.Println(err)
				continue
			}

			err = RedisRepository().Publish(ctx, redisNewDepositEvent, transaction.ID.String()).Err()
			if err != nil {
				return err
			}

		default:
			time.Sleep(10 * time.Second)
		}
	}
}

func EventDatastoreToBob(event etherman.EventDatastore) *bob.Transaction {
	return &bob.Transaction{
		User:       event.User,
		Token:      event.Token,
		RawAmount:  event.RawAmount,
		ChainID:    event.ChainID,
		IsComplete: event.IsComplete,
		CreatedAt:  event.CreatedAt,
		UpdatedAt:  event.UpdatedAt,
		Hash:       event.Hash,
	}
}
