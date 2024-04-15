package test

import (
	"fmt"
	"testing"
	"time"

	"bridge/app/blockchain"
	"bridge/content/bob"

	"github.com/joho/godotenv"
)

func TestTrackingData(t *testing.T) {
	if err := godotenv.Overload(".env"); err != nil {
		fmt.Println("Load env error", err.Error())
	}

	chain, err := blockchain.NewChain("5555")
	if err != nil {
		t.Error(err)
	}

	events := make(chan bob.Transaction)

	err = chain.TrackDeposit(events)
	if err != nil {
		t.Error(err)
	}

	for {
		select {
		case event := <-events:
			fmt.Println(event)
		default:
			time.Sleep(time.Second)
		}
	}
}

func TestCallWithdrawal(t *testing.T) {
	if err := godotenv.Overload(".env"); err != nil {
		fmt.Println("Load env error", err.Error())
	}

	chain, err := blockchain.NewChain("5555")
	if err != nil {
		t.Error(err)
	}

	VINI_CONTRACT := "0x67bCBB439aeBF339a99166367676F047Cef38BEb"
	err = chain.CallWithdrawal(VINI_CONTRACT, "0xc46cF4Faa3D99EbE5b35bC659C9a01590B5C300B", "10000000000000000000")
	if err != nil {
		t.Error(err)
	}
}

func TestGetTokenAmount(t *testing.T) {
	if err := godotenv.Overload(".env"); err != nil {
		fmt.Println("Load env error", err.Error())
	}

	chain, err := blockchain.NewChain("97")
	if err != nil {
		t.Error(err)
	}

	amount, err := chain.GetTokenInPool("0x32D7eEE6513224f459D221BfED0C3af45343CbB7")
	if err != nil {
		t.Error(err)
	}

	fmt.Println(amount)
}
