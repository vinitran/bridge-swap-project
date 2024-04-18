export interface TokenData {
  name: string;
  address: string;
  image: string;
}

export const tokenData: { [key: string]: TokenData[] } = {
  '97': [
    {
      name: 'VINI',
      address: '0x6b08b796b4b43d565c34cf4b57d8c871db410ebe',
      image: 'https://icon-library.com/images/v-icon/v-icon-11.jpg',
    },
    {
      name: 'WETH',
      address: '0x7c081C1E89Bdb0ed98238CBF15b9B214F6091E5D',
      image: 'https://i.postimg.cc/sDLnZnB7/w-ETH-desktop-1.png',
    },
  ],
  '11155111': [
    {
      name: 'VINI',
      address: '0x15f8253779428d9ea5b054deef3e454d539ddf7e',
      image: 'https://icon-library.com/images/v-icon/v-icon-11.jpg',
    },
    {
      name: 'WETH',
      address: '0xB634FE6B4Fca5DF7E7b609a4b3350b9c02077Ae4',
      image: 'https://i.postimg.cc/sDLnZnB7/w-ETH-desktop-1.png',
    },
  ],
};
