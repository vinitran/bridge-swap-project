const chain = [
  {
    chainId: '97',
    name: 'BSC Testnet',
    img: 'https://i.postimg.cc/Jzhx9jHW/binance-smart-chain-bsc-seeklogo-1.png',
    bridgeContractAddress: '0x8d71457D68cF892E8B925dda3057F488DBb75b48',
  },
  {
    chainId: '11155111',
    name: 'ETH Sepolia',
    img: 'https://i.postimg.cc/x1Fw7fCt/the-dolphin-po0q7ezlhqqzvrfmzw0atih2l0vqelut73w4eh5qtc.png',
    bridgeContractAddress: '0x3700D35ba6D925C6119d03DDA4173B745814AB95',
  },
];

const coin: {
  [key: string]: { name: string; address: string; icon: string }[];
} = {
  '97': [
    {
      name: 'VINI',
      address: '0x6b08b796b4b43d565c34cf4b57d8c871db410ebe',
      icon: 'https://icon-library.com/images/v-icon/v-icon-11.jpg',
    },
    {
      name: 'WETH',
      address: '0x7c081C1E89Bdb0ed98238CBF15b9B214F6091E5D',
      icon: 'https://i.postimg.cc/sDLnZnB7/w-ETH-desktop-1.png',
    },
  ],
  '11155111': [
    {
      name: 'VINI',
      address: '0x15f8253779428d9ea5b054deef3e454d539ddf7e',
      icon: 'https://icon-library.com/images/v-icon/v-icon-11.jpg',
    },
    {
      name: 'WETH',
      address: '0xB634FE6B4Fca5DF7E7b609a4b3350b9c02077Ae4',
      icon: 'https://i.postimg.cc/sDLnZnB7/w-ETH-desktop-1.png',
    },
  ],
};

export const Data = {
  chain,
  coin,
};
