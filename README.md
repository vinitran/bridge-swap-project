## Requirements

- go version: 1.22
- docker compose version: 2.23

## Setup

Initialize postgres and redis database:

```
docker compose up redis
docker compose up postgres
```

Run the api
```
cd backend
go run cmd/*.go api           //--cfg flag for path of configuration file
```

Run the migration
```
cd backend
go run cmd/*.go migration --action up   // action up to update database
go run cmd/*.go migration --action down // action down to revert database
```

Generate bob
```
cd backend
go run github.com/stephenafamo/bob/gen/bobgen-psql@latest -c ./config/bobgen.yaml
```

Deploy and verify bridge contract in Hardhat
```
cd contract/bridge
npx hardhat run scripts/deploy.js --network <network>
npx hardhat verify --network <network> <contract-address> <parameters>
```

Clean and lint code command
```
gofumpt -l -w .
golangci-lint run ./...
```
## Chain Information

| Name        | ChainId  | Explorer                     |
|:------------|:---------|:-----------------------------|
| BSC Testnet | 97       | https://testnet.bscscan.com  |
| ETH Sepolia | 11155111 | https://sepolia.etherscan.io |

## Token Information

| Symbol | ChainId     | Address                       |
|:-------| :------- | :-------------------------------- |
| VINI   | 11155111 | 0x15f8253779428d9ea5b054deef3e454d539ddf7e |
| WETH   | 11155111 | 0xB634FE6B4Fca5DF7E7b609a4b3350b9c02077Ae4 |
| VINI   | 97 | 0x6b08b796b4b43d565c34cf4b57d8c871db410ebe |
| WETH   | 97 | 0x7c081C1E89Bdb0ed98238CBF15b9B214F6091E5D |

## Bridge Information

| Name            | ChainId     | Address                       |
|:----------------| :------- | :-------------------------------- |
| Bridge Router   | 97 | 0x8d71457D68cF892E8B925dda3057F488DBb75b48 |
| Bridge Router   | 11155111 | 0x3700D35ba6D925C6119d03DDA4173B745814AB95 |

