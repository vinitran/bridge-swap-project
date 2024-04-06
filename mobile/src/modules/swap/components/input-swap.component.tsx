import React, { useMemo } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { useTheme } from '../../../hook/theme.hook';
import { AppTheme } from '../../../theme/theme';
import { TokenData } from '../../../const/token.const';
import { DropdownPicker } from '../../../components/dropdown/dropdown.component';
import { TabRouter } from '@react-navigation/native';
import { TokenDropdown } from './token-dropdown.component';

interface InputSwapProps {
  label: string;
  balance: string;
  onChangeBalance: (value: string) => void;
  token?: TokenData;
  onChangeToken: (token: TokenData) => void;
  disable?: boolean;
  tokenList: TokenData[];
}

export const InputSwap = ({
  label,
  balance,
  token,
  tokenList,
  onChangeToken,
  onChangeBalance,
  disable = false,
}: InputSwapProps) => {
  const theme = useTheme();
  const styles = initStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.flexRow}>
        <TextInput
          placeholder="0"
          multiline={false}
          editable={disable}
          inputMode="numeric"
          style={styles.input}
          onChangeText={onChangeBalance}
          cursorColor={theme.neutralColor500}
        />
        <TokenDropdown value={token} tokenList={tokenList} onValueChange={onChangeToken} />
      </View>
      <View style={styles.flexRow}>
        <Text style={styles.bottomText}>{'1000$'}</Text>
        <Text style={styles.bottomText}>{'So du: 100$'}</Text>
      </View>
    </View>
  );
};

const initStyles = (theme: AppTheme) => {
  return StyleSheet.create({
    container: {
      borderRadius: theme.radiusMS,
      borderColor: theme.primaryColor,
      padding: theme.spaceMS,
      width: '100%',
      borderWidth: 1,
    },
    label: {
      color: theme.neutralColor500,
    },
    flexRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    bottomText: {
      color: theme.neutralColor500,
      fontSize: theme.fontS,
    },
    input: {
      fontSize: theme.fontXL,
      marginLeft: -theme.spaceXS,
      marginVertical: theme.spaceXS,
      flex: 1,
    },
    dropDown: {
      height: 40,
      borderColor: theme.neutralColor500,
      zIndex: 999,
    },
    dropDownContainerStyle: {
      zIndex: 999,
      borderWidth: 1,
      position: 'relative',
      borderColor: theme.primaryColor,
    },
    dropdownWrapper: {
      maxWidth: '40%',
    },
  });
};
