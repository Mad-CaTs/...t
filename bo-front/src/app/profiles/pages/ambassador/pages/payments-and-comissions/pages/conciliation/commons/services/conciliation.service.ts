import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, retry, throwError } from 'rxjs';
import { RejectedConciliationResponse } from '../interfaces/conciliation.interface';

@Injectable({
  providedIn: 'root'
})
export class ConciliationService {
  private url = '/api/v1';

  constructor(private http: HttpClient) { }

  getConciliationsByUserId(userId: number): Observable<any> {
    return this.http.get<any>(`${this.url}/conciliation/user/${userId}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
   getConciliationPendingByUserIdTransfer(userId: number): Observable<any> {
    return this.http.get<any>(`${this.url}/conciliation/status/${userId}`).pipe(
      retry(3),
      catchError((error) => {
        console.error('Error fetching conciliation status:', error);
        return throwError(() => error);
      })
    );
  } 

  getConciliationPendingByUserId(userId: number): Observable<any> {
    return this.http.get<any>(`${this.url}/conciliation/status/${userId}`).pipe(
      retry(3),
      map((response) => {
        return {
          ...response,
          data: false
        };
      }),
      catchError((error) => {
        console.error('Error fetching conciliation status:', error);
        return throwError(() => error);
      })
    );
  }

  getDetailForConciliationId(conciliationId: number) {
    return this.http.get<any>(`${this.url}/conciliation/detail/${conciliationId}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  getDataFromPdf(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.url}/pdf/conciliation/extractData`, formData).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  postDocumentForConciliation(form: FormData) {
    return this.http.post<any>(`${this.url}/conciliation/insertStatement`, form).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  getDocumentTypes() {
    return this.http.get<any>(`${this.url}/documentTypeInvoice`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  getRejectedByIdConciliation(idConciliation: number): Observable<RejectedConciliationResponse> {
    return this.http.get<RejectedConciliationResponse>(
      `${this.url}/conciliation/rejected/reason`,
      {
        params: {
          id_conciliation: idConciliation
        },
      }
    ).pipe(
      map((response: any) => response.data)
    );
  }
}
