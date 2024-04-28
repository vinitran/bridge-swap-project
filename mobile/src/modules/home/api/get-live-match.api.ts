import { Observable, pluck, take, tap } from 'rxjs';
import { ApiService } from '../../../services/api.services';
import { Match } from '../../../interface/match.interface';

export const getLiveMatch = (api: ApiService): Observable<Match[]> => {
  return api.get('https://live.vebo.xyz/api/match/live').pipe(pluck('data'), take(1));
};
