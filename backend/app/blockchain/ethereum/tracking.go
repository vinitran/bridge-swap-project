package ethereum

import (
	"context"
	"fmt"
	"math/big"
	"strings"
	"time"

	"bridge/content/bob"

	"github.com/ethereum/go-ethereum"
	"github.com/ethereum/go-ethereum/common"
)

func (e *Ethereum) getEvents(msg chan bob.Transaction, contract common.Address) {
	block, err := e.latestBlock()
	if err != nil {
		fmt.Println(err)
		return
	}

	for {
		current, err := e.latestBlock()
		if err != nil {
			fmt.Println(err)
			continue
		}

		if current.Cmp(block) == -1 {
			timeDelay := (block.Int64()-current.Int64())*int64(e.BlockTime) + 10
			time.Sleep(time.Duration(timeDelay) * time.Second)
			continue
		}

		txEvent, err := e.eventByBlockNumber(block, contract)
		if err != nil {
			fmt.Println(err)
			continue
		}

		if len(txEvent) > 0 {
			for _, dt := range txEvent {
				msg <- dt
			}
		}

		block.Add(block, big.NewInt(1))
	}
}

func (e *Ethereum) eventByBlockNumber(number *big.Int, contracts common.Address) ([]bob.Transaction, error) {
	// Assume that number is less than current block
	query := ethereum.FilterQuery{
		FromBlock: number,
		ToBlock:   number,
		Addresses: []common.Address{
			contracts,
		},
	}

	logs, err := e.client.FilterLogs(context.Background(), query)
	if err != nil {
		return nil, err
	}

	if len(logs) < 1 {
		return nil, err
	}

	var data []bob.Transaction

	for _, vLog := range logs {
		switch vLog.Topics[0].Hex() {
		case depositEventHash:
			if len(vLog.Topics) < 3 {
				continue
			}

			timeStamp, err := e.timeOfBlock(big.NewInt(int64(vLog.BlockNumber)))
			if err != nil {
				fmt.Println(err)
				continue
			}

			data = append(data, bob.Transaction{
				User:       strings.ToLower(common.HexToAddress(vLog.Topics[1].Hex()).String()),
				Token:      strings.ToLower(common.HexToAddress(vLog.Topics[2].Hex()).String()),
				RawAmount:  new(big.Int).SetBytes(vLog.Data).String(),
				ChainID:    e.ChainId,
				Hash:       strings.ToLower(vLog.TxHash.String()),
				IsComplete: false,
				CreatedAt:  timeStamp,
				UpdatedAt:  timeStamp,
			})
		}
	}

	return data, nil
}

func (e *Ethereum) latestBlock() (*big.Int, error) {
	header, err := e.client.HeaderByNumber(context.Background(), nil)
	if err != nil {
		return nil, err
	}

	return header.Number, nil
}

func (e *Ethereum) timeOfBlock(block *big.Int) (time.Time, error) {
	header, err := e.client.HeaderByNumber(context.Background(), block)
	if err != nil {
		return time.Time{}, err
	}

	timeStamp := time.Unix(int64(header.Time), 0)
	return timeStamp, nil
}
