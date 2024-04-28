import { StyleSheet, View } from 'react-native';
import { useService } from '../../../hook/service.hook';
import { useTheme } from '../../../hook/theme.hook';
import { AppTheme } from '../../../theme/theme';
import { useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { getLiveMetadata } from '../api/get-live-metadata.api';
import { Metadata } from '../../../interface/match.interface';
import { getVideoUrl } from '../../../utils/app.helper';
import { VideoPlayer } from '../../../components/video-player/video-player.component';

export const MatchDetailScreen = () => {
  const { apiService: api } = useService();
  const { params } = useRoute();
  const theme = useTheme();
  const styles = initStyles(theme);

  const [match, setMatch] = useState<Metadata>();
  const [streamUri, setUri] = useState<string>();

  useEffect(() => {
    getLiveMetadata(api, params?.matchId).subscribe((match) => {
      setMatch(match);

      if (!match?.play_urls || match.play_urls.length < 1) {
        return;
      }

      const url = getVideoUrl(match.play_urls);
      const updatedUrl = url ? url.replace(/playlist\.m3u8|index\.m3u8/g, 'chunklist.m3u8') : '';
      const proxyUrl = `https://stream.vinitran1245612.workers.dev?apiurl=${updatedUrl}&is_m3u8=true`;
      console.log(proxyUrl);
      setUri(proxyUrl);
    });
  }, []);

  return (
    <View style={styles.container}>
      <VideoPlayer uri={streamUri} />
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
  });
};
