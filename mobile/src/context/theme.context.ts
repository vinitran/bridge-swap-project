import {createContext} from 'react';
import {AppTheme} from '../theme/theme';

export interface IThemeContext {
  theme: AppTheme;
}

export const ThemeContext = createContext<IThemeContext>({
  theme: {} as AppTheme,
});
