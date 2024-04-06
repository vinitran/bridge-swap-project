import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../../hook/theme.hook';
import { AppTheme } from '../../../theme/theme';
import { InputSwap } from '../components/input-swap.component';
import { Icon } from '../../../components/icon/icon.component';
import { Button } from '../../../components/button/button.component';
import { useChainId } from 'wagmi';
import { TokenData, tokenData } from '../../../const/token.const';

export const SwapScreen = () => {
  const chainId = useChainId();

  const [tokenIn, setTokenIn] = useState(tokenData[chainId][0]);
  const [tokenOut, setTokenOut] = useState<TokenData>();
  const [amountIn, setAmountIn] = useState<string>();
  const [amountOut, setAmountOut] = useState<string>();

  const theme = useTheme();
  const styles = initStyles(theme);

  return (
    <View style={styles.container}>
      <InputSwap
        label={'Số nhập'}
        amount={''}
        onChangeAmount={setAmountIn}
        token={tokenIn}
        onChangeToken={setTokenIn}
        tokenList={tokenData[chainId]}
      />
      <View style={styles.iconWapper}>
        <Icon name="swap" style={styles.icon} />
      </View>
      <InputSwap
        disable
        label={'Số nhận được'}
        amount={amountOut ?? '0'}
        onChangeAmount={setAmountOut}
        token={tokenOut}
        onChangeToken={setTokenOut}
        tokenList={tokenData[chainId]}
      />
      <Button onPress={() => {}} label="Swap" style={{ container: styles.buttonContainer }} />
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
      paddingHorizontal: theme.spaceML,
    },
    icon: {
      width: theme.spaceL,
      height: theme.spaceL,
      color: theme.primaryColor,
    },
    iconWapper: {
      padding: theme.spaceXS,
      borderRadius: theme.spaceS,
      borderColor: theme.primaryColor,
      borderWidth: 1,
      marginVertical: -theme.spaceMS,
      backgroundColor: theme.backgroundColor,
      zIndex: 10,
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
