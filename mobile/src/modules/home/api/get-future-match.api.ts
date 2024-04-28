import { Observable, pluck, take, tap } from 'rxjs';
import { ApiService } from '../../../services/api.services';
import { Match } from '../../../interface/match.interface';

export const getFutureMatch = (api: ApiService): Observable<Match[]> => {
  return api.get('https://api.vebo.xyz/api/match/featured').pipe(pluck('data'), take(1));
};
