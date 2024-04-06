import React, { useMemo } from 'react';
import { useTheme } from '../../../hook/theme.hook';
import { StyleSheet, Text, View } from 'react-native';
import { useAccount, useDisconnect, useNetwork, useWalletClient } from 'wagmi';
import { AppTheme } from '../../../theme/theme';
import { AccountItem } from '../components/account-item.component';
import { useWalletConnectModal } from '@walletconnect/modal-react-native';

export const AccountScreen = () => {
  const theme = useTheme();
  const styles = initStyles(theme);

  const { address } = useAccount();
  const {} = useWalletConnectModal();
  const { chains, chain } = useNetwork();
  const { disconnect } = useDisconnect();

  const actions = [
    {
      name: 'logout',
      icon: 'logout',
      label: 'Đăng xuất',
      onPress: () => disconnect(),
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.address} ellipsizeMode="middle" numberOfLines={1}>
        {address}
      </Text>
      <View style={styles.action}>
        {actions.map((action) => (
          <AccountItem
            key={action.name}
            icon={action.icon}
            label={action.label}
            onPress={action.onPress}
          />
        ))}
      </View>
    </View>
  );
};

const initStyles = (theme: AppTheme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.backgroundColor,
    },
    address: {
      marginHorizontal: theme.spaceXXL,
      paddingHorizontal: theme.spaceML,
      color: theme.textContrastColor,
      marginVertical: theme.spaceM,
      fontSize: theme.fontM,
      paddingVertical: theme.spaceS,
      borderRadius: theme.radiusCircle,
      backgroundColor: theme.primaryColor,
    },
    action: {
      marginTop: theme.spaceML,
    },
  });
};
