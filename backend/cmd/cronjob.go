package main

import (
	"github.com/urfave/cli/v2"
)

func startCronjob(c *cli.Context) error {
	//for {
	//	expiredRequest, err := bob.BridgeRequests(ctx,
	//		SQLRepository(),
	//		bob.SelectWhere.BridgeRequests.CreatedAt.LTE(time.Now().Add(-10*time.Minute)),
	//	).All()
	//	if err != nil {
	//		log.Println(err)
	//		continue
	//	}
	//
	//	_, err = expiredRequest.DeleteAll(ctx, SQLRepository())
	//	if err != nil {
	//		log.Println(err)
	//		continue
	//	}
	//	time.Sleep(10 * time.Minute)
	//}
	return nil
}
