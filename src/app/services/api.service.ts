import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { LoginUtil } from "../utils/login-util";
import { Observable, catchError, throwError } from "rxjs";
import { HydrusKeyVerificationData } from "../login/login";
import {
  Boned,
  FileSearchAPI,
  HydrusFileId,
  HydrusFileIds,
  HydrusMetadata,
  RatingFileChanges,
} from "./api";
import { HydrusServiceInfo } from "../ratings/hydrus-services";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  loginUtil = LoginUtil;
  private backendApi: string | null;
  private apiKey: string | null;

  constructor(private http: HttpClient) {
    this.backendApi = LoginUtil.retrieveUrl();
    this.apiKey = LoginUtil.retrieveKey();
  }

  verifyAccess(
    api: string,
    key: string
  ): Observable<HydrusKeyVerificationData> {
    this.backendApi = api;
    this.apiKey = key;
    return this.http
      .get<HydrusKeyVerificationData>(
        this.backendApi + "verify_access_key",
        this.setHttpOptions()
      )
      .pipe(catchError(this.handleError));
  }

  /**
   * Searching and Fetching Files
   */

  // GET /get_files/search_files
  getFilesSearch(
    tags: string[],
    sortType: string,
    sortDir: string
  ): Observable<FileSearchAPI> {
    let searchUrl = LoginUtil.retrieveUrl() + "get_files/search_files";
    if (!tags.some((s) => s.includes("system:limit"))) {
      tags.push("system:limit = 45");
    }
    let params = encodeURIComponent(JSON.stringify(tags));
    const httpOptions = {
      headers: {
        rejectUnauthorized: "false",
        "Hydrus-Client-API-Access-Key": `${this.apiKey}`,
        "Access-Control-Allow-Origin": "*",
      },
      params: {
        tags: params,
        file_sort_type: sortType,
        file_sort_asc: sortDir,
      },
    };

    return this.http
      .get<FileSearchAPI>(searchUrl, httpOptions)
      .pipe(catchError(this.handleError));
  }

  getFileMetadata(fileIds: number[]): Observable<HydrusMetadata> {
    let searchUrl = this.backendApi + "get_files/file_metadata";
    let params = encodeURIComponent(JSON.stringify(fileIds));
    const httpOptions = {
      headers: {
        rejectUnauthorized: "false",
        "Hydrus-Client-API-Access-Key": `${this.apiKey}`,
        "Access-Control-Allow-Origin": "*",
      },
      params: { file_ids: params },
    };

    return this.http
      .get<HydrusMetadata>(searchUrl, httpOptions)
      .pipe(catchError(this.handleError));
  }

  public getThumbnailURLFromHash(hash: string): string {
    return (
      this.backendApi +
      "get_files/thumbnail?hash=" +
      hash +
      "&Hydrus-Client-API-Access-Key=" +
      this.apiKey
    );
  }

  public editFileRating(file: RatingFileChanges): Observable<any> {
    let editUrl = this.backendApi + "edit_ratings/set_rating";

    return this.http
      .post<any>(editUrl, file, this.setHttpOptions())
      .pipe(catchError(this.handleError));
  }

  //Delete a single file by id
  deleteFileById(fileid: number): Observable<any> {
    let delUrl = this.backendApi + "add_files/delete_files";
    const id = new HydrusFileId(fileid);
    return this.http
      .post<any>(delUrl, id, this.setHttpOptions())
      .pipe(catchError(this.handleError));
  }

  //Delete a list of  files by id
  deleteMultipleFilesById(fileids: number[]): Observable<any> {
    let delUrl = this.backendApi + "add_files/delete_files";
    const ids = new HydrusFileIds(fileids);
    return this.http
      .post<any>(delUrl, ids, this.setHttpOptions())
      .pipe(catchError(this.handleError));
  }

  //archive a single file by id
  archiveFileById(fileid: number): Observable<any> {
    let archiveUrl = this.backendApi + "add_files/archive_files";
    const id = new HydrusFileId(fileid);
    return this.http
      .post<any>(archiveUrl, id, this.setHttpOptions())
      .pipe(catchError(this.handleError));
  }

  //archive a list of  files by id
  archiveMultipleFilesById(fileids: number[]): Observable<any> {
    let archiveUrl = this.backendApi + "add_files/archive_files";
    const ids = new HydrusFileIds(fileids);
    return this.http
      .post<any>(archiveUrl, ids, this.setHttpOptions())
      .pipe(catchError(this.handleError));
  }

  /**
   * Generates a file's URL from its Hash
   * @param file_hash the hash of the file to get
   * @return the URL of the raw full file referenced by the hash
   */
  public getFileURLFromHash(file_hash: string): string {
    return (
      this.backendApi +
      "get_files/file?hash=" +
      file_hash +
      "&Hydrus-Client-API-Access-Key=" +
      this.apiKey
    );
  }

  public getFileAsBlob(file_hash: string): Observable<Blob> {
    return this.http.get(this.backendApi + "get_files/file?hash=" + file_hash, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Hydrus-Client-API-Access-Key": `${this.apiKey}`,
      },
      responseType: "blob",
    });
  }

  getServices(): Observable<HydrusServiceInfo> {
    let searchUrl = LoginUtil.retrieveUrl() + "get_services";
    const httpOptions = {
      headers: {
        rejectUnauthorized: "false",
        "Hydrus-Client-API-Access-Key": `${this.apiKey}`,
        "Access-Control-Allow-Origin": "*",
      },
    };
    return this.http
      .get<HydrusServiceInfo>(searchUrl, httpOptions)
      .pipe(catchError(this.handleError));
  }

      /******************************************************************** 
    /*                         MANAGING DATABASE
    /******************************************************************** */
  
    howBoned(): Observable<Boned> {
      let delUrl = this.backendApi + 'manage_database/mr_bones';
      return this.http
        .get<Boned>(delUrl, this.setHttpOptions())
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
        rejectUnauthorized: "false",
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
