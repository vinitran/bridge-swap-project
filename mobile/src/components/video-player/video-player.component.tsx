import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import BaseVideoPlayer from 'react-native-media-console';
import { useTheme } from '../../hook/theme.hook';
import { AppTheme } from '../../theme/theme';
import { VIDEO, isIos, isTablet } from './video-player.const';
import Orientation from 'react-native-orientation-locker';
import { useAnimations } from '@react-native-media-console/reanimated';
import useBackbuttonHandler from './utils';

interface VideoPlayerProps {
  uri?: string;
}

export const VideoPlayer = ({ uri }: VideoPlayerProps) => {
  const theme = useTheme();
  const styles = initStyles(theme, isTablet());

  const [fullScreenTapEnabled, setFullScreenTapEnabled] = useState(false);
  const [videoDisplayMode, setVideoDisplayMode] = useState<'portrait' | 'landscape'>(
    VIDEO.videoDisplayModes.portrait
  );

  const videoRef = useRef<any>();

  const isPortrait = useMemo(() => {
    return videoDisplayMode === VIDEO.videoDisplayModes.portrait;
  }, [videoDisplayMode]);

  useEffect(() => {
    const delay = setTimeout(() => {
      setFullScreenTapEnabled(true);
    }, 0); //this is workaround for https://github.com/LunatiqueCoder/react-native-media-console/issues/76 issue.
    return () => {
      clearTimeout(delay);
    }; // Clear the timeout when the effect unmounts
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      videoDisplayMode === VIDEO.videoDisplayModes.portrait
        ? Orientation.lockToPortrait()
        : Orientation.lockToLandscape();
    }, 0);
    return () => {
      clearTimeout(delay);
    }; // Clear the timeout when the effect unmounts
  }, [videoDisplayMode]);

  const switchToPortrait = () => {
    setVideoDisplayMode(VIDEO.videoDisplayModes.portrait);
    if (!isIos()) {
      videoRef?.current?.dismissFullscreenPlayer();
    }
  };

  const switchToLandscape = () => {
    setVideoDisplayMode(VIDEO.videoDisplayModes.landscape);
    if (!isIos()) {
      videoRef?.current?.presentFullscreenPlayer();
    }
  };

  const onFullScreenIconToggle = () => {
    if (fullScreenTapEnabled) {
      if (isPortrait) {
        switchToLandscape();
      } else {
        switchToPortrait();
      }
    }
  };

  useBackbuttonHandler(!isPortrait ? switchToPortrait : () => {});

  const handleError = (errorObj: any) => {
    console.log(errorObj);
    if (errorObj?.error?.errorCode === 'INVALID_URL') {
      return;
    }

    if (
      errorObj &&
      errorObj.error &&
      (errorObj.error.localizedDescription || errorObj.error.localizedFailureReason)
    ) {
      let errorMessage = `${errorObj.error.code ? `${errorObj.error.code} : ` : ''} ${
        errorObj.error.localizedFailureReason
          ? errorObj.error.localizedFailureReason
          : errorObj.error.localizedDescription
          ? errorObj.error.localizedDescription
          : ''
      }`;
      Alert.alert('Error!', errorMessage, [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ]);
    } else {
      Alert.alert('Error!', 'An error occured while playing the video.', [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ]);
    }
  };

  return (
    <View style={isPortrait ? styles.portraitVideoContainer : styles.landscapeVideoContainer}>
      <BaseVideoPlayer
        source={{ uri: 'https://content.jwplatform.com/manifests/yp34SRmf.m3u8' }}
        showOnStart={false}
        disableBack={false}
        repeat
        disableDisconnectError={true}
        controlAnimationTiming={VIDEO.controlAnimationTiming}
        controlTimeoutDelay={VIDEO.controlTimeoutDelay}
        rewindTime={VIDEO.rewindTime}
        resizeMode={VIDEO.resizeMode}
        videoRef={videoRef}
        useAnimations={useAnimations}
        videoStyle={{ backgroundColor: 'white' }}
        onEnterFullscreen={onFullScreenIconToggle}
        onExitFullscreen={onFullScreenIconToggle}
        onBack={switchToPortrait}
        onError={handleError}
      />
    </View>
  );
};

const initStyles = (theme: AppTheme, isTablet: boolean) => {
  return StyleSheet.create({
    portraitVideoContainer: {
      width: '100%',
      height: isTablet ? 350 : 224,
    },
    landscapeVideoContainer: {
      width: '100%',
      height: theme.fullWidth,
    },
  });
};
