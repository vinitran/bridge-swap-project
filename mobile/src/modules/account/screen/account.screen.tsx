import React from 'react';
import { useTheme } from '../../../hook/theme.hook';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useAccount, useDisconnect, useNetwork } from 'wagmi';
import { AppTheme } from '../../../theme/theme';
import { AccountItem } from '../components/account-item.component';
import { SwitchChainDrodown } from '../../../components/switch-chain-dropdown/switch-chain-dropdown.component';

export const AccountScreen = () => {
  const theme = useTheme();
  const styles = initStyles(theme);

  const { address } = useAccount();
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
      <SwitchChainDrodown />
      <Image source={require('../../../assets/images/avatar.png')} style={styles.avatar} />
      <View style={styles.addWrapper}>
        <Text style={styles.address} ellipsizeMode="middle" numberOfLines={1}>
          {address}
        </Text>
      </View>
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
      color: theme.textContrastColor,
      fontSize: theme.fontM,
    },
    addWrapper: {
      marginHorizontal: theme.spaceXXL,
      paddingHorizontal: theme.spaceML,
      marginVertical: theme.spaceM,
      paddingVertical: theme.spaceS,
      borderRadius: theme.radiusCircle,
      backgroundColor: theme.primaryColor,
    },
    action: {
      marginTop: theme.spaceML,
    },
    avatar: {
      alignSelf: 'center',
      width: 3 * theme.spaceXXL,
      aspectRatio: 1,
      height: undefined,
      marginTop: theme.spaceM,
    },
  });
};
