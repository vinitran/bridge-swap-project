package main

import (
	"fmt"
	"log"
	"strings"
	"time"

	"bridge/config"
	"bridge/content"
	"bridge/context"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/urfave/cli/v2"
)

func beforeStartApiServer(c *cli.Context) error {
	cfg, err := config.Load(c)
	if err != nil {
		return err
	}
	context.SetContextConfig(cfg)
	context.SetContextSQL(cfg.Database)
	context.SetContextRedisClient(cfg.Redis)
	context.SetChainClient()
	return nil
}

func startAPIServer(c *cli.Context) error {
	router := gin.Default()
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"},
		AllowHeaders:     []string{"*"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	addr := strings.ToLower(c.String(config.FlagAddress))
	if addr == "" {
		return fmt.Errorf("[API Server] start error: addr is empty")
	}

	log.Printf("Listen And Serve: %s\n", addr)

	v1 := router.Group("/api/v1")
	content.NewV1Router(v1)

	return router.Run(addr)
}
