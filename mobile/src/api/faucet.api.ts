import { map, pluck, take, tap } from 'rxjs';
import { API_METHOD, api } from './api';

interface FaucetParams {
  user_address: string;
  token: string;
  chain_id: string;
}

export const faucetRequest = (params: FaucetParams) => {
  return api({ url: '/api/v1/faucet', params: params as any, method: API_METHOD.POST }).pipe(
    take(1)
  );
};
