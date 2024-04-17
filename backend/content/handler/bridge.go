package handler

import (
	"errors"
	"fmt"
	"strings"

	"bridge/config"
	"bridge/content/bob"
	"bridge/content/service"
	"bridge/etherman"
	"bridge/util"

	"github.com/aarondl/opt/omit"
	"github.com/ethereum/go-ethereum/common"
	"github.com/labstack/echo/v4"
	"github.com/samber/do"
)

type GroupBridge struct {
	cfg *Config
}

type BridgePayload struct {
	InChain      omit.Val[string] `json:"in_chain"`
	OutChain     omit.Val[string] `json:"out_chain"`
	Amount       omit.Val[string] `json:"amount"`
	TokenAddress omit.Val[string] `json:"token_address"`
	UserAddress  omit.Val[string] `json:"user_address"`
}

var ErrRequestDenied = errors.New("Request was denied by default")

func (group *GroupBridge) Exec(c echo.Context) error {
	var payload BridgePayload
	err := c.Bind(&payload)
	if err != nil {
		responseErrUnauthorized(c)
		return err
	}

	ctx := c.Request().Context()

	payload.TokenAddress.Set(strings.ToLower(payload.TokenAddress.GetOrZero()))
	payload.UserAddress.Set(strings.ToLower(payload.UserAddress.GetOrZero()))

	if payload.OutChain == payload.InChain {
		responseFailureWithMessage(c, "invalid input and output chainId")
		return err
	}

	serviceToken, err := do.Invoke[*service.ServiceToken](group.cfg.Container)
	if err != nil {
		responseFailureWithMessage(c, "error: fail to get service token")
		return err
	}

	tokenOut, err := serviceToken.FindTokenInOutputChain(ctx, payload.TokenAddress.GetOrZero(), payload.InChain.GetOrZero(), payload.OutChain.GetOrZero())
	if err != nil {
		responseFailureWithMessage(c, "invalid output token")
		return err
	}

	cfg, err := do.Invoke[*config.Config](group.cfg.Container)
	if err != nil {
		responseFailureWithMessage(c, "error: fail to get cfg")
		return err
	}

	etherClient, err := etherman.NewClientFromChainId(util.ToUint64(payload.OutChain.GetOrZero()), cfg.Etherman)
	if err != nil {
		responseFailureWithMessage(c, "client not found")
		return err
	}

	amountInPoolTokenOut, err := etherClient.AmountTokenInBridgePool(common.HexToAddress(tokenOut.Address))
	if err != nil {
		responseFailureWithMessage(c, fmt.Sprintf("can not get amount in pool token. token address: %s", tokenOut.Address))
		return err
	}

	// require amount output token in pool must be grater than amount input token
	if util.ToBigInt(payload.Amount.GetOrZero()).Cmp(amountInPoolTokenOut) == 1 {
		responseFailureWithMessage(c, "amount output token is not enough")
		return err
	}

	serviceBridge, err := do.Invoke[*service.ServiceBridge](group.cfg.Container)
	if err != nil {
		return err
	}

	inRequest, err := serviceBridge.ExistByUser(ctx, payload.UserAddress.GetOrZero())
	if inRequest == true {
		responseFailureWithMessage(c, "you have transaction in progress, please waiting")
		return err
	}

	bridgeRq, err := serviceBridge.Create(ctx, &bob.BridgeRequestSetter{
		InputChain:  payload.InChain,
		OutputChain: payload.OutChain,
		RawAmount:   payload.Amount,
		Token:       payload.TokenAddress,
		UserAddress: payload.UserAddress,
	})
	if err != nil {
		responseFailureWithMessage(c, "can not insert bridge request")
		return err
	}

	responseSuccess(c, bridgeRq.ID.String())
	return nil
}
