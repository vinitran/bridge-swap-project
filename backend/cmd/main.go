package main

import (
	"context"
	"log"
	"os"

	"bridge/content/container"

	backend "bridge"
	"bridge/config"
	"github.com/urfave/cli/v2"
)

const (
	appName = "bridge-system"
)

var (
	ctx               = context.Background()
	configAddressFlag = cli.StringFlag{
		Name:     config.FlagAddress,
		Value:    "0.0.0.0:3030",
		Usage:    "Configuration Address",
		Required: false,
	}
	configMigrateActionFlag = cli.StringFlag{
		Name:     config.FlagMigrateAction,
		Value:    "up",
		Usage:    "Configuration up or down in migration",
		Required: true,
	}
	configFileFlag = cli.StringFlag{
		Name:     config.FlagCfg,
		Aliases:  []string{"c"},
		Usage:    "Configuration `FILE`",
		Required: false,
	}
)

func main() {
	cfg, err := config.Load("/app/config.toml")
	if err != nil {
		log.Fatal(err)
	}
	ctn := container.NewContainer(cfg)

	app := cli.NewApp()
	app.Name = appName
	app.Version = backend.Version
	flags := []cli.Flag{
		&configFileFlag,
	}
	app.Metadata = map[string]any{
		"container": ctn,
	}
	app.Commands = []*cli.Command{
		{
			Name:    "version",
			Aliases: []string{},
			Usage:   "Application version and build",
			Action:  versionCmd,
		},
		{
			Name:    "api",
			Aliases: []string{},
			Usage:   "Run the api",
			Action:  startAPIServer,
			Flags:   append(flags, &configAddressFlag),
		},
		{
			Name:    "cron-job",
			Aliases: []string{},
			Usage:   "Run the cron job to track the bridge request in database",
			Action:  startCronjob,
			Flags:   append(flags, &configAddressFlag),
		},
		{
			Name:    "crawler",
			Aliases: []string{},
			Usage:   "Run the cron job to track the bridge request in database",
			Action:  startCrawler,
			Flags:   append(flags, &configAddressFlag),
		},
		{
			Name:    "blockchain",
			Aliases: []string{},
			Usage:   "Run the blockchain job",
			Action:  startBlockchain,
			Flags:   append(flags, &configAddressFlag),
		},
		{
			Name:    "migration",
			Aliases: []string{},
			Usage:   "Run the migration",
			Action:  startMigration,
			Flags:   append(flags, &configMigrateActionFlag),
		},
	}

	err = app.Run(os.Args)
	if err != nil {
		log.Fatal(err)
		os.Exit(1)
	}
}
