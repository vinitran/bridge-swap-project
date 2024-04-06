import {ThemeContext} from '../context/theme.context';
import {themes} from './theme';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider = ({children}: ThemeProviderProps) => {
  return (
    <ThemeContext.Provider value={{theme: themes.light}}>
      {children}
    </ThemeContext.Provider>
  );
};
