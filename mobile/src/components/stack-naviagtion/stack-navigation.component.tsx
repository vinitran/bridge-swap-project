import React from 'react';
import {ScreenStack} from '../../interface/screen-stack.interface';
import {
  StackNavigationOptions,
  createStackNavigator,
} from '@react-navigation/stack';

interface StackNaviationProps {
  initScreen: string;
  routes: ScreenStack[];
  options?: StackNavigationOptions;
}

const Stack = createStackNavigator();

export const StackNaviagtion = ({
  initScreen,
  routes,
  options,
}: StackNaviationProps) => {
  return (
    <Stack.Navigator initialRouteName={initScreen} screenOptions={options}>
      {routes.map(route => (
        <Stack.Screen
          name={route.route.name}
          component={route.component}
          options={{...route.option, title: route.route.title}}
        />
      ))}
    </Stack.Navigator>
  );
};
