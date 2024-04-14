import '@walletconnect/react-native-compat';
import { WagmiConfig, useAccount } from 'wagmi';
import { mainnet, polygon, arbitrum, bscTestnet, sepolia } from 'viem/chains';
import { createWeb3Modal, defaultWagmiConfig, Web3Modal } from '@web3modal/wagmi-react-native';
import React from 'react';
import { useWalletConnectModal } from '@walletconnect/modal-react-native';
import { ConnectWalletScreen } from '../modules/connect-wallet/connect-wallet.screen';

// 1. Get projectId at https://cloud.walletconnect.com
const projectId = '4d2d5b225dff8db0bca0bf91f8f925e8';

// 2. Create config
const metadata = {
  name: 'Bridge Swap Mobile',
  description: 'Bridge Swap Mobile',
  url: 'https://web3modal.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
  redirect: {
    native: 'YOUR_APP_SCHEME://',
    universal: 'YOUR_APP_UNIVERSAL_LINK.com',
  },
};

const chains = [bscTestnet, sepolia];

export const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });

createWeb3Modal({
  projectId,
  chains,
  wagmiConfig,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
});

interface WalletProviderProps {
  children: React.ReactNode;
}

export const WalletProvider = ({ children }: WalletProviderProps) => {
  const CheckConnectComponent = () => {
    const { isConnected } = useAccount();

    if (!isConnected) {
      return <ConnectWalletScreen />;
    }

    return <>{children}</>;
  };

  return (
    <WagmiConfig config={wagmiConfig}>
      <CheckConnectComponent />
      <Web3Modal />
    </WagmiConfig>
  );
};
