package main

import (
	"errors"
	"log"
	"time"

	"bridge/content/service"

	"github.com/samber/do"
	"github.com/urfave/cli/v2"
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

	for {
		log.Println("asdasd")
		err := serviceBridge.DeleteExpired(c.Context)
		if err != nil {
			return err
		}
		time.Sleep(10 * time.Minute)
	}
	return nil
}
