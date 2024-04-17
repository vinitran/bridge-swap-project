package main

import (
	"errors"
	"fmt"
	"log"

	"bridge/config"
	"bridge/content/service"

	"github.com/google/uuid"
	"github.com/redis/go-redis/v9"
	"github.com/samber/do"

	"bridge/etherman"
	"bridge/util"

	"github.com/ethereum/go-ethereum/common"

	"github.com/urfave/cli/v2"
)

func startBlockchain(c *cli.Context) error {
	log.Println("start blockchain")

	container, ok := c.App.Metadata["container"].(*do.Injector)
	if !ok {
		return errors.New("invalid service container")
	}

	cfg, err := do.Invoke[*config.Config](container)
	if err != nil {
		return err
	}

	dbRedis, err := do.Invoke[*redis.Client](container)
	if err != nil {
		return err
	}

	serviceBridge, err := do.Invoke[*service.ServiceBridge](container)
	if err != nil {
		return err
	}

	serviceTransaction, err := do.Invoke[*service.ServiceTransaction](container)
	if err != nil {
		return err
	}

	serviceToken, err := do.Invoke[*service.ServiceToken](container)
	if err != nil {
		return err
	}

	eventSub := dbRedis.Subscribe(ctx, redisNewDepositEvent)
	defer eventSub.Close()

	eventCh := eventSub.Channel()

	go func() {
		for msg := range eventCh {
			bridgeRq, err := serviceBridge.CheckValidForWithdrawal(ctx, uuid.MustParse(msg.Payload))
			if err != nil {
				log.Println("blockchain: ", err)
				continue
			}

			if bridgeRq == nil {
				log.Println(fmt.Sprintf("event id %s: not valid with request", msg.Payload))
				continue
			}

			token, err := serviceToken.FindTokenInOutputChain(ctx, bridgeRq.Token, bridgeRq.InputChain, bridgeRq.OutputChain)
			if err != nil {
				log.Println(fmt.Sprintf("event id %s: %e", msg.Payload, err))
				continue
			}

			etherClient, err := etherman.NewClientFromChainId(util.ToUint64(token.ChainID), cfg.Etherman)
			if err != nil {
				log.Println(fmt.Sprintf("event id %s: %e", msg.Payload, err))
				return
			}

			_, err = etherClient.CallWithdrawal(ctx, etherClient.SenderAddress[0], common.HexToAddress(token.Address), common.HexToAddress(bridgeRq.UserAddress), util.ToBigInt(bridgeRq.RawAmount))
			if err != nil {
				log.Println(fmt.Sprintf("event id %s: %e", msg.Payload, err))
				return
			}

			err = serviceBridge.SetComplete(ctx, bridgeRq.ID)
			if err != nil {
				log.Println(fmt.Sprintf("event id %s: %e", msg.Payload, err))
				continue
			}

			err = serviceTransaction.SetCompleteTransaction(ctx, uuid.MustParse(msg.Payload))
			if err != nil {
				log.Println(fmt.Sprintf("event id %s: %e", msg.Payload, err))
				continue
			}
		}
	}()

	for {
	}
}
