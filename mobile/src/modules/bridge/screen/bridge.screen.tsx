import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../../hook/theme.hook';
import { AppTheme } from '../../../theme/theme';

export const BridgeScreen = () => {
  const theme = useTheme();
  const styles = initStyles(theme);

  return (
    <View style={styles.container}>
      <Text>hihi</Text>
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
    },
  });
};
