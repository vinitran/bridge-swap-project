package db

import (
	"database/sql"
	"fmt"
	"log"

	"github.com/redis/go-redis/v9"
	"github.com/uptrace/bun"
	"github.com/uptrace/bun/dialect/pgdialect"
	"github.com/uptrace/bun/driver/pgdriver"
)

// NewSQLDB creates a new SQL DB
func NewSQLDB(cfg DatabaseConfig) *bun.DB {
	dsn := fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=disable", cfg.User, cfg.Password, cfg.Host, cfg.Port, cfg.Name)
	log.Println("postgres dns: ", dsn)

	var db *bun.DB
	db = bun.NewDB(sql.OpenDB(pgdriver.NewConnector(
		pgdriver.WithDSN(dsn),
	)), pgdialect.New())

	return db
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
