package etherman

import (
	"github.com/ethereum/go-ethereum"
	"github.com/ethereum/go-ethereum/common"
)

// Config represents the configuration of the etherman
type Config struct {
	BscTestnet ChainConfig `mapstructure:"BscTestnet"`
	Sepolia    ChainConfig `mapstructure:"Sepolia"`
}

type ChainConfig struct {
	RPC            string `mapstructure:"RPC"`
	ChainId        uint64 `mapstructure:"ChainId"`
	Erc20TokenList string `mapstructure:"Erc20TokenList"`
	BridgeAddress  string `mapstructure:"BridgeAddress"`
	PrivateKey     string `mapstructure:"PrivateKey"`
	BlockTime      int    `mapstructure:"BlockTime"`
}

const (
	BSC_TESTNET_CHAIN_ID = 97
	SEPOLIA_CHAIN_ID     = 11155111
)

type EventReaderParams struct {
	Filter ethereum.FilterQuery

	EventHash []common.Hash
}

func DefaultQuery(cfg ChainConfig) EventReaderParams {
	return EventReaderParams{
		Filter: ethereum.FilterQuery{
			Addresses: []common.Address{
				common.HexToAddress(cfg.BridgeAddress),
			},
		},
		EventHash: []common.Hash{
			DepositEventHash,
		},
	}
}
