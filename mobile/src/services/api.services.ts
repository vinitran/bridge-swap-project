import { Observable, of } from 'rxjs';
import { ajax, AjaxResponse } from 'rxjs/ajax';
import { catchError, pluck } from 'rxjs/operators';
import { objectToQueryString } from '../utils/app.helper';

const handleError = (error: AjaxResponse<any>) => {
  const { response, request } = error;
  if (error.request.url?.includes('/file/images')) {
    try {
    } catch (err) {}
  }

  console.log('api error', request.url, response);
  return of(null);
};

export class ApiService {
  protected apiPrefix = process.env.API_URL;
  protected headers = {
    Authorization: '',
    'Content-Type': 'application/json',
  };

  getHeaders() {
    return { ...this.headers };
  }

  setHeaderToken(token: string) {
    this.headers['Authorization'] = `Bearer ${token}`;
  }

  private makeRequest(method: string, url: string, body?: any, headers = {}) {
    return ajax({
      url,
      body,
      method,
      headers: { ...this.headers, ...headers },
    }).pipe(
      pluck('response'),
      catchError((error) => handleError(error))
    );
  }

  get(url: string, params = {}, headers = {}): Observable<any> {
    const queryString = objectToQueryString(params);
    const urlParam = queryString ? `?${queryString}` : '';
    return this.makeRequest('GET', this.prefixUri(url + urlParam), null, headers);
  }

  post(url: string, body: any, headers = {}): Observable<any> {
    return this.makeRequest('POST', this.prefixUri(url), body, headers);
  }

  put(url: string, body?: any, headers = {}): Observable<any> {
    return this.makeRequest('PUT', this.prefixUri(url), body, headers);
  }

  delete(url: string, body?: any, headers = {}): Observable<any> {
    return this.makeRequest('DELETE', this.prefixUri(url), body, headers);
  }

  patch(url: string, body?: any, headers = {}): Observable<any> {
    return this.makeRequest('PATCH', this.prefixUri(url), body, headers);
  }

  upload(url: string, formData: FormData, headers = {}): Observable<any> {
    return this.makeRequest('POST', this.prefixUri(url), formData, {
      'Content-Type': 'multipart/form-data',
      ...headers,
    });
  }

  /**
   * Prefix specified uri with backend API prefix.
   */
  private prefixUri(uri: string) {
    if (uri.includes('http')) {
      return uri;
    }
    return this.apiPrefix + uri;
  }
}
