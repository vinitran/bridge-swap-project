import React from 'react';
import { Route } from './route.interface';
import { StackNavigationOptions } from '@react-navigation/stack';

export interface ScreenStack {
  route: Route;
  component: () => React.JSX.Element;
  options?: StackNavigationOptions;
}
