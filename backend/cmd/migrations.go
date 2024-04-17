package main

import (
	"bridge/config"
	"database/sql"
	"embed"
	"errors"
	"fmt"
	"github.com/pressly/goose/v3"
	"github.com/samber/do"
	"log"

	_ "github.com/lib/pq"
	"github.com/urfave/cli/v2"
)

//go:embed migrations/*.sql
var embedMigrations embed.FS

func startMigration(c *cli.Context) error {
	container, ok := c.App.Metadata["container"].(*do.Injector)
	if !ok {
		return errors.New("invalid service container")
	}

	cfg, err := do.Invoke[*config.Config](container)
	if err != nil {
		return err
	}

	db, err := sql.Open("postgres", fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=disable", cfg.Database.User, cfg.Database.Password, cfg.Database.Host, cfg.Database.Port, cfg.Database.Name))
	if err != nil {
		log.Fatal(err)
	}

	goose.SetBaseFS(embedMigrations)

	migrateAction := c.String(config.FlagMigrateAction)
	switch migrateAction {
	case config.FlagUpAction:
		return goose.Up(db, "migrations")
	case config.FlagDownAction:
		return goose.Down(db, "migrations")
	default:
		return fmt.Errorf(`migration: invalid magration flags. "up" or "down" only`)
	}
	return nil
}
