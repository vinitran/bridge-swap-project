package context

import (
	"context"

	"bridge/config"

	"github.com/redis/go-redis/v9"
	"github.com/uptrace/bun"
)

const (
	contextSQLRepository = "CONTEXT_SQL_REPOSITORY"
	contextRedisClient   = "CONTEXT_REDIS_CLIENT"
	contextChainClient   = "CONTEXT_CHAIN_CLIENT_"
	contextConfig        = "CONTEXT_CONFIG"
)

var ctx = context.Background()

func GetContextConfig() *config.Config {
	client, _ := ctx.Value(contextConfig).(*config.Config)
	return client
}

func GetContextSQL() *bun.DB {
	client, _ := ctx.Value(contextSQLRepository).(*bun.DB)
	return client
}

func GetContextRedisClient() *redis.Client {
	client, _ := ctx.Value(contextRedisClient).(*redis.Client)
	return client
}
