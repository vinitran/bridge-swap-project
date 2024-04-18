package service

import (
	"context"
	"fmt"
	"time"

	"github.com/aarondl/opt/omit"

	"bridge/content"
	b "bridge/content/bob"
	"bridge/db"

	"github.com/google/uuid"
	"github.com/redis/go-redis/v9"
	"github.com/samber/do"
)

type ServiceTransaction struct {
	container *do.Injector

	datastoreTransaction content.DatastoreTransaction
	cache                db.Cache
}

func cacheKeyTransactionByID(v string) string {
	return fmt.Sprintf("transaction:%v", v)
}

func NewServiceTransaction(container *do.Injector) (*ServiceTransaction, error) {
	datastoreTransaction, err := do.Invoke[content.DatastoreTransaction](container)
	if err != nil {
		return nil, err
	}

	dbRedis, err := do.Invoke[*redis.Client](container)
	if err != nil {
		return nil, err
	}

	cache, err := db.NewCacheRedis(dbRedis)
	if err != nil {
		return nil, err
	}

	return &ServiceTransaction{
		container:            container,
		datastoreTransaction: datastoreTransaction,
		cache:                cache,
	}, nil
}

func (service *ServiceTransaction) Create(ctx context.Context, params *b.Transaction) (*b.Transaction, error) {
	return service.datastoreTransaction.Create(ctx, params)
}

func (service *ServiceTransaction) FindByUID(ctx context.Context, id uuid.UUID) (*b.Transaction, error) {
	return db.UseCache(ctx, service.cache, cacheKeyTransactionByID(id.String()), 12*time.Second, func() (*b.Transaction, error) {
		return service.datastoreTransaction.FindByUID(ctx, id)
	})
}

func (service *ServiceTransaction) SetCompleteTransaction(ctx context.Context, id uuid.UUID) error {
	return service.datastoreTransaction.Update(ctx, id, &b.TransactionSetter{
		IsComplete: omit.From(true),
	})
}
