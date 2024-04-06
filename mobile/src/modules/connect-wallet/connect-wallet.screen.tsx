import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../hook/theme.hook';
import { AppTheme } from '../../theme/theme';
import { useWeb3Modal } from '@web3modal/wagmi-react-native';
import { Icon } from '../../components/icon/icon.component';

export const ConnectWalletScreen = () => {
  const theme = useTheme();
  const styles = initStyles(theme);

  const { open } = useWeb3Modal();

  return (
    <View style={styles.view}>
      <TouchableOpacity style={styles.button} onPress={() => open()}>
        <>
          <Text style={styles.text}>Connect a wallet</Text>
          <Icon name="wallet" />
        </>
      </TouchableOpacity>
    </View>
  );
};

const initStyles = (theme: AppTheme) => {
  return StyleSheet.create({
    view: {
      backgroundColor: theme.backgroundColor,
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    icon: {
      width: theme.spaceXXL,
      height: theme.spaceXXL,
    },
    button: {
      backgroundColor: theme.primaryColor,
      borderRadius: theme.radiusS,
      flexDirection: 'row',
      justifyContent: 'center',
      paddingHorizontal: theme.spaceMS,
      alignItems: 'center',
      paddingVertical: theme.spaceS,
    },
    text: {
      color: theme.textColor,
      fontSize: theme.fontXL,
      fontWeight: '700',
      marginRight: theme.spaceMS,
    },
  });
};
