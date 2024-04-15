package etherman

import (
	"crypto/ecdsa"
	"fmt"
	"math/big"
	"strings"
	"time"

	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/crypto"
)

// GetAuth configures and returns an auth object.
func GetAuth(privateKeyStr string, chainID uint64) (*bind.TransactOpts, error) {
	privateKey, err := crypto.HexToECDSA(strings.TrimPrefix(privateKeyStr, "0x"))
	if err != nil {
		return nil, err
	}

	return bind.NewKeyedTransactorWithChainID(privateKey, big.NewInt(0).SetUint64(chainID))
}

func GetAddress(privateKeyStr string) (common.Address, error) {
	privateKey, err := crypto.HexToECDSA(privateKeyStr)
	if err != nil {
		return common.Address{}, nil
	}

	publicKey := privateKey.Public()
	publicKeyECDSA, ok := publicKey.(*ecdsa.PublicKey)
	if !ok {
		return common.Address{}, fmt.Errorf("error casting public key to ECDSA")
	}

	return crypto.PubkeyToAddress(*publicKeyECDSA), nil
}

type EventDatastore struct {
	User       string    `db:"user" `
	Token      string    `db:"token" `
	RawAmount  string    `db:"raw_amount" `
	ChainID    string    `db:"chain_id" `
	IsComplete bool      `db:"is_complete" `
	CreatedAt  time.Time `db:"created_at" `
	UpdatedAt  time.Time `db:"updated_at" `
	Hash       string    `db:"hash" `
}
