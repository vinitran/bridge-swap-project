import { useCallback, useEffect, useState } from 'react';
import { useService } from '../../../hook/service.hook';
import { getFutureMatch } from '../api/get-future-match.api';
import { FlatList, StyleSheet, View } from 'react-native';
import { forkJoin, map, of, switchMap, take } from 'rxjs';
import { getLiveMatch } from '../api/get-live-match.api';
import { Match } from '../../../interface/match.interface';
import { useTheme } from '../../../hook/theme.hook';
import { AppTheme } from '../../../theme/theme';
import { MatchCard } from '../components/match-card.component';
import { homeScreens } from '../const/route.const';
import { useNavigation } from '@react-navigation/native';

interface RenderItemProps {
  item: Match;
}

export const MatchListScreen = () => {
  const [matches, setMatches] = useState<Match[]>([]);

  const { apiService: api } = useService();
  const theme = useTheme();
  const styles = initStyles(theme);
  const navigation = useNavigation();

  useEffect(() => {
    forkJoin([getFutureMatch(api), getLiveMatch(api)])
      .pipe(
        map(([futureMatch, liveMatch]) => {
          const liveMap = new Map(liveMatch?.map((item) => [item.id, item]));
          const futureMap = futureMatch?.map((item) =>
            liveMap.has(item.id) ? liveMap.get(item.id)! : item
          );

          return futureMap;
        }),
        take(1)
      )
      .subscribe((match) => {
        setMatches(match);
      });
  });

  const navigateToLive = (matchId: string) => {
    navigation.navigate(homeScreens.matchDetail.name, {
      matchId,
    });
  };

  const renderItem = useCallback(
    ({ item }: RenderItemProps) => {
      return <MatchCard match={item} onPress={navigateToLive} />;
    },
    [navigateToLive]
  );

  return (
    <View style={styles.container}>
      <FlatList data={matches} renderItem={renderItem} style={styles.flatList} />
    </View>
  );
};

const initStyles = (theme: AppTheme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.secondaryColor50,
      justifyContent: 'center',
      alignItems: 'center',
    },
    flatList: {
      flex: 1,
      width: '100%',
      paddingHorizontal: theme.spaceS,
    },
  });
};
