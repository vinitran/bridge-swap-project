package config

import (
	"bytes"
	"log"
	"path/filepath"
	"strings"

	"bridge/db"
	"bridge/etherman"

	"github.com/mitchellh/mapstructure"
	"github.com/spf13/viper"
	"github.com/urfave/cli/v2"
)

const (
	FlagAddress       = "addr"
	FlagMigrateAction = "action"
	FlagUpAction      = "up"
	FlagDownAction    = "down"
	FlagCfg           = "cfg"
	FlagEnvironment   = "environment"
)

/*
Config represents the configuration of the entire Hermez Node
The file is [TOML format]
You could find some examples:
  - `config/environments/local/local.node.config.toml`: running a permisionless node
  - `config/environments/mainnet/node.config.toml`
  - `config/environments/public/node.config.toml`
  - `test/config/test.node.config.toml`: configuration for a trusted node used in CI

[TOML format]: https://en.wikipedia.org/wiki/TOML
*/
type Config struct {
	Environment LogEnvironment    `mapstructure:"Environment" jsonschema:"enum=production,enum=development"`
	Database    db.DatabaseConfig `mapstructure:"Database"`
	Redis       db.RedisConfig    `mapstructure:"Redis"`
	Etherman    etherman.Config   `mapstructure:"Etherman"`
}

// Default parses the default configuration values.
func Default() (*Config, error) {
	var cfg Config
	viper.SetConfigType("toml")

	err := viper.ReadConfig(bytes.NewBuffer([]byte(DefaultValues)))
	if err != nil {
		return nil, err
	}
	err = viper.Unmarshal(&cfg, viper.DecodeHook(mapstructure.TextUnmarshallerHookFunc()))
	if err != nil {
		return nil, err
	}
	return &cfg, nil
}

// Load loads the configuration
func Load(ctx *cli.Context) (*Config, error) {
	cfg, err := Default()
	if err != nil {
		return nil, err
	}
	configFilePath := ctx.String(FlagCfg)
	if configFilePath != "" {
		dirName, fileName := filepath.Split(configFilePath)
		log.Println("config path: ", configFilePath)

		fileExtension := strings.TrimPrefix(filepath.Ext(fileName), ".")
		fileNameWithoutExtension := strings.TrimSuffix(fileName, "."+fileExtension)

		viper.AddConfigPath(dirName)
		viper.SetConfigName(fileNameWithoutExtension)
		viper.SetConfigType(fileExtension)
	}
	viper.AutomaticEnv()
	replacer := strings.NewReplacer(".", "_")
	viper.SetEnvKeyReplacer(replacer)
	err = viper.ReadInConfig()
	if err != nil {
		_, ok := err.(viper.ConfigFileNotFoundError)
		if ok {
			log.Println("config file not found")
		} else {
			log.Println("error reading config file: ", err)
			return nil, err
		}
	}

	decodeHooks := []viper.DecoderConfigOption{
		// this allows arrays to be decoded from env var separated by ",", example: MY_VAR="value1,value2,value3"
		viper.DecodeHook(mapstructure.ComposeDecodeHookFunc(mapstructure.TextUnmarshallerHookFunc(), mapstructure.StringToSliceHookFunc(","))),
	}

	err = viper.Unmarshal(&cfg, decodeHooks...)
	if err != nil {
		return nil, err
	}

	return cfg, nil
}

type LogEnvironment string

const (
	// EnvironmentProduction production log environment.
	EnvironmentProduction = LogEnvironment("production")
	// EnvironmentDevelopment development log environment.
	EnvironmentDevelopment = LogEnvironment("development")
)
