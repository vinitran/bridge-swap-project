import { useAccount, useContractRead } from 'wagmi';
import { readContract } from '@wagmi/core';
import { SwapAbi } from '../const/swap-abi.const';

const contractAddress = '0xf988aa295bc1feddbcf4c567e855945d1c6a0619';
const contractAbi = SwapAbi.abi;

export const useSwapContract = () => {
  const { address } = useAccount();

  const getAmountSwap = (amountIn: string, tokenInAdd: string, tokenOutAdd: string) => {
    return readContract({
      abi: contractAbi,
      address: contractAddress,
      functionName: 'getAmountsOut',
      args: [amountIn, [tokenInAdd, tokenOutAdd]],
    });
  };

  const swapForToken = async (
    amountIn: string,
    amountOut: string,
    tokenIn: string,
    tokenOut: string
  ) => {
    return readContract({
      abi: contractAbi,
      address: contractAddress,
      functionName: 'swapExactETHForTokens',
      args: [amountIn, [tokenInAdd, tokenOutAdd]],
    });
    if (contract) {
      try {
        return contract.methods
          .swapExactETHForTokens(
            web3.utils.toWei(+amountOut * 0.9, 'ether'),
            [tokenIn, tokenOut],
            walletAddress,
            Date.now() + 300
          )
          .send({
            from: walletAddress,
            value: web3.utils.toWei(amountIn, 'ether'),
          });
      } catch (error) {
        console.error('Error in getAmountt:', error);
      }
    }
  };
};
