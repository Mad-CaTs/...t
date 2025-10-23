import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getCokkie } from '@utils/cokkies';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TreePointServiceService {
  private readonly API = 'https://commissionsapi.inclub.world';
  private apiUrl = `${this.API}/api/v1/three`;

  constructor(private httpClient: HttpClient) { }

  getAllThreePointsById(id: number): Observable<any> {
    return this.httpClient.post<any>(`${this.apiUrl}/all-points/${id}`, {}).pipe(
      map(response => response),
      catchError((error: any) => {
        return throwError(error);
      })
    );
  }

  payBonus(periodId: number) {
    return this.httpClient.get<any>(`${this.apiUrl}/bonus/pay/${periodId}`, {}).pipe(
      map(response => response),
      catchError((error: any) => {
        return throwError(error);
      })
    );
  }

}
