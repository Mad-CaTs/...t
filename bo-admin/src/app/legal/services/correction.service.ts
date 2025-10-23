import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface CorrectionRequest {
  id: string;
  userId: number;
  username: string;
  partnerName: string;
  portfolio: string;
  documentType: string;
  documentNumber: string;
  requestMessage: string;
  requestDate: string;
  status: string;
  statusHistory: {
    id: string;
    status: string;
    message: string;
    date: string;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class CorrectionService {
  private apiUrl = `${environment.apiUrl}/legal/correction-requests`;

  constructor(private http: HttpClient) {}

  getCorrectionRequests(params: any): Observable<CorrectionRequest[]> {
    return this.http.get<CorrectionRequest[]>(this.apiUrl, { params });
  }

  getCorrectionRequestById(id: string): Observable<CorrectionRequest> {
    return this.http.get<CorrectionRequest>(`${this.apiUrl}/${id}`);
  }

  updateCorrectionStatus(id: string, status: string, message: string): Observable<CorrectionRequest> {
    return this.http.patch<CorrectionRequest>(`${this.apiUrl}/${id}/status`, { status, message });
  }
} 