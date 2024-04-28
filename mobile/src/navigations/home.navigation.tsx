import React from 'react';
import { ScreenStack } from '../interface/screen-stack.interface';
import { screens } from './const/screens.const';
import { MatchListScreen } from '../modules/home/screen/match-list.screen';
import { StackNavigation } from './components/stack.navigation';
import { MatchDetailScreen } from '../modules/home/screen/match-detail.screen';

const homeScreens: ScreenStack[] = [
  {
    route: screens.matchList,
    component: MatchListScreen,
    options: {
      headerShown: false,
    },
  },
  {
    route: screens.matchDetail,
    component: MatchDetailScreen,
  },
];

export const HomeNavigation = () => {
  return <StackNavigation routes={homeScreens} initialRoute={screens.matchList.name} />;
};
