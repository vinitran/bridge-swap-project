package main

import (
	context2 "context"

	"bridge/config"

	"bridge/app/blockchain/chainFactory"
	"bridge/context"

	"github.com/redis/go-redis/v9"
	"github.com/stephenafamo/bob"
)

var ctx = context2.Background()

const (
	contextSQLRepository = "CONTEXT_SQL_REPOSITORY"
	contextRedisClient   = "CONTEXT_REDIS_CLIENT"
	contextChainClient   = "CONTEXT_CHAIN_CLIENT_"
	contextConfig        = "CONTEXT_CONFIG"
)

func SQLRepository() bob.DB {
	return bob.NewDB(context.GetContextSQL().DB)
}

func RedisRepository() *redis.Client {
	return context.GetContextRedisClient()
}

func ChainRepository(chainId string) chainFactory.IChain {
	return context.GetContextChainClient(chainId)
}

func Config() *config.Config {
	return context.GetContextConfig()
}
