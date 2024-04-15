package chainFactory

import (
	"fmt"
	"math/big"
	"os"
	"strconv"

	"bridge/content/bob"
)

type Chain struct {
	ChainId   string `json:"chain_id"`
	BlockTime int    `json:"block_time"` // block time unit is second
}

func (c *Chain) Init(chainId string) error {
	blockTimeStr := os.Getenv(fmt.Sprintf("BLOCK_TIME_%s", chainId))
	if blockTimeStr == "" {
		return fmt.Errorf("chain: Invalid chain id")
	}
	blockTime, _ := strconv.Atoi(blockTimeStr)

	c.BlockTime = blockTime
	c.ChainId = chainId
	return nil
}

type IChain interface {
	Init(chainId string) error
	NewClient() error
	TrackDeposit(events chan bob.Transaction) error
	CallWithdrawal(token, user, amount string) error
	GetTokenInPool(token string) (*big.Int, error)
	TransferErc20(token, to, amount string) (string, error)
}
