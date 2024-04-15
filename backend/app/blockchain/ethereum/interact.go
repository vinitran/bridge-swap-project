package ethereum

import (
	"context"
	"crypto/ecdsa"
	"fmt"
	"math/big"

	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/crypto"
)

func (e *Ethereum) Auth(privateK string) (*bind.TransactOpts, error) {
	privateKey, err := crypto.HexToECDSA(privateK)
	if err != nil {
		return nil, err
	}

	publicKey := privateKey.Public()
	publicKeyECDSA, ok := publicKey.(*ecdsa.PublicKey)
	if !ok {
		return nil, fmt.Errorf("cannot assert type: publicKey is not of type *ecdsa.PublicKey")
	}

	fromAddress := crypto.PubkeyToAddress(*publicKeyECDSA)
	nonce, err := e.client.PendingNonceAt(context.Background(), fromAddress)
	if err != nil {
		return nil, err
	}

	gasPrice, err := e.client.SuggestGasPrice(context.Background())
	if err != nil {
		return nil, err
	}

	chainID, err := e.client.NetworkID(context.Background())
	if err != nil {
		return nil, err
	}

	auth, err := bind.NewKeyedTransactorWithChainID(privateKey, chainID)
	if err != nil {
		return nil, err
	}

	auth.Nonce = big.NewInt(int64(nonce))
	auth.Value = big.NewInt(0)                 // in wei
	auth.GasLimit = uint64(gasLimitURC20Token) // in units
	auth.GasPrice = gasPrice

	return auth, nil
}

func (e *Ethereum) CallWithdrawalInContract(auth *bind.TransactOpts, token, user string, amount *big.Int) error {
	tx, err := e.bridgeRouter.Withdraw(auth, common.HexToAddress(token), common.HexToAddress(user), amount)
	if err != nil {
		return err
	}

	fmt.Printf("tx sent: %s", tx.Hash().Hex())
	return nil
}

func (e *Ethereum) Transfer(auth *bind.TransactOpts, token, user string, amount *big.Int) (string, error) {
	erc20, err := NewErc20Token(common.HexToAddress(token), e.client)
	if err != nil {
		return "", err
	}
	tx, err := erc20.Transfer(auth, common.HexToAddress(user), amount)
	if err != nil {
		return "", err
	}

	return tx.Hash().Hex(), nil
}

func (e *Ethereum) GetTokenAmountInPool(token string) (*big.Int, error) {
	tokenAmount, err := e.bridgeRouter.GetAmountTokenInPool(&bind.CallOpts{}, common.HexToAddress(token))
	if err != nil {
		return nil, err
	}

	return tokenAmount, nil
}
