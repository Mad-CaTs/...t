import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
const BASE_URL = environment.URL_API_TicketApi;
@Injectable({
  providedIn: 'root'
})
export class NominationService {
  private apiUrl = BASE_URL + '/api/v1/ticket';

  constructor(private http: HttpClient) {}

  getPurchases(page: number, size: number, userId: number): Observable<any> {
    const url = `${this.apiUrl}/status`;
    const body = {
      userId,
      pagination: {
        page,
        size,
        sortBy: 'created_at',
        asc: false
      }
    };
    return this.http.post<any>(url, body);
  }

  getNominationsStatus(page: number, size: number, userId: number): Observable<any> {
    const url = `${this.apiUrl}/nomination/status`;
    const body = {
      userId,
      pagination: {
        page,
        size,
        sortBy: 'created_at',
        asc: false
      }
    };
    return this.http.post<any>(url, body);
  }

    getNominations(request: NominationBatchRequest): Observable<any> {
    const url = `${this.apiUrl}/nomination`;
    return this.http.post<any>(url, request);
  }
}

export type NominationBatchRequest = {
  paymentId: number;
  nomineeRequests: NomineeRequest[];

}

export type NomineeRequest = {
  ticketUuid: string;        
  documentTypeId: number;
  documentNumber: string;
  email: string;
  name: string;
  lastName: string;
  eventId?: number;
};