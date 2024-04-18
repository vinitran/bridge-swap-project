package db

import (
	"context"
	"fmt"
	"log"
	"runtime"

	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/redis/go-redis/v9"
)

// NewSQLDB creates a new SQL DB
func NewSQLDB(cfg DatabaseConfig) (*pgxpool.Pool, error) {
	dsn := fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=disable", cfg.User, cfg.Password, cfg.Host, cfg.Port, cfg.Name)
	config, err := pgxpool.ParseConfig(dsn)
	if err != nil {
		return nil, err
	}
	log.Printf("connecting to %s", dsn)

	max := runtime.NumCPU() * 4
	config.MaxConns = int32(max)

	return pgxpool.NewWithConfig(context.Background(), config)
}

// NewRedis creates a new REDIS DB
func NewRedis(cfg RedisConfig) *redis.Client {
	redisAddr := fmt.Sprintf("%s:%s", cfg.Host, cfg.Port)
	log.Println("redis dns: ", redisAddr)

	rdb := redis.NewClient(&redis.Options{
		Addr:     redisAddr,
		Password: cfg.Password, // no password set
		DB:       0,            // use default DB
	})
	return rdb
}
