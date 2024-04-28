import React from 'react';
import { AppContext, IAppContext } from '../context/app.context';
import { ApiService } from '../services/api.services';

interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const contextValue: IAppContext = {
    services: {
      apiService: new ApiService(),
    },
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};
