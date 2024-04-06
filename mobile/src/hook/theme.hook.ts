import {useContext} from 'react';
import {ThemeContext} from '../context/theme.context';

export const useTheme = () => {
  const {theme} = useContext(ThemeContext);

  return theme;
};
