import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class PercentOverdueDetailService {
  private readonly API = environment.api;
  private apiUrl = `${this.API}/api/`;

  constructor(private httpClient: HttpClient) { }

  getPercentOverdueDetailByPercentOverdueTypeIdAndStatus(id: number, status: number): Observable<any> {
    return this.httpClient.get<any>(`${this.apiUrl}percentOverdueDetail/percentOverdueType/${id}/status/${status}`).pipe(
      map(response => response.data),
      catchError((error: any) => {
        return throwError(error);
      })
    );
  }

  getPercentOverdueDetailByPercentOverdueTypeId(id: number): Observable<any> {
    return this.httpClient.get<any>(`${this.apiUrl}percentOverdueDetail/percentOverdueType/${id}`).pipe(
      map(response => response.data),
      catchError((error: any) => {
        return throwError(error);
      })
    );
  }

  savePercentOverdueDetail(data: any): Observable<any> {
    return this.httpClient.post<any>(`${this.apiUrl}percentOverdueDetail`, data).pipe(
      map(response => response.data),
      catchError((error: any) => {
        return throwError(error);
      })
    );
  }

  updatePercentOverdueDetail(data: any, id: number): Observable<any> {
    return this.httpClient.put<any>(`${this.apiUrl}percentOverdueDetail/${id}`, data).pipe(
      map(response => response.data),
      catchError((error: any) => {
        return throwError(error);
      })
    );
  }

  deletePercentOverdueDetail(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.apiUrl}percentOverdueDetail/${id}`).pipe(
      map(response => response.data),
      catchError((error: any) => {
        return throwError(error);
      })
    );
  }

}
