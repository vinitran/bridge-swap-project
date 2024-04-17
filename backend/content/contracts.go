package content

import (
	"context"

	"github.com/stephenafamo/bob"
	"github.com/stephenafamo/bob/dialect/psql/dialect"

	b "bridge/content/bob"

	"github.com/google/uuid"
)

type DatastoreBridge interface {
	Create(ctx context.Context, params *b.BridgeRequestSetter) (*b.BridgeRequest, error)
	ExistByUser(ctx context.Context, userAddress string) (bool, error)
	FindByUID(ctx context.Context, id uuid.UUID) (*b.BridgeRequest, error)
	FindByTx(ctx context.Context, event *b.Transaction) (*b.BridgeRequest, error)
	FindBy(ctx context.Context, mods bob.Mod[*dialect.SelectQuery]) (b.BridgeRequestSlice, error)
	Delete(ctx context.Context, rq *b.BridgeRequest) error
	FindAndDelete(ctx context.Context, mods bob.Mod[*dialect.DeleteQuery]) error
}

type DatastoreToken interface {
	FindByAddressAndChainId(ctx context.Context, address, chainId string) (*b.Token, error)
	FindByNameAndChainId(ctx context.Context, name, chainId string) (*b.Token, error)
	Exist(ctx context.Context, address, chainId string) (bool, error)
}

type DatastoreTransaction interface {
	Create(ctx context.Context, params *b.Transaction) (*b.Transaction, error)
	FindByUID(ctx context.Context, id uuid.UUID) (*b.Transaction, error)
	Update(ctx context.Context, id uuid.UUID, params *b.TransactionSetter) error
}
