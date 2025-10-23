import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class GracePeriodParameterService {
  private readonly API = environment.api;
  private apiUrl = `${this.API}/api/`;

  constructor(private httpClient: HttpClient) { }

  getGracePeriodParameters(): Observable<any> {
    return this.httpClient.get<any>(`${this.apiUrl}gracePeriodParameter`).pipe(
      map(response => response.data),
      catchError((error: any) => {
        return throwError(error);
      }));
  }

  saveGracePeriodParameter(data: any): Observable<any> {
    return this.httpClient.post<any>(`${this.apiUrl}gracePeriodParameter`, data).pipe(
      map(response => response.data),
      catchError((error: any) => {
        return throwError(error);
      }));
  }

  updateGracePeriodParameter(data: any, id: number): Observable<any> {
    return this.httpClient.put<any>(`${this.apiUrl}gracePeriodParameter/${id}`, data).pipe(
      map(response => response.data),
      catchError((error: any) => {
        return throwError(error);
      }));
  }

  deleteGracePeriodParameter(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.apiUrl}gracePeriodParameter/${id}`).pipe(
      map(response => response.data),
      catchError((error: any) => {
        return throwError(error);
      }));
  }

}
