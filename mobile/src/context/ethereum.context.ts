import {createContext} from 'react';

export interface IEthereumContext {
  ethereum: any
  ;
}

export const EthereumContext = createContext<IEthereumContext>({
  ethereum: {},
});
