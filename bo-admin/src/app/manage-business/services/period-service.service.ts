import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class PeriodService {
  private readonly API = environment.api;
  private readonly apireports = environment.apireports;

  
  private apiUrl = `${this.API}/api/`;

  constructor(private httpClient: HttpClient) { }

  getPeriodIdByDate(date: string): Observable<any> {
    return this.httpClient.get<any>(`${this.apiUrl}period/rangeBetween/${date}`);
  }

  getPeriods(page: number, size: number): Observable<any> {
    return this.httpClient.get<any>(`${this.apiUrl}period?page=${page}&size=${size}`).pipe(
      map(response => response),
      catchError((error: any) => {
        return throwError(error);
      })
    );
  }

  getFechaPeriods(): Observable<any> {
    return this.httpClient.get<any>(`${this.apiUrl}period/all/past`).pipe(
      map(response => response),
      catchError((error: any) => {
        return throwError(error);
      })
    );
  }

  

  deactivatePeriod(id: number, username: string): Observable<any> {
    return this.httpClient.get<any>(`${this.apiUrl}period/deactivate/${id}/user/${username}`).pipe(
      map(response => response),
      catchError((error: any) => {
        return throwError(error);
      })
    );
  }

  updatePeriod(data: any, username: string): Observable<any> {
    return this.httpClient.put<any>(`${this.apiUrl}period/update/user/${username}`, data).pipe(
      map(response => response),
      catchError((error: any) => {
        return throwError(error);
      })
    );
  }

  exportCompoundData(periodId: number): Observable<Blob> {
    const url = `${this.apireports}/api/v1/reports/new-range/compound/download?periodId=${periodId}`;
    return this.httpClient.get(url, { responseType: 'blob' });
  }

  exportResidualData(periodId: number): Observable<Blob> {
    const url = `${this.apireports}/api/v1/reports/new-range/residual/download?periodId=${periodId}`;
    return this.httpClient.get(url, { responseType: 'blob' });
  }


  exportHistoricCompoundData(periodId: number): Observable<Blob> {
  const url = `${this.apireports}/api/v1/reports/compound/download?periodId=${periodId}`;
  return this.httpClient.get(url, { responseType: 'blob' });
}

exportHistoricResidualData(periodId: number): Observable<Blob> {
  const url = `${this.apireports}/api/v1/reports/residual/download?periodId=${periodId}`;
  return this.httpClient.get(url, { responseType: 'blob' });
}

getCompuestoData(id: number): Observable<any> {
  return this.httpClient.get<any>(`${this.apireports}/api/v1/reports/new-range/compound/list?periodId=${id}`).pipe(
    map(response => response),
    catchError((error: any) => {
      return throwError(error);
      
    })
  );
}

getResidualData(id: number): Observable<any> {
  return this.httpClient.get<any>(`${this.apireports}/api/v1/reports/new-range/residual/list?periodId=${id}`).pipe(
    map(response => response),
    catchError((error: any) => {
      return throwError(error);
    })
  );
}

getHistoricoCompuestoData(id: number): Observable<any> {
  return this.httpClient.get<any>(`${this.apireports}/api/v1/reports/compound/list?periodId=${id}`).pipe(
    map(response => response),
    catchError((error: any) => {
      return throwError(error);
      
    })
  );
}

getHistoricoResidualData(id: number): Observable<any> {
  return this.httpClient.get<any>(`${this.apireports}/api/v1/reports/residual/list?periodId=${id}`).pipe(
    map(response => response),
    catchError((error: any) => {
      return throwError(error);
    })
  );
}


}
