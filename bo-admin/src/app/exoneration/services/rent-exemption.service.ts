import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RentExemptionUserSearchRequest } from '../models/rent-exemption-user-search-request';
import { environment } from 'src/environments/environment';
import { RentExemptionApprove } from '../models/rent-exemption-approve';
import { RentExemptionRejection } from '../models/rent-exemption-dissaprove';

@Injectable({
  providedIn: 'root'
})
export class RentExemptionService {
  private readonly API = environment.api;
  private apiUrl = `${this.API}/api/v1`;

  constructor(private http: HttpClient) { }

  getRentExemptionByStatus(pagination: RentExemptionUserSearchRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/rentExemption/status`, pagination).pipe(
      map((response: any) => response)
    );
  }

  getRentExemptionRejectionById(id: number) {
    return this.http.get(`${this.apiUrl}/rentExemption/rejections/${id}`).pipe(
      map((response: any) => response)
    );
  }

  approveRentExemption(data: RentExemptionApprove): Observable<any> {
    return this.http.post(`${this.apiUrl}/rentExemption/approve`, data).pipe(
      map((response: any) => response)
    );
  }

  dissaproveRentExemption(data: RentExemptionRejection): Observable<any> {
    return this.http.post(`${this.apiUrl}/rentExemption/disapprove`, data).pipe(
      map((response: any) => response)
    );
  }

  getStatementReasons(): Observable<any> {
    return this.http.get(`${this.apiUrl}/statementReason`).pipe(
      map((response: any) => response)
    );
  }

}
