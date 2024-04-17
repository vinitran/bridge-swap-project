package service

import (
	"context"
	"fmt"
	"log"
	"time"

	"bridge/content"
	b "bridge/content/bob"
	"bridge/db"

	"github.com/google/uuid"
	"github.com/redis/go-redis/v9"
	"github.com/samber/do"
)

type ServiceBridge struct {
	container *do.Injector

	datastoreBridge      content.DatastoreBridge
	datastoreTransaction content.DatastoreTransaction
	cache                db.Cache
}

func cacheKeyBridge(v string) string {
	return fmt.Sprintf("bridge:%v", v)
}

func NewServiceBridge(container *do.Injector) (*ServiceBridge, error) {
	datastoreBridge, err := do.Invoke[content.DatastoreBridge](container)
	if err != nil {
		return nil, err
	}

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

	return &ServiceBridge{
		container:            container,
		datastoreBridge:      datastoreBridge,
		datastoreTransaction: datastoreTransaction,
		cache:                cache,
	}, nil
}

func (service *ServiceBridge) Create(ctx context.Context, params *b.BridgeRequestSetter) (*b.BridgeRequest, error) {
	return service.datastoreBridge.Create(ctx, params)
}

func (service *ServiceBridge) ExistByUser(ctx context.Context, userAddress string) (bool, error) {
	return service.datastoreBridge.ExistByUser(ctx, userAddress)
}

func (service *ServiceBridge) CheckValidForWithdrawal(ctx context.Context, eventId uuid.UUID) (*b.BridgeRequest, error) {
	event, err := service.datastoreTransaction.FindByUID(ctx, eventId)
	if err != nil {
		return nil, err
	}

	return service.datastoreBridge.FindByTx(ctx, event)
}

func (service *ServiceBridge) SetComplete(ctx context.Context, requestId uuid.UUID) error {
	bridgeRq, err := service.datastoreBridge.FindByUID(ctx, requestId)
	if err != nil {
		return err
	}

	return service.datastoreBridge.Delete(ctx, bridgeRq)
}

func (service *ServiceBridge) DeleteExpired(ctx context.Context, t time.Time) error {
	bridgeRq, err := service.datastoreBridge.FindBy(ctx, b.SelectWhere.BridgeRequests.CreatedAt.LTE(t))
	if err != nil {
		return err
	}
	log.Println(bridgeRq)

	return service.datastoreBridge.DeleteExpired(ctx, bridgeRq)
}
