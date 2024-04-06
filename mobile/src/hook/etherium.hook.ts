import {useContext} from 'react';
import {EthereumContext} from '../context/ethereum.context';

export const useEtherium = () => {
  const {ethereum} = useContext(EthereumContext);

  return ethereum;
};
