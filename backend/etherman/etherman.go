package etherman

import (
	"context"
	"errors"
	"fmt"
	"math/big"
	"strconv"
	"strings"
	"time"

	"github.com/ethereum/go-ethereum/crypto"

	BridgeRouter "bridge/etherman/smartcontract/bridgeRouter"
	Erc20 "bridge/etherman/smartcontract/erc20token"

	"github.com/ethereum/go-ethereum"
	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/ethclient"
)

var (
	DepositEventHash  = crypto.Keccak256Hash([]byte("Deposit(address,address,uint256)"))
	TransferEventHash = crypto.Keccak256Hash([]byte("Transfer(address,address,uint256)"))

	ErrNotFound           = errors.New("not found")
	ErrInvalidChainId     = errors.New("invalid chainid")
	ErrPrivateKeyNotFound = errors.New("can't find sender private key to sign tx")
)

type ethereumClient interface {
	ethereum.ChainReader
	ethereum.ChainStateReader
	ethereum.ContractCaller
	ethereum.GasEstimator
	ethereum.GasPricer
	ethereum.LogFilterer
	ethereum.TransactionReader
	ethereum.TransactionSender

	bind.DeployBackend
}

// Client is a simple implementation of EtherMan.
type Client struct {
	EthClient     ethereumClient
	Erc20Token    map[common.Address]*Erc20.Erc20Token
	BridgeRouter  *BridgeRouter.BridgeRouter
	Cfg           ChainConfig
	sender        map[common.Address]*bind.TransactOpts // empty in case of read-only client
	SenderAddress []common.Address
}

func NewClientFromChainId(chainId uint64, cfg Config) (*Client, error) {
	switch chainId {
	case BSC_TESTNET_CHAIN_ID:
		return NewClient(cfg.BscTestnet)
	case SEPOLIA_CHAIN_ID:
		return NewClient(cfg.Sepolia)
	default:
		return nil, ErrInvalidChainId
	}
}

func NewAllClient(cfg Config) ([]*Client, error) {
	var clients []*Client

	bscTestnet, err := NewClient(cfg.BscTestnet)
	if err != nil {
		return nil, err
	}
	clients = append(clients, bscTestnet)

	sepolia, err := NewClient(cfg.Sepolia)
	if err != nil {
		return nil, err
	}
	clients = append(clients, sepolia)

	return clients, nil
}

func NewClient(cfg ChainConfig) (*Client, error) {
	ethClient, err := ethclient.Dial(cfg.RPC)
	if err != nil {
		return nil, fmt.Errorf("error connecting to %s: %e", cfg.RPC, err)
	}

	erc20Token := make(map[common.Address]*Erc20.Erc20Token)

	erc20TokenList := strings.Split(cfg.Erc20TokenList, ".")
	if len(erc20TokenList) == 0 {
		return nil, ErrNotFound
	}
	for _, token := range erc20TokenList {
		tokenAddr := common.HexToAddress(token)
		instanceToken, err := Erc20.NewErc20Token(tokenAddr, ethClient)
		if err != nil {
			return nil, err
		}
		erc20Token[tokenAddr] = instanceToken
	}

	bridgeContract, err := BridgeRouter.NewBridgeRouter(common.HexToAddress(cfg.BridgeAddress), ethClient)
	if err != nil {
		return nil, err
	}

	sender := make(map[common.Address]*bind.TransactOpts)
	var senderAddress []common.Address

	privateKeyList := strings.Split(cfg.PrivateKey, ".")
	if len(privateKeyList) == 0 {
		return nil, ErrNotFound
	}
	for _, privateKey := range privateKeyList {
		address, err := GetAddress(privateKey)
		if err != nil {
			return nil, err
		}
		senderAddress = append(senderAddress, address)

		auth, err := GetAuth(privateKey, cfg.ChainId)
		if err != nil {
			return nil, err
		}

		sender[address] = auth
	}
	return &Client{
		EthClient:     ethClient,
		Erc20Token:    erc20Token,
		Cfg:           cfg,
		BridgeRouter:  bridgeContract,
		sender:        sender,
		SenderAddress: senderAddress,
	}, nil
}

// SendTx sends a tx
func (etherMan *Client) SendTx(ctx context.Context, tx *types.Transaction) error {
	return etherMan.EthClient.SendTransaction(ctx, tx)
}

// SignTx tries to sign a transaction accordingly to the provided sender
func (etherMan *Client) SignTx(sender common.Address, tx *types.Transaction) (*types.Transaction, error) {
	auth, err := etherMan.getAuthByAddress(sender)
	if errors.Is(err, ErrNotFound) {
		return nil, ErrPrivateKeyNotFound
	}

	signedTx, err := auth.Signer(auth.From, tx)
	if err != nil {
		return nil, err
	}

	return signedTx, nil
}

// getAuthByAddress tries to get an authorization from the authorizations map
func (etherMan *Client) getAuthByAddress(addr common.Address) (*bind.TransactOpts, error) {
	auth, found := etherMan.sender[addr]
	if !found {
		return nil, ErrNotFound
	}
	return auth, nil
}

// AddOrReplaceAuth adds an authorization or replace an existent one to the same account
func (etherMan *Client) AddOrReplaceAuth(auth bind.TransactOpts) error {
	etherMan.sender[auth.From] = &auth
	return nil
}

