package service

import (
	"context"
	"fmt"
	"time"

	"bridge/content"
	b "bridge/content/bob"
	"bridge/db"

	"github.com/redis/go-redis/v9"
	"github.com/samber/do"
)

type ServiceToken struct {
	container *do.Injector

	datastoreToken content.DatastoreToken
	cache          db.Cache
}

func cacheKeyTokenByAddress(v string) string {
	return fmt.Sprintf("transaction:%v", v)
}

func NewServiceToken(container *do.Injector) (*ServiceToken, error) {
	datastoreToken, err := do.Invoke[content.DatastoreToken](container)
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

	return &ServiceToken{
		container:      container,
		datastoreToken: datastoreToken,
		cache:          cache,
	}, nil
}

func (service *ServiceToken) FindByAddressAndChainId(ctx context.Context, address, inChain, outChain string) (*b.Token, error) {
	return db.UseCache(ctx, service.cache, cacheKeyTokenByAddress(fmt.Sprintf("%s,%s", address, inChain)), 12*time.Second, func() (*b.Token, error) {
		return service.datastoreToken.FindByAddressAndChainId(ctx, address, inChain)
	})
}

func (service *ServiceToken) Exist(ctx context.Context, address, chainId string) (bool, error) {
	return db.UseCache(ctx, service.cache, cacheKeyTokenByAddress(fmt.Sprintf("%s,%s", address, chainId)), 12*time.Second, func() (bool, error) {
		return service.datastoreToken.Exist(ctx, address, chainId)
	})
}

func (service *ServiceToken) FindTokenInOutputChain(ctx context.Context, address, inChain, outChain string) (*b.Token, error) {
	inToken, err := db.UseCache(ctx, service.cache, cacheKeyTokenByAddress(fmt.Sprintf("%s,%s", address, inChain)), 12*time.Second, func() (*b.Token, error) {
		return service.datastoreToken.FindByAddressAndChainId(ctx, address, inChain)
	})
	if err != nil {
		return nil, err
	}

	if inToken == nil {
		return nil, fmt.Errorf("invalid input token")
	}

	outToken, err := db.UseCache(ctx, service.cache, cacheKeyTokenByAddress(fmt.Sprintf("%s,%s", inToken.Name, outChain)), 12*time.Second, func() (*b.Token, error) {
		return service.datastoreToken.FindByNameAndChainId(ctx, inToken.Name, outChain)
	})
	if err != nil {
		return nil, err
	}

	if outToken == nil {
		return nil, fmt.Errorf("invalid output token")
	}

	return outToken, nil
}
