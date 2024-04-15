package content

import (
	"context"
	"database/sql"
	"log"
	"strings"

	"bridge/util"

	"bridge/content/bob"
	"bridge/content/datastore"
	"bridge/etherman"

	"github.com/ethereum/go-ethereum/common"
	"github.com/gin-gonic/gin"
)

type BridgePayload struct {
	InChain      string `json:"in_chain"`
	OutChain     string `json:"out_chain"`
	Amount       string `json:"amount"`
	TokenAddress string `json:"token_address"`
	UserAddress  string `json:"user_address"`
}

func (v *V1Router) bridge(c *gin.Context) {
	ctx := context.Background()
	var payload BridgePayload
	err := c.BindJSON(&payload)
	if err != nil {
		responseErrUnauthorized(c)
		return
	}
	payload.TokenAddress = strings.ToLower(payload.TokenAddress)
	payload.UserAddress = strings.ToLower(payload.UserAddress)

	if payload.OutChain == payload.InChain {
		responseFailureWithMessage(c, "invalid input and output chainId")
		return
	}

	tokenIn, err := bob.Tokens(
		ctx,
		SQLRepository(),
		bob.SelectWhere.Tokens.Address.EQ(payload.TokenAddress),
		bob.SelectWhere.Tokens.ChainID.EQ(payload.InChain)).One()
	if err != nil {
		responseFailureWithMessage(c, "invalid input token")
		return
	}

	tokenOut, err := bob.Tokens(
		ctx,
		SQLRepository(),
		bob.SelectWhere.Tokens.Name.EQ(tokenIn.Name),
		bob.SelectWhere.Tokens.ChainID.EQ(payload.OutChain)).One()
	if err != nil {
		responseFailureWithMessage(c, "invalid output token")
		return
	}

	etherClient, err := etherman.NewClientFromChainId(util.ToUint64(payload.InChain), ConfigRepository().Etherman)
	if err != nil {
		responseFailureWithMessage(c, "client not found")
		return
	}

	amountInPoolTokenOut, err := etherClient.AmountTokenInBridgePool(common.HexToAddress(tokenOut.Address))
	if err != nil {
		responseErrInternalServerError(c)
		return
	}

	// require amount output token in pool must be grater than amount input token
	if util.ToBigInt(payload.Amount).Cmp(amountInPoolTokenOut) == 1 {
		responseFailureWithMessage(c, "amount output token is not enough")
		return
	}

	dataStr := datastore.DatastoreBridgeRequest{}

	inRequest, err := dataStr.IsInRequest(ctx, SQLRepository(), payload.UserAddress)
	if inRequest == true {
		responseFailureWithMessage(c, "you have transaction in progress, please waiting")
		return
	}

	tx, err := SQLRepository().BeginTx(ctx, &sql.TxOptions{})
	bridgeRq, err := dataStr.Insert(ctx, tx, &bob.BridgeRequest{
		InputChain:  payload.InChain,
		OutputChain: payload.OutChain,
		RawAmount:   payload.Amount,
		Token:       payload.TokenAddress,
		UserAddress: payload.UserAddress,
	})
	if err != nil {
		log.Println(err)
		responseErrInternalServerError(c)
		return
	}

	err = tx.Commit()
	if err != nil {
		responseErrInternalServerError(c)
		return
	}

	responseSuccess(c, bridgeRq.ID.String())
}
