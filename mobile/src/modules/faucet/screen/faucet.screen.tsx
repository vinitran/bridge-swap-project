import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ChainDrodown } from '../../../components/chain-dropdown/chain-dropdown.component';
import { Button } from '../../../components/button/button.component';
import { useTheme } from '../../../hook/theme.hook';
import { useChainId, useNetwork } from 'wagmi';
import { TokenData, tokenData } from '../../../const/token.const';
import { AppTheme } from '../../../theme/theme';
import { TokenDropdown } from '../../../components/token-dropdown/token-dropdown.component';
import { Icon } from '../../../components/icon/icon.component';

export const FaucetScreen = () => {
  const theme = useTheme();
  const styles = initStyles(theme);
  const { chains, chain: currentChain } = useNetwork();

  const [chain, setChain] = useState(currentChain ?? chains[0]);
  const [token, setToken] = useState<TokenData>(tokenData[chain.id][0]);
  const [isDiffWallet, setIsDiffWallet] = useState(false);
  const [walletAdd, setWalletAdd] = useState<string>();

  const toggleIsDiffWallet = () => setIsDiffWallet(!isDiffWallet);

  return (
    <View style={styles.container}>
      <View style={styles.flexRow}>
        <ChainDrodown chainList={chains} value={chain} onChangeChain={setChain} />
        <View style={{ width: theme.spaceS }} />
        <TokenDropdown tokenList={tokenData[chain.id]} onValueChange={setToken} value={token} />
      </View>
      <TouchableOpacity style={styles.flexRow} onPress={toggleIsDiffWallet} activeOpacity={1}>
        <Icon name={isDiffWallet ? 'checkbox-fill' : 'checkbox-none'} disable />
        <Text style={styles.text}>Nhận vào địa chỉ ví khác</Text>
      </TouchableOpacity>
      {isDiffWallet ? (
        <TextInput
          onChangeText={setWalletAdd}
          placeholder="Nhập địa chỉ ví..."
          placeholderTextColor={theme.neutralColor200}
          style={styles.textInput}
          cursorColor={theme.neutralColor500}
        />
      ) : (
        <></>
      )}
      <Button
        onPress={() => {}}
        label="Give me a token"
        style={{ container: styles.buttonContainer }}
      />
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
      flexDirection: 'row',
      marginBottom: theme.spaceM,
      justifyContent: 'flex-start',
      width: '100%',
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
    text: {
      marginLeft: theme.spaceMS,
      color: theme.textColor,
    },
    textInput: {
      width: '100%',
      borderRadius: theme.radiusS,
      borderWidth: 1,
      borderColor: theme.primaryColor,
      paddingHorizontal: theme.spaceMS,
    },
  });
};
