import { Dimensions, TextStyle, ViewStyle } from 'react-native';
import { AppColor } from './light.color';

const { width, height, fontScale } = Dimensions.get('window');
const optimizeFontScale = fontScale > 7 / 6 ? (fontScale / 7) * 6 : fontScale;

/**
 * Sử dụng fontSize với Text svg cần (* theme.fontScale) hoặc set cứng
 */
const fontSize = {
  /** fontXXXXL: 36*/
  fontXXXXL: 36 / optimizeFontScale,
  /** fontXXXL: 24*/
  fontXXXL: 24 / optimizeFontScale,
  /** fontXXL: 22*/
  fontXXL: 22 / optimizeFontScale,
  /** fontXL: 20*/
  fontXL: 20 / optimizeFontScale,
  /** fontL: 18*/
  fontL: 18 / optimizeFontScale,
  /** fontM: 16*/
  fontM: 16 / optimizeFontScale,
  /** fontS: 14*/
  fontS: 14 / optimizeFontScale,
  /** fontXS: 12*/
  fontXS: 12 / optimizeFontScale,
  /** fontXXS: 10*/
  fontXXS: 10 / optimizeFontScale,
};

const iconSize = {
  /** iconXS: 12*/
  iconXXS: 12,
  /** iconXS: 14*/
  iconXS: 14,
  /** iconS: 16*/
  iconS: 16,
  /** iconM: 20*/
  iconM: 20,
  /** iconL: 24*/
  iconL: 24,
  /** iconXL: 32*/
  iconXL: 32,
};

const spaceSize = {
  /** spaceXXS: 2*/
  spaceXXS: 2,
  /** spaceXS: 4*/
  spaceXS: 4,
  /** spaceS: 8*/
  spaceS: 8,
  /** spaceMS: 12*/
  spaceMS: 12,
  /** spaceM: 16*/
  spaceM: 16,
  /** spaceML: 20*/
  spaceML: 20,
  /** spaceL: 24*/
  spaceL: 24,
  /** spaceLL: 28*/
  spaceLL: 28,
  /** spaceXL: 32*/
  spaceXL: 32,
  /** spaceXXL: 40*/
  spaceXXL: 40,
  fullWidth: width,
  fullHeight: height,
  fontScale: optimizeFontScale,
};

const radiusSize = {
  /** radiusS: 8*/
  radiusS: 8,
  /** radiusMS: 12*/
  radiusMS: 12,
  /** radiusM: 16*/
  radiusM: 16,
  /** radiusL: 20*/
  radiusL: 20,
  /** radiusCircle: 50*/
  radiusCircle: 50,
};

export const commonVariables = {
  fontRatio: 1,
  scaleRatio: 1,
  ...fontSize,
  ...iconSize,
  ...spaceSize,
  ...radiusSize,
};

export const appTheme = (colorVariables: AppColor) => {
  const variables = { ...colorVariables, ...commonVariables };

  return {
    button: {
      container: {
        paddingVertical: variables.spaceMS,
        backgroundColor: variables.primaryColor,
        borderRadius: variables.radiusMS,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
      } as ViewStyle,
      label: {
        color: variables.textContrastColor,
        fontSize: variables.fontM,
        fontWeight: '600',
      } as TextStyle,
    },
    icon: {
      fill: 'none',
      color: 'none',
      width: variables.iconL,
      height: variables.iconL,
    },
    dropdown: {
      labelStyle: {
        fontSize: variables.fontM,
      } as TextStyle,
      dropDownContainerStyle: {
        shadowRadius: 4,
        overflow: 'visible',
        shadowOpacity: 0.25,
        marginTop: variables.spaceXS,
        elevation: variables.spaceXS,
        shadowOffset: { width: 0, height: 4 },
      } as ViewStyle,
      selectedItemContainerStyle: {} as ViewStyle,
      selectedItemLabelStyle: {} as TextStyle,
      listItemLabelStyle: {
        fontSize: variables.fontM,
      } as TextStyle,
      dropdownStyle: {
        minHeight: 40,
      } as ViewStyle,
      container: {} as ViewStyle,
      placeholderStyle: {
        fontSize: variables.fontM,
      },
    },
    ...variables,
  };
};
