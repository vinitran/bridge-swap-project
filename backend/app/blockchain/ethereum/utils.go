package ethereum

import (
	"math/big"

	"github.com/ethereum/go-ethereum/crypto"
)

var depositEventHash = crypto.Keccak256Hash([]byte("Deposit(address,address,uint256)")).Hex()

const (
	gasLimitURC20Token = 300000
)

func StringToBigInt(s string) *big.Int {
	n := new(big.Int)
	n, _ = n.SetString(s, 10)
	return n
}
