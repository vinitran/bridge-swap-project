import { catchError, map, of } from 'rxjs';
import { ajax } from 'rxjs/ajax';

export enum API_METHOD {
  GET = 'GET',
  POST = 'POST',
}

interface APIRequest {
  url: string;
  method?: API_METHOD;
  params?: {
    [key: string]: string;
  };
}

export const api = ({ url, method = API_METHOD.GET, params }: APIRequest) => {
  return ajax({
    url: process.env.API_URL + url,
    method,
    body: params,
    headers: {
      'Content-Type': 'application/json',
    },
  }).pipe(
    map((res) => res.response),
    catchError((error) => {
      console.log('error: ', error);
      return of(error);
    })
  );
};
