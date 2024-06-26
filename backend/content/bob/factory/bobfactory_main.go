// Code generated by BobGen psql v0.21.1. DO NOT EDIT.
// This file is meant to be re-generated in place and/or deleted at any time.

package factory

import (
	"context"
	"strings"
	"time"

	models "bridge/content/bob"
	"github.com/aarondl/opt/null"
	"github.com/google/uuid"
	"github.com/jaswdr/faker"
)

type factory struct {
	baseBridgeRequestMods  BridgeRequestModSlice
	baseGooseDBVersionMods GooseDBVersionModSlice
	baseTokenMods          TokenModSlice
	baseTransactionMods    TransactionModSlice
}

func New() *factory {
	return &factory{}
}

func (f *factory) NewBridgeRequest(mods ...BridgeRequestMod) *BridgeRequestTemplate {
	o := &BridgeRequestTemplate{f: f}

	if f != nil {
		f.baseBridgeRequestMods.Apply(o)
	}

	BridgeRequestModSlice(mods).Apply(o)

	return o
}

func (f *factory) NewGooseDBVersion(mods ...GooseDBVersionMod) *GooseDBVersionTemplate {
	o := &GooseDBVersionTemplate{f: f}

	if f != nil {
		f.baseGooseDBVersionMods.Apply(o)
	}

	GooseDBVersionModSlice(mods).Apply(o)

	return o
}

func (f *factory) NewToken(mods ...TokenMod) *TokenTemplate {
	o := &TokenTemplate{f: f}

	if f != nil {
		f.baseTokenMods.Apply(o)
	}

	TokenModSlice(mods).Apply(o)

	return o
}

func (f *factory) NewTransaction(mods ...TransactionMod) *TransactionTemplate {
	o := &TransactionTemplate{f: f}

	if f != nil {
		f.baseTransactionMods.Apply(o)
	}

	TransactionModSlice(mods).Apply(o)

	return o
}

func (f *factory) ClearBaseBridgeRequestMods() {
	f.baseBridgeRequestMods = nil
}

func (f *factory) AddBaseBridgeRequestMod(mods ...BridgeRequestMod) {
	f.baseBridgeRequestMods = append(f.baseBridgeRequestMods, mods...)
}

func (f *factory) ClearBaseGooseDBVersionMods() {
	f.baseGooseDBVersionMods = nil
}

func (f *factory) AddBaseGooseDBVersionMod(mods ...GooseDBVersionMod) {
	f.baseGooseDBVersionMods = append(f.baseGooseDBVersionMods, mods...)
}

func (f *factory) ClearBaseTokenMods() {
	f.baseTokenMods = nil
}

func (f *factory) AddBaseTokenMod(mods ...TokenMod) {
	f.baseTokenMods = append(f.baseTokenMods, mods...)
}

func (f *factory) ClearBaseTransactionMods() {
	f.baseTransactionMods = nil
}

func (f *factory) AddBaseTransactionMod(mods ...TransactionMod) {
	f.baseTransactionMods = append(f.baseTransactionMods, mods...)
}

type contextKey string

var (
	bridgeRequestCtx  = newContextual[*models.BridgeRequest]("bridgeRequest")
	gooseDBVersionCtx = newContextual[*models.GooseDBVersion]("gooseDBVersion")
	tokenCtx          = newContextual[*models.Token]("token")
	transactionCtx    = newContextual[*models.Transaction]("transaction")
)

type contextual[V any] struct {
	key contextKey
}

// This could be weird because of type inference not handling `K` due to `V` having to be manual.
func newContextual[V any](key string) contextual[V] {
	return contextual[V]{key: contextKey(key)}
}

func (k contextual[V]) WithValue(ctx context.Context, val V) context.Context {
	return context.WithValue(ctx, k.key, val)
}

func (k contextual[V]) Value(ctx context.Context) (V, bool) {
	v, ok := ctx.Value(k.key).(V)
	return v, ok
}

var defaultFaker = faker.New()

// random returns a random value for the given type, using the faker
// * If the given faker is nil, the default faker is used
// * The zero value is returned if the type cannot be handled
func random[T any](f *faker.Faker) T {
	if f == nil {
		f = &defaultFaker
	}

	var val T
	switch any(val).(type) {
	default:
		return val
	case string:
		return any(string(strings.Join(f.Lorem().Words(5), " "))).(T)

	case bool:
		return any(bool(f.BoolWithChance(50))).(T)

	case int:
		return any(int(f.Int())).(T)

	case uuid.UUID:
		return val

	case time.Time:
		return val

	case int64:
		return val

	}
}

// randomNull is like [Random], but for null types
func randomNull[T any](f *faker.Faker) null.Val[T] {
	return null.From(random[T](f))
}
