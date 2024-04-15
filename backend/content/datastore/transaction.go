package datastore

import (
	"context"

	b "bridge/content/bob"

	"github.com/aarondl/opt/omit"
	"github.com/google/uuid"
	"github.com/stephenafamo/bob"
)

type DatastoreTransaction struct{}

func (ds *DatastoreTransaction) Insert(ctx context.Context, exec bob.Executor, params *b.Transaction) (*b.Transaction, error) {
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
	return b.TransactionsTable.Insert(ctx, exec, &paramsSetter)
}

func (ds *DatastoreTransaction) FindById(ctx context.Context, exec bob.Executor, id string) (*b.Transaction, error) {
	return b.FindTransaction(ctx, exec, uuid.MustParse(id))
}

func (ds *DatastoreTransaction) SetComplete(ctx context.Context, exec bob.Executor, txId string) error {
	tx, err := b.FindTransaction(ctx, exec, uuid.MustParse(txId))
	if err != nil {
		return err
	}
	tx.IsComplete = true

	_, err = b.TransactionsTable.Update(ctx, exec, tx)
	return err
}
