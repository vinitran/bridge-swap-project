import { useAccount } from 'wagmi';
import { BridgeAbi } from '../const/bridge-router';
import { readContract, writeContract } from 'wagmi/actions';

const contractAbi = BridgeAbi.abi;

export const useBridgeContract = (contractAddress: string) => {
  const { address: walletAddress } = useAccount();

  const getTokenAvailableInPool = async (tokenAddress: any) => {
    try {
      const data = await readContract({
        address: contractAddress as any,
        abi: contractAbi,
        functionName: 'getAmountTokenInPool',
        args: [tokenAddress],
      });

      console.log('getAmountTokenInPool', data);
      return data;
    } catch (error) {
      console.error('Error checking token balance:', error);
      return 0;
    }
  };

  const getTransferContractAddress = async (tokenAddress: string) => {
    try {
      const data = await readContract({
        address: contractAddress as any,
        abi: contractAbi,
        functionName: 'bridgePools',
        args: [tokenAddress],
      });

      console.log('bridgePools', data);
      return data;
    } catch (error) {
      console.error('Error checking bridgePools:', error);
    }
  };

  const deposit = async (tokenAddress: string, amount: string) => {
    try {
      const data = await writeContract({
        address: contractAddress as any,
        abi: contractAbi,
        functionName: 'deposit',
        args: [
          tokenAddress,
          amount,
          {
            from: walletAddress,
          },
        ],
      });

      console.log('deposit', data);
      return data;
    } catch (error) {
      console.error('Error checking deposit:', error);
    }
  };

  return { getTokenAvailableInPool, getTransferContractAddress, deposit };
};
