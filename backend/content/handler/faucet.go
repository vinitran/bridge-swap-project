package handler

import (
	"fmt"
	"log"
	"strings"

	"bridge/config"
	"bridge/content/service"
	"bridge/etherman"
	"bridge/util"

	"github.com/aarondl/opt/omit"
	"github.com/ethereum/go-ethereum/common"
	"github.com/labstack/echo/v4"
	"github.com/samber/do"
)

const amountFaucet = "10000000000000000000" // 10token

type GroupFaucet struct {
	cfg *Config
}

type FaucetPayload struct {
	UserAddress omit.Val[string] `json:"user_address"`
	Token       omit.Val[string] `json:"token"`
	ChainId     omit.Val[string] `json:"chain_id"`
}

func (group *GroupFaucet) Exec(c echo.Context) error {
	var payload FaucetPayload
	err := c.Bind(&payload)
	if err != nil {
		responseErrUnauthorized(c)
		return err
	}

	ctx := c.Request().Context()

	payload.Token.Set(strings.ToLower(payload.Token.GetOrZero()))
	payload.Token.Set(strings.ToLower(payload.Token.GetOrZero()))

	serviceToken, err := do.Invoke[*service.ServiceToken](group.cfg.Container)
	if err != nil {
		log.Println(err)
		responseFailureWithMessage(c, "error: fail to get service token")
		return err
	}

	isValidToken, err := serviceToken.Exist(ctx, payload.Token.GetOrZero(), payload.ChainId.GetOrZero())
	if err != nil {
		log.Println(err)
		responseFailureWithMessage(c, "invalid token")
		return err
	}

	if isValidToken == false {
		responseFailureWithMessage(c, "invalid token")
		return err
	}

	cfg, err := do.Invoke[*config.Config](group.cfg.Container)
	if err != nil {
		responseFailureWithMessage(c, "error: fail to get cfg")
		return err
	}

	etherClient, err := etherman.NewClientFromChainId(util.ToUint64(payload.ChainId.GetOrZero()), cfg.Etherman)
	if err != nil {
		responseFailureWithMessage(c, "client not found")
		return err
	}

	tx, err := etherClient.TransferErc20Token(ctx, etherClient.SenderAddress[0], common.HexToAddress(payload.Token.GetOrZero()), common.HexToAddress(payload.UserAddress.GetOrZero()), util.ToBigInt(amountFaucet))
	if err != nil {
		responseErrInternalServerError(c)
		return err
	}

	responseSuccessWithMessage(c, fmt.Sprintf("Tx Hash: %s", tx.Hash()))
	return nil
}
