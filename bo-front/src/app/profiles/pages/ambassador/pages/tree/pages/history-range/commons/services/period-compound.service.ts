import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PeriodCompoundService {
  private url = environment.URL_API_COMMISSION;

  constructor(private http: HttpClient) { }

  getPeriodCompoundByUser(userId: number, page: number, size: number): Observable<any> {
    return this.http.get<any>(`${this.url}/periodCompound/user/${userId}?page=${page}&size=${size}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
}
