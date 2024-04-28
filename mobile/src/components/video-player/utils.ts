import { useEffect } from 'react';
import { BackHandler } from 'react-native';

const useBackbuttonHandler = (callback: () => void) => {
  useEffect(() => {
    const handleBackButtonClick = () => {
      if (typeof callback === 'function') {
        callback(); // Call the provided callback function
        return true; // Return true to prevent default back behavior
      }
      return false; // Return false to allow default back behavior
    };
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default useBackbuttonHandler;
