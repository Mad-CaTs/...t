import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class PercentOverdueTypeService {
  private readonly API = environment.api;
  private apiUrl = `${this.API}/api/`;

  constructor(private httpClient: HttpClient) { }

  getPercentOverdueTypes(): Observable<any> {
    return this.httpClient.get<any>(`${this.apiUrl}percentOverdueType`).pipe(
      map(response => response.data),
      catchError((error: any) => {
        return throwError(error);
      })
    );
  }
}
