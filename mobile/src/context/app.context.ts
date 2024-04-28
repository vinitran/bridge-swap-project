import { createContext } from 'react';
import { ApiService } from '../services/api.services';

export interface IAppContext {
  services: {
    apiService: ApiService;
  };
}

export const AppContext = createContext<IAppContext>({
  services: {
    apiService: new ApiService(),
  },
});
