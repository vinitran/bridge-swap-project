require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks: {
    bsctest: {
      url: "https://bsc-testnet.publicnode.com",
      accounts: [process.env.PRIV_KEY],
      gasPrice: 100000000000,
      blockGasLimit: 10000000
    },
    sepolia: {
      url: "https://ethereum-sepolia-rpc.publicnode.com",
      accounts: [process.env.PRIV_KEY],
      gasPrice: 100000000000,
      blockGasLimit: 10000000
    }
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: process.env.API_KEY
  },
  sourcify: {
    enabled: true
  }  
};
