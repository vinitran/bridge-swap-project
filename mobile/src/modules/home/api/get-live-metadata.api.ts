import { Observable, pluck, take } from 'rxjs';
import { ApiService } from '../../../services/api.services';
import { Metadata } from '../../../interface/match.interface';

export const getLiveMetadata = (api: ApiService, id: string): Observable<Metadata> => {
  return api.get(`https://api.vebo.xyz/api/match/${id}/meta`).pipe(pluck('data'), take(1));
};
