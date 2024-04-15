package context

import (
	"context"
	"fmt"
	"log"
	"os"
	"strings"

	"bridge/app/blockchain"
	"bridge/app/blockchain/chainFactory"
	"bridge/config"
	"bridge/db"

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

func SetContextRedisClient(cfg db.RedisConfig) {
	redisClient := db.NewRedis(cfg)
	ctx = context.WithValue(ctx, contextRedisClient, redisClient)
	log.Println("redis", redisClient.Ping(ctx).String())
}

func SetContextSQL(cfg db.DatabaseConfig) {
	client := db.NewSQLDB(cfg)
	err := client.Ping()
	if err != nil {
		log.Fatal("Set context SQL error ", err)
		return
	}
	ctx = context.WithValue(ctx, contextSQLRepository, client)
	log.Println("postgres: connected to database")
}

func SetContextConfig(cfg *config.Config) {
	ctx = context.WithValue(ctx, contextConfig, cfg)
}

const envChainIdList = "asd"

func SetChainClient() {
	chainList := strings.Split(os.Getenv(envChainIdList), ".")
	for _, chainId := range chainList {
		chain, err := blockchain.NewChain(chainId)
		log.Println("init chain id :", chainId)
		if err != nil {
			fmt.Println("Set context Chain error", err)
			return
		}
		ctx = context.WithValue(ctx, fmt.Sprintf("%s%s", contextChainClient, chainId), chain)
	}
}

func GetContextChainClient(chainId string) chainFactory.IChain {
	client, _ := ctx.Value(fmt.Sprintf("%s%s", contextChainClient, chainId)).(chainFactory.IChain)
	return client
}
