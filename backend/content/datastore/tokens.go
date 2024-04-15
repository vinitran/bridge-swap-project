package datastore

import (
	"context"
	"fmt"

	b "bridge/content/bob"

	"github.com/stephenafamo/bob"
)

type DatastoreToken struct{}

func (ds *DatastoreToken) FindTokenInOutputChain(ctx context.Context, exec bob.Executor, address, inChain, outChain string) (*b.Token, error) {
	inToken, err := b.TokensTable.Query(ctx, exec,
		b.SelectWhere.Tokens.Address.EQ(address),
		b.SelectWhere.Tokens.ChainID.EQ(inChain)).One()
	if err != nil {
		return nil, err
	}

	if inToken == nil {
		return nil, fmt.Errorf("invalid input token")
	}

	outToken, err := b.TokensTable.Query(ctx, exec,
		b.SelectWhere.Tokens.Name.In(inToken.Name),
		b.SelectWhere.Tokens.ChainID.In(outChain)).One()
	if err != nil {
		return nil, err
	}

	if inToken == nil {
		return nil, fmt.Errorf("invalid output token")
	}

	return outToken, nil
}
