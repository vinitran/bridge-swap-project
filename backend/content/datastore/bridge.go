package datastore

import (
	"context"
	"time"

	b "bridge/content/bob"

	"github.com/aarondl/opt/omit"
	"github.com/google/uuid"
)

type DatastoreBridge struct {
	pool        PGXPool
	bobExecutor BobExecutor
}

func (ds *DatastoreBridge) Create(ctx context.Context, params *b.BridgeRequestSetter) (*b.BridgeRequest, error) {
	params.ID = omit.From(uuid.New())
	params.CreatedAt = omit.From(time.Now())
	params.UpdatedAt = omit.From(time.Now())
	return b.BridgeRequestsTable.Insert(ctx, ds.bobExecutor, params)
}

func (ds *DatastoreBridge) ExistByUser(ctx context.Context, userAddress string) (bool, error) {
	return b.BridgeRequestsTable.Query(
		ctx,
		ds.bobExecutor,
		b.SelectWhere.BridgeRequests.UserAddress.EQ(userAddress)).Exists()
}

func (ds *DatastoreBridge) FindByUID(ctx context.Context, id uuid.UUID) (*b.BridgeRequest, error) {
	return b.FindBridgeRequest(ctx, ds.bobExecutor, id)
}

func (ds *DatastoreBridge) FindByTx(ctx context.Context, event *b.Transaction) (*b.BridgeRequest, error) {
	return b.BridgeRequestsTable.Query(ctx, ds.bobExecutor,
		b.SelectWhere.BridgeRequests.UserAddress.EQ(event.User),
		b.SelectWhere.BridgeRequests.Token.EQ(event.Token),
		b.SelectWhere.BridgeRequests.RawAmount.EQ(event.RawAmount),
		b.SelectWhere.BridgeRequests.InputChain.EQ(event.ChainID),
		b.SelectWhere.BridgeRequests.IsComplete.EQ(false)).One()
}

func (ds *DatastoreBridge) Delete(ctx context.Context, rq *b.BridgeRequest) error {
	_, err := b.BridgeRequestsTable.Delete(ctx, ds.bobExecutor, rq)
	return err
}

func NewDatastoreBridge(pool PGXPool) (*DatastoreBridge, error) {
	return &DatastoreBridge{pool, &BobExecutorPgx{pool}}, nil
}
