package config

// DefaultValues is the default configuration
const DefaultValues = `
Environment = "development" # "production" or "development"
[Database]
	User = "postgres"
	Password = "123456"
	Name = "postgres"
	Host = "localhost"
	Port = "5432"
	MaxConns = 200
[Redis]
	Password = ""
	Name = "redis"
	Host = "localhost"
	Port = "6380"
[Etherman]
	[Etherman.BscTestnet]
		RPC = "https://bsc-testnet-rpc.publicnode.com"
		Erc20TokenList = "0x6b08b796b4b43d565c34cf4b57d8c871db410ebe"
		ChainId = "97"
		BridgeAddress = ""
		PrivateKey = "74d6240ad8130d96d49468e2b1344063da9a902ad5650d098bf046fe716ca2b3" 	
		BlockTime = 3	
	[Etherman.Sepolia]
		RPC = "https://1rpc.io/sepolia"
		Erc20TokenList = "0x15f8253779428d9ea5b054deef3e454d539ddf7e"
		ChainId = "11155111"
		BridgeAddress = ""
		PrivateKey = "74d6240ad8130d96d49468e2b1344063da9a902ad5650d098bf046fe716ca2b3" 	
`
