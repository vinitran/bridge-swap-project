package datastore

import (
	"context"
	"time"

	b "bridge/content/bob"

	"github.com/aarondl/opt/omit"
	"github.com/google/uuid"
	"github.com/stephenafamo/bob"
)

type DatastoreBridgeRequest struct{}

func (ds *DatastoreBridgeRequest) Insert(ctx context.Context, exec bob.Executor, params *b.BridgeRequest) (*b.BridgeRequest, error) {
	paramsSetter := b.BridgeRequestSetter{
		ID:          omit.From(uuid.New()),
		UserAddress: omit.From(params.UserAddress),
		Token:       omit.From(params.Token),
		RawAmount:   omit.From(params.RawAmount),
		InputChain:  omit.From(params.InputChain),
		OutputChain: omit.From(params.OutputChain),
		IsComplete:  omit.From(params.IsComplete),
		CreatedAt:   omit.From(time.Now()),
		UpdatedAt:   omit.From(time.Now()),
	}
	return b.BridgeRequestsTable.Insert(ctx, exec, &paramsSetter)
}

func (ds *DatastoreBridgeRequest) IsInRequest(ctx context.Context, exec bob.Executor, userAddress string) (bool, error) {
	return b.BridgeRequestsTable.Query(ctx, exec, b.SelectWhere.BridgeRequests.UserAddress.EQ(userAddress)).Exists()
}

func (ds *DatastoreBridgeRequest) CheckValidForWithdrawal(ctx context.Context, exec bob.Executor, eventId string) (*b.BridgeRequest, error) {
	event, err := b.FindTransaction(ctx, exec, uuid.MustParse(eventId))
	if err != nil {
		return nil, err
	}

	return b.BridgeRequestsTable.Query(ctx, exec,
		b.SelectWhere.BridgeRequests.UserAddress.EQ(event.User),
		b.SelectWhere.BridgeRequests.Token.EQ(event.Token),
		b.SelectWhere.BridgeRequests.RawAmount.EQ(event.RawAmount),
		b.SelectWhere.BridgeRequests.InputChain.EQ(event.ChainID),
		b.SelectWhere.BridgeRequests.IsComplete.EQ(false)).One()
}

func (ds *DatastoreBridgeRequest) SetComplete(ctx context.Context, exec bob.Executor, requestId string) error {
	bridgeRq, err := b.FindBridgeRequest(ctx, exec, uuid.MustParse(requestId))
	if err != nil {
		return err
	}

	_, err = b.BridgeRequestsTable.Delete(ctx, exec, bridgeRq)
	return err
}
