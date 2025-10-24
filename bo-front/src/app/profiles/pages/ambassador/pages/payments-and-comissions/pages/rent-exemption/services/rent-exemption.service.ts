import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RentExemptionService {
  private url = '/api/v1';

  constructor(private http: HttpClient) { }

  getRentExemptionsByUserId(userId: number, page: number, size: number): Observable<any> {
    return this.http.get<any>(`${this.url}/rentExemption/user/${userId}?page=${page}&size=${size}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  saveRentExemption(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.url}/rentExemption`, formData).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

}
