import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StatementValidateRequest } from '@app/conciliations/models/conciliation-validation';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConciliationService {
  private readonly API = environment.api;
  private apiUrl = `${this.API}/api/`;

  constructor(private http: HttpClient) { }

  getConciliationsForValidation(page: number, size: number): Observable<any> {
    return this.http.get(`${this.apiUrl}finance/getAdminConciliationResponse?page=${page}&size=${size}`).pipe(
      map((response: any) => response)
    );
  }

  getConciliationsValidated(page: number, size: number): Observable<any> {
    return this.http.get(`${this.apiUrl}finance/getAdminConciliationResponse/no-pending?page=${page}&size=${size}`).pipe(
      map((response: any) => response)
    );
  }

  getConciliationsDetailsForValidation(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}finance/getStatementDetailById/${id}`).pipe(
      map((response: any) => response)
    );
  }

  getStatementReasons(): Observable<any> {
    return this.http.get(`${this.apiUrl}v1/statementReason`).pipe(
      map((response: any) => response)
    );
  }

  getDocumentTypes() {
    return this.http.get<any>(`${this.apiUrl}finance/documentTypeInvoice`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  validateStatement(validation: StatementValidateRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}finance/validate-statement`, validation).pipe(
      map((response: any) => response)
    );
  }

}
