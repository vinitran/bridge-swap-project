import { Dimensions, Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { ResizeMode } from 'react-native-video';

const deviceType = DeviceInfo.getDeviceType();

export const isIos = () => Platform.OS === 'ios';
export const isTablet = () => deviceType === 'Tablet';

export type TVideo = {
  controlAnimationTiming: number;
  controlTimeoutDelay: number;
  rewindTime: number;
  resizeMode: 'contain' | 'stretch' | 'none' | ResizeMode | 'cover' | undefined;
  videoDisplayModes: {
    portrait: 'portrait' | 'landscape';
    landscape: 'portrait' | 'landscape';
  };
};

export const VIDEO: TVideo = {
  controlAnimationTiming: isIos() ? 500 : 0,
  controlTimeoutDelay: 10000,
  rewindTime: 5,
  resizeMode: 'contain',
  videoDisplayModes: {
    portrait: 'portrait',
    landscape: 'landscape',
  },
};
