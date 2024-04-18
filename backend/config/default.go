package config

// DefaultValues is the default configuration
const DefaultValues = `
Environment = "development" # "production" or "development"
[Database]
	User = "postgres"
	Password = "123456"
	Name = "postgres"
	Host = "localhost"
	Port = "5433"
	MaxConns = 200
[Redis]
	Password = ""
	Name = "redis"
	Host = "localhost"
	Port = "6380"
[Etherman]
	[Etherman.BscTestnet]
		RPC = "https://bsc-testnet.nodereal.io/v1/b39b5b70033d43c78f98f9862d13d78e"
		Erc20TokenList = "0x6b08b796b4b43d565c34cf4b57d8c871db410ebe"
		ChainId = "97"
		BridgeAddress = "0x8d71457D68cF892E8B925dda3057F488DBb75b48"
		PrivateKey = "74d6240ad8130d96d49468e2b1344063da9a902ad5650d098bf046fe716ca2b3" 	
		BlockTime = 3	
	[Etherman.Sepolia]
		RPC = "https://eth-sepolia.nodereal.io/v1/b39b5b70033d43c78f98f9862d13d78e"
		Erc20TokenList = "0x15f8253779428d9ea5b054deef3e454d539ddf7e"
		ChainId = "11155111"
		BridgeAddress = "0x3700D35ba6D925C6119d03DDA4173B745814AB95"
		PrivateKey = "74d6240ad8130d96d49468e2b1344063da9a902ad5650d098bf046fe716ca2b3" 	
`
