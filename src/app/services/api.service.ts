import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginUtil } from '../utils/login-util';
import { Observable, catchError, throwError } from 'rxjs';
import { HydrusKeyVerificationData } from '../login/login';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  loginUtil = LoginUtil;
  private backendApi: string | null;
  private apiKey: string | null;

  constructor(private http: HttpClient) {
    this.backendApi = LoginUtil.retrieveUrl();
    this.apiKey = LoginUtil.retrieveKey();
  }

  verifyAccess(api: string, key: string): Observable<HydrusKeyVerificationData> {
    this.backendApi = api;
    this.apiKey=key;
    return this.http
      .get<HydrusKeyVerificationData>(this.backendApi + 'verify_access_key', this.setHttpOptions())
      .pipe(catchError(this.handleError));
  }

   /**
   * Setting HTTP OPTIONS
   * ignore/avoid certificate errors - 'ignore SEC_ERROR_UNKNOWN_ISSUER' (rejectUnauthorized)
   * place API key in header
   */
   setHttpOptions(): {} {
    return {
      headers: new HttpHeaders({
        'rejectUnauthorized': 'false'
      }).set("Hydrus-Client-API-Access-Key", `${this.apiKey}`),
    };
  }

    /**
   * ERROR HANDLING
   */
    private handleError(error: HttpErrorResponse): Observable<never> {
      // return an observable with a user-facing error message
      return throwError(error.error);
    }
  

}
