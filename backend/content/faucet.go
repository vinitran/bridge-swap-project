package content

import (
	"context"
	"fmt"
	"strings"

	"bridge/util"

	"bridge/content/bob"
	"bridge/etherman"

	"github.com/ethereum/go-ethereum/common"
	"github.com/gin-gonic/gin"
)

const amountFaucet = "10000000000000000000" // 10token

type FaucetPayload struct {
	UserAddress string `json:"user_address"`
	Token       string `json:"token"`
	ChainId     string `json:"chain_id"`
}

func (v *V1Router) faucet(c *gin.Context) {
	ctx := context.Background()
	var payload FaucetPayload
	err := c.BindJSON(&payload)
	if err != nil {
		responseErrUnauthorized(c)
		return
	}

	payload.Token = strings.ToLower(payload.Token)
	payload.UserAddress = strings.ToLower(payload.UserAddress)

	isValidToken, err := bob.Tokens(
		ctx,
		SQLRepository(),
		bob.SelectWhere.Tokens.Address.EQ(payload.Token),
		bob.SelectWhere.Tokens.ChainID.EQ(payload.ChainId)).Exists()
	if err != nil {
		responseFailureWithMessage(c, "invalid token")
		return
	}

	if isValidToken == false {
		responseFailureWithMessage(c, "invalid token")
		return
	}

	etherClient, err := etherman.NewClientFromChainId(util.ToUint64(payload.ChainId), ConfigRepository().Etherman)
	if err != nil {
		responseFailureWithMessage(c, "client not found")
		return
	}

	tx, err := etherClient.TransferErc20Token(ctx, etherClient.SenderAddress[0], common.HexToAddress(payload.Token), common.HexToAddress(payload.UserAddress), util.ToBigInt(amountFaucet))
	if err != nil {
		responseErrInternalServerError(c)
		return
	}

	responseSuccessWithMessage(c, fmt.Sprintf("Tx Hash: %s", tx.Hash()))
}
