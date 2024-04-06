import {LightColor} from './light.color';
import {appTheme, commonVariables} from './style.theme';

export const themes = {
  light: appTheme(LightColor),
};

export type AppThemeName = 'light';
export type AppTheme = ReturnType<typeof appTheme>;
export type AppColorsTheme = typeof LightColor;
export type AppThemeVariables = typeof LightColor & typeof commonVariables;
