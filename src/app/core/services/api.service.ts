import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
   public http: HttpClient
  ) { }

  // get method
  public _get(path: string, params: HttpParams = new HttpParams()): Observable<any> {
    console.log("pparameter " + params);
    return this.http.get(`${environment.api_url}${path}`, { params })
      .pipe(map(response => response), catchError(error => of(error)));
  }

  // put method
  public _put(path: string, body: Object = {}): Observable<any> {
    return this.http.put(`${environment.api_url}${path}`, body)
      .pipe(map(response => response), catchError(error => of(error)));
  }

  // post method
  public _post(path: string, body: Object = {}): Observable<any> {
    return this.http.post(`${environment.api_url}${path}`, body)
      .pipe(map(response => response), catchError(error => of(error)));
  }

  // delete method
  public _delete(path: string, params: HttpParams = new HttpParams()): Observable<any> {
    return this.http.delete(`${environment.api_url}${path}`, { params })
      .pipe(map(response => response), catchError(error => of(error)));
  }

}
