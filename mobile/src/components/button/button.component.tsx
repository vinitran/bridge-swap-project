import React from 'react';
import { Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';
import { useTheme } from '../../hook/theme.hook';

interface ButtonStyle {
  container?: ViewStyle;
  label?: TextStyle;
}

interface ButtonProps {
  label: string;
  onPress: () => void;
  style?: ButtonStyle;
  disable?: boolean;
}

export const Button = ({ label, style, onPress, disable = false }: ButtonProps) => {
  const theme = useTheme();

  const styles = { ...theme.button, ...style };

  return (
    <TouchableOpacity disabled={disable} style={styles.container} onPress={onPress}>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};
