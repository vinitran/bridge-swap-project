package datastore

import (
	"context"

	b "bridge/content/bob"

	"github.com/aarondl/opt/omit"
	"github.com/google/uuid"
)

type DatastoreTransaction struct {
	pool        PGXPool
	bobExecutor BobExecutor
}

func (ds *DatastoreTransaction) Create(ctx context.Context, params *b.Transaction) (*b.Transaction, error) {
	paramsSetter := b.TransactionSetter{
		ID:         omit.From(uuid.New()),
		User:       omit.From(params.User),
		Token:      omit.From(params.Token),
		RawAmount:  omit.From(params.RawAmount),
		ChainID:    omit.From(params.ChainID),
		IsComplete: omit.From(params.IsComplete),
		Hash:       omit.From(params.Hash),
		CreatedAt:  omit.From(params.CreatedAt),
		UpdatedAt:  omit.From(params.UpdatedAt),
	}
	return b.TransactionsTable.Insert(ctx, ds.bobExecutor, &paramsSetter)
}

func (ds *DatastoreTransaction) FindByUID(ctx context.Context, id uuid.UUID) (*b.Transaction, error) {
	return b.FindTransaction(ctx, ds.bobExecutor, id)
}

func (ds *DatastoreTransaction) Update(ctx context.Context, tx *b.Transaction) error {
	_, err := b.TransactionsTable.Update(ctx, ds.bobExecutor, tx)
	return err
}

func NewDatastoreTransaction(pool PGXPool) (*DatastoreTransaction, error) {
	return &DatastoreTransaction{pool, &BobExecutorPgx{pool}}, nil
}
