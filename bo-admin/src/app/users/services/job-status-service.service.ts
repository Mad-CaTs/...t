import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { UserDelete } from '../models/UserDelete';

@Injectable({
  providedIn: 'root'
})
export class JobStatusServiceService {
  private apiUrl = `https://jobstatusapi.inclub.world/api/v1/`;

  constructor(private httpClient: HttpClient) { }

  deleteUser(user: UserDelete): Observable<any> {
    const options = {
      body: user,
    };
    return this.httpClient.delete<any>(`${this.apiUrl}job-status-delete/delete`, options).pipe(
      map(response => response.data),
      catchError((error: any) => {
        return throwError(error);
      }));
  }

}
