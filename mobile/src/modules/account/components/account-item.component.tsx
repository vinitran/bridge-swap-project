import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from '../../../components/icon/icon.component';
import { useTheme } from '../../../hook/theme.hook';
import { AppTheme } from '../../../theme/theme';

interface AccountItemProps {
  label: string;
  icon: string;
  onPress: () => void;
}
export const AccountItem = ({ icon, label, onPress }: AccountItemProps) => {
  const theme = useTheme();
  const styles = initStyles(theme);

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Icon name={icon} />
      <Text style={styles.text}>{label}</Text>
    </TouchableOpacity>
  );
};

const initStyles = (theme: AppTheme) => {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      paddingVertical: theme.spaceS,
      paddingHorizontal: theme.spaceMS,
      borderTopColor: theme.neutralColor200,
      alignItems: 'center',
    },
    text: {
      color: theme.textColor,
      marginLeft: theme.spaceM,
    },
  });
};
