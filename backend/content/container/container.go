package container

import (
	"net/http"

	"bridge/config"
	"bridge/content"
	"bridge/content/datastore"
	"bridge/content/handler"
	"bridge/content/service"
	"bridge/db"
	"bridge/etherman"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/redis/go-redis/v9"
	"github.com/samber/do"
)

func NewContainer(cfg *config.Config) *do.Injector {
	injector := do.New()

	do.ProvideValue(injector, cfg)

	do.Provide(injector, func(i *do.Injector) (*pgxpool.Pool, error) {
		return db.NewSQLDB(cfg.Database)
	})
	do.Provide(injector, func(i *do.Injector) (*redis.Client, error) {
		return db.NewRedis(cfg.Redis), nil
	})

	do.Provide(injector, ProvideRouter)

	do.Provide(injector, ProvideDatastoreBridge)
	do.Provide(injector, ProvideDatastoreTransaction)
	do.Provide(injector, ProvideDatastoreToken)

	do.Provide(injector, ProvideServiceBridge)
	do.Provide(injector, ProvideServiceTransaction)
	do.Provide(injector, ProvideServiceToken)

	do.Provide(injector, ProvideChainClients)

	return injector
}

func ProvideRouter(i *do.Injector) (http.Handler, error) {
	return handler.New(&handler.Config{
		Container: i,
		Origins:   []string{"*"},
	})
}

func ProvideDatastoreBridge(i *do.Injector) (content.DatastoreBridge, error) {
	pool, err := do.Invoke[*pgxpool.Pool](i)
	if err != nil {
		return nil, err
	}

	return datastore.NewDatastoreBridge(pool)
}

func ProvideDatastoreTransaction(i *do.Injector) (content.DatastoreTransaction, error) {
	pool, err := do.Invoke[*pgxpool.Pool](i)
	if err != nil {
		return nil, err
	}

	return datastore.NewDatastoreTransaction(pool)
}

func ProvideDatastoreToken(i *do.Injector) (content.DatastoreToken, error) {
	pool, err := do.Invoke[*pgxpool.Pool](i)
	if err != nil {
		return nil, err
	}

	return datastore.NewDatastoreToken(pool)
}

func ProvideChainClients(i *do.Injector) ([]*etherman.Client, error) {
	cfg, err := do.Invoke[*config.Config](i)
	if err != nil {
		return nil, err
	}

	chainClient, err := etherman.NewAllClient(cfg.Etherman)
	if err != nil {
		return nil, err
	}

	return chainClient, nil
}

func ProvideServiceBridge(i *do.Injector) (*service.ServiceBridge, error) {
	return service.NewServiceBridge(i)
}

func ProvideServiceTransaction(i *do.Injector) (*service.ServiceTransaction, error) {
	return service.NewServiceTransaction(i)
}

func ProvideServiceToken(i *do.Injector) (*service.ServiceToken, error) {
	return service.NewServiceToken(i)
}