func (etherMan *Client) TransferErc20Token(ctx context.Context, account, token, to common.Address, amount *big.Int) (*types.Transaction, error) {
	opts, err := etherMan.getAuthByAddress(account)
	if errors.Is(err, ErrNotFound) {
		return nil, errors.New("can't find account private key to sign tx")
	}

	tx, err := etherMan.Erc20Token[token].Transfer(opts, to, amount)
	if err != nil {
		return nil, fmt.Errorf("error transfer erc20 token to %s. Error: %w", to.String(), err)
	}

	return tx, nil
}

func (etherMan *Client) AmountTokenInBridgePool(token common.Address) (*big.Int, error) {
	tokenAmount, err := etherMan.BridgeRouter.GetAmountTokenInPool(&bind.CallOpts{}, token)
	if err != nil {
		return nil, err
	}
	return tokenAmount, nil
}

// HeaderByNumber returns a block header from the current canonical chain. If number is nil, the latest known header is returned.
func (etherMan *Client) HeaderByNumber(ctx context.Context, number *big.Int) (*types.Header, error) {
	return etherMan.EthClient.HeaderByNumber(ctx, number)
}

// EthBlockByNumber function retrieves the ethereum block information by ethereum block number.
func (etherMan *Client) EthBlockByNumber(ctx context.Context, blockNumber uint64) (*types.Block, error) {
	block, err := etherMan.EthClient.BlockByNumber(ctx, new(big.Int).SetUint64(blockNumber))
	if err != nil {
		if errors.Is(err, ethereum.NotFound) || err.Error() == "block does not exist in blockchain" {
			return nil, ErrNotFound
		}
		return nil, err
	}
	return block, nil
}

// GetTx function get ethereum tx
func (etherMan *Client) GetTx(ctx context.Context, txHash common.Hash) (*types.Transaction, bool, error) {
	return etherMan.EthClient.TransactionByHash(ctx, txHash)
}

// CurrentNonce returns the current nonce for the provided account
func (etherMan *Client) CurrentNonce(ctx context.Context, account common.Address) (uint64, error) {
	return etherMan.EthClient.NonceAt(ctx, account, nil)
}

func (etherMan *Client) SubcribeNewEvents(ctx context.Context, query EventReaderParams, logs chan<- EventDatastore) error {
	block, err := etherMan.HeaderByNumber(ctx, nil)
	if err != nil {
		return err
	}

	for {
		queryEvent := EventReaderParams{
			Filter: ethereum.FilterQuery{
				FromBlock: block.Number,
				ToBlock:   block.Number,
				Addresses: query.Filter.Addresses,
			},
			EventHash: query.EventHash,
		}

		currentBlock, err := etherMan.HeaderByNumber(ctx, nil)
		if err != nil {
			return err
		}

		if currentBlock.Number.Cmp(block.Number) == -1 {
			timeDelay := (block.Number.Int64()-currentBlock.Number.Int64())*int64(etherMan.Cfg.BlockTime) + 10
			time.Sleep(time.Duration(timeDelay) * time.Second)
			continue
		}
		txEvent, err := etherMan.ReadEvents(ctx, queryEvent)
		if err != nil {
			return err
		}

		block.Number.Add(block.Number, big.NewInt(1))

		if txEvent == nil {
			continue
		}
		if len(txEvent) > 0 {
			for _, event := range txEvent {
				tx, err := etherMan.ProcessEvent(event)
				if err != nil {
					return err
				}
				logs <- tx
			}
		}
	}
}

func (etherMan *Client) ReadEvents(ctx context.Context, query EventReaderParams) ([]*types.Log, error) {
	logs, err := etherMan.EthClient.FilterLogs(context.Background(), query.Filter)
	if err != nil {
		return nil, err
	}

	if len(logs) == 0 {
		return nil, nil
	}

	var data []*types.Log

	for _, vLog := range logs {
		for _, event := range query.EventHash {
			if vLog.Topics[0] == event {
				data = append(data, &vLog)
				continue
			}
		}
	}

	return data, nil
}

func (etherMan *Client) ProcessEvent(event *types.Log) (EventDatastore, error) {
	timeStamp, err := etherMan.TimeOfBlock(big.NewInt(int64(event.BlockNumber)))
	if err != nil {
		return EventDatastore{}, err
	}

	return EventDatastore{
		User:       strings.ToLower(common.HexToAddress(event.Topics[1].Hex()).String()),
		Token:      strings.ToLower(common.HexToAddress(event.Topics[2].Hex()).String()),
		RawAmount:  new(big.Int).SetBytes(event.Data).String(),
		ChainID:    strconv.FormatInt(int64(etherMan.Cfg.ChainId), 10),
		Hash:       strings.ToLower(event.TxHash.String()),
		IsComplete: false,
		CreatedAt:  timeStamp,
		UpdatedAt:  timeStamp,
	}, nil
}

func (etherMan *Client) TimeOfBlock(block *big.Int) (time.Time, error) {
	header, err := etherMan.EthClient.HeaderByNumber(context.Background(), block)
	if err != nil {
		return time.Time{}, err
	}

	timeStamp := time.Unix(int64(header.Time), 0)
	return timeStamp, nil
}

func (etherMan *Client) CallWithdrawal(ctx context.Context, account, token, user common.Address, amount *big.Int) (*types.Transaction, error) {
	opts, err := etherMan.getAuthByAddress(account)
	if errors.Is(err, ErrNotFound) {
		return nil, errors.New("can't find account private key to sign tx")
	}

	tx, err := etherMan.BridgeRouter.Withdraw(opts, token, user, amount)
	if err != nil {
		return nil, fmt.Errorf("error withdraw token to %s. Error: %w", user.String(), err)
	}

	return tx, nil
}
