import React from 'react';
import {
  SafeAreaProvider,
  SafeAreaView,
  initialWindowMetrics,
} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

interface AppWrapperProps {
  children: React.ReactNode;
}

export const AppWrapper = ({ children }: AppWrapperProps) => {
  return (
    <>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1 }}>
          {children}
        </SafeAreaView>
      </SafeAreaProvider>
      <Toast />
    </>
  );
};
