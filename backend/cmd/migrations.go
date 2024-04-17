package main

import (
	"embed"

	"github.com/urfave/cli/v2"
)

//go:embed migrations/*.sql
var embedMigrations embed.FS

func startMigration(c *cli.Context) error {
	//container, ok := c.App.Metadata["container"].(*do.Injector)
	//if !ok {
	//	return errors.New("invalid service container")
	//}
	//
	//cfg, err := do.Invoke[*config.Config](container)
	//if err != nil {
	//	return err
	//}
	//
	//pool, err := do.Invoke[*pgxpool.Pool](container)
	//if err != nil {
	//	return nil, err
	//}
	//
	//goose.SetBaseFS(embedMigrations)
	//
	//migrateAction := c.String(config.FlagMigrateAction)
	//switch migrateAction {
	//case config.FlagUpAction:
	//	return goose.Up(pool, "migrations")
	//case config.FlagDownAction:
	//	return goose.Down(context.GetContextSQL().DB, "migrations")
	//default:
	//	return fmt.Errorf(`migration: invalid magration flags. "up" or "down" only`)
	//}
	return nil
}
