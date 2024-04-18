import { useAccount, useContractRead } from 'wagmi';
import { TokenAbi } from '../const/token-router';
import { readContract } from 'wagmi/actions';

const contractAbi = TokenAbi.abi;

export const useToken = (tokenAddress: string) => {
  const { address: walletAddress } = useAccount();

  const useGetWalletTokenAmount = async () => {
    return useContractRead({
      address: tokenAddress as any,
      abi: contractAbi,
      functionName: 'balanceOf',
      args: [walletAddress],
    });
  };

  const getAmountCanTranfer = async (contractTransferAddress: string) => {
    try {
      const data = await readContract({
        address: tokenAddress as any,
        abi: contractAbi,
        functionName: 'allowance',
        args: [walletAddress, contractTransferAddress],
      });

      console.log('getAmountCanTranfer', data);
      return data;
    } catch (error) {
      console.error('Error checking token getAmountCanTranfer:', error);
      return 0;
    }
  };

  const approveAmountTransfer = async (contractTransferAddress: string) => {
    try {
      const data = await readContract({
        address: tokenAddress as any,
        abi: contractAbi,
        functionName: 'approve',
        args: [contractTransferAddress, 100000000, { from: walletAddress }],
      });

      console.log('approveAmountTransfer', data);
      return data;
    } catch (error) {
      console.error('Error checking token approveAmountTransfer:', error);
      return 0;
    }
  };

  return {
    useGetWalletTokenAmount,
    getAmountCanTranfer,
    approveAmountTransfer,
  };
};
