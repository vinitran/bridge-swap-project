package main

import (
	"errors"
	"log"
	"time"

	"bridge/content/service"

	"github.com/redis/go-redis/v9"
	"github.com/samber/do"

	"bridge/content/bob"
	"bridge/etherman"

	"github.com/urfave/cli/v2"
)

const (
	envChainIdList       = "CHAIN_ID_LIST"
	redisNewDepositEvent = "NEW_DEPOSIT_EVENT"

	MAX_CHANEL = 20
)

func startCrawler(c *cli.Context) error {
	container, ok := c.App.Metadata["container"].(*do.Injector)
	if !ok {
		return errors.New("invalid service container")
	}

	chainClient, err := do.Invoke[[]*etherman.Client](container)
	if err != nil {
		return err
	}

	serviceTransaction, err := do.Invoke[*service.ServiceTransaction](container)
	if err != nil {
		return err
	}

	redisClient, err := do.Invoke[*redis.Client](container)
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

	log.Println("Starting crawler")

	for {
		select {
		case event := <-events:
			log.Println("Received event", event)
			transaction, err := serviceTransaction.Create(ctx, EventDatastoreToBob(event))
			if err != nil {
				log.Println(err)
				continue
			}

			err = redisClient.Publish(ctx, redisNewDepositEvent, transaction.ID.String()).Err()
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
