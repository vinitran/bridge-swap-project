package main

import (
	"bridge/content/service"
	"errors"
	"github.com/samber/do"
	"github.com/urfave/cli/v2"
	"log"
	"time"
)

func startCronjob(c *cli.Context) error {
	container, ok := c.App.Metadata["container"].(*do.Injector)
	if !ok {
		return errors.New("invalid service container")
	}

	serviceBridge, err := do.Invoke[*service.ServiceBridge](container)
	if err != nil {
		return err
	}

	timeExpired := time.Now().Add(-10 * time.Minute)

	for {
		log.Println("asdasd")
		err := serviceBridge.DeleteExpired(c.Context, timeExpired)
		if err != nil {
			return err
		}
		time.Sleep(10 * time.Minute)
	}
	return nil
}
