package main

import (
	"os"

	backend "bridge"
	"github.com/urfave/cli/v2"
)

func versionCmd(*cli.Context) error {
	backend.PrintVersion(os.Stdout)
	return nil
}
