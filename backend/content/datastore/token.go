package datastore

import (
	"context"

	b "bridge/content/bob"
)

type DatastoreToken struct {
	pool        PGXPool
	bobExecutor BobExecutor
}

func (ds *DatastoreToken) FindByAddressAndChainId(ctx context.Context, address, chainId string) (*b.Token, error) {
	return b.TokensTable.Query(ctx, ds.bobExecutor,
		b.SelectWhere.Tokens.Address.EQ(address),
		b.SelectWhere.Tokens.ChainID.EQ(chainId)).One()
}

func (ds *DatastoreToken) FindByNameAndChainId(ctx context.Context, name, chainId string) (*b.Token, error) {
	return b.TokensTable.Query(ctx, ds.bobExecutor,
		b.SelectWhere.Tokens.Name.EQ(name),
		b.SelectWhere.Tokens.ChainID.EQ(chainId)).One()
}

func (ds *DatastoreToken) Exist(ctx context.Context, address, chainId string) (bool, error) {
	return b.TokensTable.Query(ctx, ds.bobExecutor,
		b.SelectWhere.Tokens.Address.EQ(address),
		b.SelectWhere.Tokens.ChainID.EQ(chainId)).Exists()
}

func NewDatastoreToken(pool PGXPool) (*DatastoreToken, error) {
	return &DatastoreToken{pool, &BobExecutorPgx{pool}}, nil
}
