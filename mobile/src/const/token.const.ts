export interface TokenData {
  name: string;
  address: string;
  image: string;
}

export const tokenData: { [key: string]: TokenData[] } = {
  '97': [
    {
      name: 'USDT',
      address: '0x337610D27c682E347C9cD64B773b136F07C7a64D',
      image: '',
    },
    {
      name: 'BNB',
      address: '0xae13d9843a79d44b2997915a7343a960e43a1107',
      image: '',
    },
  ],
};
