import { useContext } from 'react';
import { AppContext } from '../context/app.context';

export const useService = () => {
  const { services } = useContext(AppContext);

  return services;
};
