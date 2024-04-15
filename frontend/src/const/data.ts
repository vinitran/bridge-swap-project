import { icons } from 'react-icons/lib';

const chain = [
  {
    chainId: '97',
    name: 'BSC Testnet',
    img: '',
    bridgeContractAddress: '0xd15e20F76DC9D2f0671a2E20c303c42d1445c8dd',
  },
  {
    chainId: '5555',
    name: 'CVC Testnet',
    img: '',
    bridgeContractAddress: '0x3ea491a040fa14d8df9457f1a9699b3315d482e3',
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
      name: 'BNB',
      address: '0x0000000000000000000000000000000000000000',
      icon: 'https://w7.pngwing.com/pngs/997/942/png-transparent-bnb-crypto-cryptocurrency-cryptocurrencies-cash-money-bank-payment-icon.png',
    },
  ],
  '5': [
    {
      name: 'VINI',
      address: '',
      icon: 'https://icon-library.com/images/v-icon/v-icon-11.jpg',
    },
    {
      name: 'ETH',
      address: '0x0000000000000000000000000000000000000000',
      icon: 'https://icons.iconarchive.com/icons/cjdowner/cryptocurrency-flat/512/Ethereum-ETH-icon.png',
    },
  ],
  '5555': [
    {
      name: 'VINI',
      address: '0x596c14ba2b6e759c73895ce13e64e49054181a7f',
      icon: 'https://icon-library.com/images/v-icon/v-icon-11.jpg',
    },
    {
      name: 'XCR',
      address: '0x0000000000000000000000000000000000000000',
      icon: 'https://testnet.cvcscan.com/images/favicon-32x32-c8479ca561589b59867e59143bfe63a5.png?vsn=d',
    },
  ],
};

export const Data = {
  chain,
  coin,
};
