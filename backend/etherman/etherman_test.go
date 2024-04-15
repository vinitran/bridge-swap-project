package etherman_test

import (
	"bridge/etherman"
)

const (
	MAX_CHANEL = 20
)

func newTestingConfig() etherman.ChainConfig {
	return etherman.ChainConfig{
		RPC:            "https://bsc-testnet-rpc.publicnode.com",
		ChainId:        97,
		Erc20TokenList: "0xd15e20F76DC9D2f0671a2E20c303c42d1445c8dd",
		BridgeAddress:  "0x6B08B796b4b43d565C34Cf4B57D8c871dB410ebE",
		PrivateKey:     "74d6240ad8130d96d49468e2b1344063da9a902ad5650d098bf046fe716ca2b3",
	}
}

//func TestSubscribeFilterLogs(t *testing.T) {
//	cfg := newTestingConfig()
//	client, err := etherman.NewClient(cfg)
//	if err != nil {
//		t.Fatal(err)
//	}
//
//	query := etherman.EventReaderParams{
//		Filter: ethereum.FilterQuery{
//			Addresses: []common.Address{
//				common.HexToAddress(cfg.BridgeAddress),
//			},
//		},
//		EventHash: []common.Hash{
//			etherman.TransferEventHash,
//			etherman.DepositEventHash,
//		},
//	}
//
//	logs := make(chan types.Log, MAX_CHANEL)
//
//	log.Println("Subcribe...")
//
//	go func() {
//		err = client.SubcribeNewEvents(context.Background(), query, logs)
//		if err != nil {
//			t.Fatal(err)
//		}
//	}()
//
//	for {
//		select {
//		case vLog := <-logs:
//			log.Println("asdasd", vLog)
//		}
//	}
//}
