import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect } from 'react';

import { MainNavigation } from './navigations/main.naviagtion';
import { ThemeProvider } from './theme/theme.provider';
import { Appearance } from 'react-native';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { WalletProvider } from './providers/wallet.provider';
import { AppWrapper } from './components/app-wrapper/app-wrapper.component';

function App(): React.JSX.Element {
  useEffect(() => {
    Appearance.setColorScheme('light');
  }, []);

  return (
    <Provider store={store}>
      <AppWrapper>
        <NavigationContainer>
          <ThemeProvider>
            <WalletProvider>
              <MainNavigation />
            </WalletProvider>
          </ThemeProvider>
        </NavigationContainer>
      </AppWrapper>
    </Provider>
  );
}

export default App;