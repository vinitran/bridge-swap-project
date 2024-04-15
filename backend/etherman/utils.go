package etherman

import "time"

func ToTime(t uint64) time.Time {
	return time.Unix(int64(t), 0)
}
