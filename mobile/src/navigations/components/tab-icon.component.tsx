import React from 'react';
import { TouchableOpacity } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { iconSet } from '../../assets/icons/icon-set';
import { useTheme } from '../../hook/theme.hook';

interface IconProps {
  name: string;
  color?: string;
  onPress?: () => void;
  size?: number;
  style?: object;
  disable?: boolean;
}

export const TabIcon = ({ name, onPress, color, size, style, disable = false }: IconProps) => {
  const theme = useTheme();
  const styles = { ...theme.icon, ...style };

  return (
    <TouchableOpacity onPress={onPress} disabled={disable}>
      <SvgXml
        style={styles}
        xml={iconSet[name]}
        width={styles.width}
        height={styles.height}
        fill={color}
      />
    </TouchableOpacity>
  );
};
