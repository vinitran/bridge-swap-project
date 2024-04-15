package util

import (
	"math/big"
	"strconv"
	"time"
)

func ToInt64(s string) int64 {
	i, _ := strconv.ParseInt(s, 10, 64)
	return i
}

func ToUint64(s string) uint64 {
	return uint64(ToInt64(s))
}

func ToBigInt(s string) *big.Int {
	n := new(big.Int)
	n, _ = n.SetString(s, 10)
	return n
}

func ToTime(t uint64) time.Time {
	return time.Unix(int64(t), 0)
}
