package main

import (
	"embed"
	"fmt"

	"bridge/config"
	"bridge/context"

	"github.com/pressly/goose/v3"
	"github.com/urfave/cli/v2"
)

//go:embed migrations/*.sql
var embedMigrations embed.FS

func beforeMigration(c *cli.Context) error {
	cfg, err := config.Load(c)
	if err != nil {
		return err
	}
	goose.SetBaseFS(embedMigrations)
	context.SetContextSQL(cfg.Database)
	return nil
}

func startMigration(c *cli.Context) error {
	migrateAction := c.String(config.FlagMigrateAction)
	switch migrateAction {
	case config.FlagUpAction:
		return goose.Up(context.GetContextSQL().DB, "migrations")
	case config.FlagDownAction:
		return goose.Down(context.GetContextSQL().DB, "migrations")
	default:
		return fmt.Errorf(`migration: invalid magration flags. "up" or "down" only`)
	}
}
