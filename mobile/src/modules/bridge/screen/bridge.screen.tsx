import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../../../hook/theme.hook';
import { AppTheme } from '../../../theme/theme';
import { useChainId, useNetwork } from 'wagmi';
import { InputBridge } from '../components/input-bridge.component';
import { TokenData, tokenData } from '../../../const/token.const';
import { ChainDrodown } from '../../../components/chain-dropdown/chain-dropdown.component';
import { Button } from '../../../components/button/button.component';
import { Icon } from '../../../components/icon/icon.component';

export const BridgeScreen = () => {
  const theme = useTheme();
  const styles = initStyles(theme);
  const { chains } = useNetwork();
  const chainId = useChainId();
  console.log(chainId);

  const [chainIn, setChainIn] = useState(chains[0]);
  const [chainOut, setChainOut] = useState(chains[1]);
  const [token, setToken] = useState<TokenData>(tokenData[chainId][0]);
  const [amoutnIn, setAmountIn] = useState<string>();

  return (
    <View style={styles.container}>
      <View style={styles.flexRow}>
        <ChainDrodown chainList={chains} value={chainIn} onChangeChain={setChainIn} />
        <Icon name="arrow-right" />
        <ChainDrodown chainList={chains} value={chainOut} onChangeChain={setChainOut} />
      </View>
      <InputBridge
        label={'Số nhập'}
        amount={''}
        onChangeAmount={setAmountIn}
        token={token}
        onChangeToken={setToken}
        tokenList={tokenData[chainId]}
      />
      <Button onPress={() => {}} label="Bridge" style={{ container: styles.buttonContainer }} />
    </View>
  );
};

const initStyles = (theme: AppTheme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.backgroundColor,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: theme.spaceM,
    },
    flexRow: {
      alignItems: 'center',
      justifyContent: 'space-between',
      flexDirection: 'row',
      marginBottom: theme.spaceM,
    },
    buttonContainer: {
      paddingVertical: theme.spaceMS,
      backgroundColor: theme.primaryColor,
      borderRadius: theme.radiusMS,
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      marginTop: theme.spaceMS,
    },
  });
};
