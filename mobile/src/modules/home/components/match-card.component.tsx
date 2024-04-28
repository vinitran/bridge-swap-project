import React from 'react';
import { Match } from '../../../interface/match.interface';
import { useTheme } from '../../../hook/theme.hook';
import { AppTheme } from '../../../theme/theme';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from '../../../components/icon/icon.component';

interface MatchCardProps {
  match: Match;
  onPress: (id: string) => void;
}

export const MatchCard = ({ match, onPress }: MatchCardProps) => {
  const theme = useTheme();
  const styles = initStyles(theme);

  const time = new Date(match.timestamp);

  const onPressCard = () => {
    if (!match.is_live) return;

    onPress(match.id);
  };

  return (
    <TouchableOpacity activeOpacity={0.9} style={styles.wrapper} onPress={onPressCard}>
      <View style={styles.betweenRow}>
        {match.is_live ? (
          <View style={[styles.liveContainer, styles.hidden]}>
            <Text style={styles.contrastText}>LIVE</Text>
            <Icon name="live" />
          </View>
        ) : (
          <View />
        )}
        <View style={styles.tournamentWrapper}>
          <Text style={styles.text} numberOfLines={1} ellipsizeMode="tail">
            {match.tournament.name}
          </Text>
        </View>
        {match.is_live ? (
          <View style={styles.liveContainer}>
            <Text style={styles.contrastText}>LIVE</Text>
            <Icon name="live" />
          </View>
        ) : (
          <View />
        )}
      </View>
      <View style={styles.aroundRow}>
        <View style={styles.teamWrapper}>
          <Image source={{ uri: match.home.logo }} style={styles.logo} resizeMode="cover" />
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.teamName}>
            {match.home.name}
          </Text>
        </View>
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          {match.is_live ? (
            <>
              <View style={styles.scoreWrapper}>
                <Text style={styles.score}>{match.scores.home}</Text>
                <Text style={styles.hyphen}>-</Text>
                <Text style={styles.score}>{match.scores.away}</Text>
              </View>
              <Text style={styles.matchTime}>{match.parse_data?.time}</Text>
            </>
          ) : (
            <>
              <Text>{`${match.date.substring(6, 8)}/${match.date.substring(
                4,
                6
              )}/${match.date.substring(0, 4)}`}</Text>
              <Text>
                {' '}
                {`${time.getHours().toString().padStart(2, '0')}:${time
                  .getMinutes()
                  .toString()
                  .padStart(2, '0')}`}
              </Text>
            </>
          )}
        </View>

        <View style={styles.teamWrapper}>
          <Image source={{ uri: match.away.logo }} style={styles.logo} resizeMode="cover" />
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.teamName}>
            {match.away.name}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const initStyles = (theme: AppTheme) => {
  return StyleSheet.create({
    betweenRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
    },
    aroundRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      marginTop: theme.spaceMS,
    },
    liveContainer: {
      borderRadius: theme.radiusCircle,
      backgroundColor: '#f2152d',
      paddingHorizontal: theme.spaceS,
      paddingVertical: theme.spaceXS,
      flexDirection: 'row',
      alignItems: 'center',
    },
    wrapper: {
      borderRadius: theme.radiusMS,
      backgroundColor: theme.backgroundColor,
      paddingBottom: theme.spaceMS,
      paddingHorizontal: theme.spaceS,
      marginVertical: theme.spaceS,
      width: '100%',
    },
    contrastText: {
      color: theme.textContrastColor,
      marginRight: theme.spaceXXS,
    },
    text: {},
    tournamentWrapper: {
      borderBottomLeftRadius: theme.radiusS,
      borderBottomRightRadius: theme.radiusS,
      backgroundColor: theme.neutralColor200,
      paddingHorizontal: theme.spaceS,
      paddingVertical: theme.spaceS,
      marginHorizontal: theme.spaceXS,
      flexShrink: 1,
    },
    hidden: {
      opacity: 0,
    },
    logo: {
      width: theme.spaceXXL,
      height: theme.spaceXXL,
      marginBottom: theme.spaceMS,
    },
    scoreWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    score: {
      fontWeight: '700',
      fontSize: theme.fontM,
      color: theme.neutralColor900,
    },
    hyphen: {
      color: theme.neutralColor500,
      marginHorizontal: theme.spaceS,
    },
    teamWrapper: {
      alignItems: 'center',
      flex: 1,
      paddingHorizontal: theme.spaceXS,
    },
    teamName: {
      color: theme.neutralColor900,
      fontSize: theme.fontM,
    },
    matchTime: {
      color: theme.semanticSuccessColor500,
    },
  });
};
