import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { ReactElement, ReactNode } from 'react';
import { BridgeScreen } from '../modules/bridge/screen/bridge.screen';
import { Icon } from '../components/icon/icon.component';
import { useTheme } from '@react-navigation/native';
import { SwapScreen } from '../modules/swap/screen/swap.screen';
import { AccountScreen } from '../modules/account/screen/account.screen';
import { TabIcon } from './components/tab-icon.component';

interface TabNavigatorProps {
  name: string;
  icon: string;
  component: () => React.JSX.Element;
  tabName: string;
}

const TabNavigator = createBottomTabNavigator();

export const MainNavigation = () => {
  const theme = useTheme();
  const routes: TabNavigatorProps[] = [
    {
      name: 'bridge',
      icon: 'bridge',
      component: BridgeScreen,
      tabName: 'Bridge',
    },
    {
      name: 'swap',
      icon: 'swap-outline',
      component: SwapScreen,
      tabName: 'Swap',
    },
    {
      name: 'account',
      icon: 'account',
      component: AccountScreen,
      tabName: 'Account',
    },
  ];

  return (
    <TabNavigator.Navigator screenOptions={{ tabBarHideOnKeyboard: true, headerShown: false }}>
      {routes.map((route) => (
        <TabNavigator.Screen
          key={route.name}
          name={route.name}
          component={route.component}
          options={{
            tabBarLabel: route.tabName,
            tabBarIcon: ({ color, size }) => (
              <TabIcon
                color={color}
                name={route.icon}
                style={{ width: size, height: size }}
                disable={true}
              />
            ),
          }}
        />
      ))}
    </TabNavigator.Navigator>
  );
};
