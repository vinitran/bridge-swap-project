package main

import (
	"log"
	"os"

	backend "bridge"
	"bridge/config"
	"github.com/urfave/cli/v2"
)

const (
	appName = "bridge-system"
	envPath = ".env,.env.local"
)

var (
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
	app := cli.NewApp()
	app.Name = appName
	app.Version = backend.Version
	flags := []cli.Flag{
		&configFileFlag,
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
			Before:  beforeStartApiServer,
			Action:  startAPIServer,
			Flags:   append(flags, &configAddressFlag),
		},
		{
			Name:    "cron-job",
			Aliases: []string{},
			Usage:   "Run the cron job to track the bridge request in database",
			Before:  beforeStartCronjob,
			Action:  startCronjob,
			Flags:   append(flags, &configAddressFlag),
		},
		{
			Name:    "crawler",
			Aliases: []string{},
			Usage:   "Run the cron job to track the bridge request in database",
			Before:  beforeStartCrawler,
			Action:  startCrawler,
			Flags:   append(flags, &configAddressFlag),
		},
		{
			Name:    "blockchain",
			Aliases: []string{},
			Usage:   "Run the blockchain job",
			Before:  beforeStartBlockchain,
			Action:  startBlockchain,
			Flags:   append(flags, &configAddressFlag),
		},
		{
			Name:    "migration",
			Aliases: []string{},
			Usage:   "Run the migration",
			Before:  beforeMigration,
			Action:  startMigration,
			Flags:   append(flags, &configMigrateActionFlag),
		},
	}

	err := app.Run(os.Args)
	if err != nil {
		log.Fatal(err)
		os.Exit(1)
	}
}
