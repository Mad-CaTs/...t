import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '@app/auth';
import { asapScheduler, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { BankStatus, solicituRetiro, solicituRetiroMasivo } from '../model/solicitudRetiro';
import { deepStrictEqual } from 'assert';
import { ascending } from 'ol/array';

@Injectable({
  providedIn: 'root'
})
export class RetirosService {
  //  private readonly apiWallet = 'https://walletapi-dev.inclub.world' + "/api/v1";
  private readonly apiWallet = environment.apiWallet + "/api/v1";

  constructor(private httpClient: HttpClient) { }

  getListPendingBacancario(
    page: number,
    size: number,
    search: string,
    status?: string,
    currency?: string,
    reviewStatus?: string,
    date?: string,
    bankId?: number,
    periodIds?: number[],
    bankStatusId?: number[]
  ): Observable<any> {
    const requestBody: any = {
      searchText: search || "",
      fechaRegistro: date || "",
      periodIds: periodIds || [],
      bankStatusIds: bankStatusId,
      currencyIdBank: [],
      reviewStatusId: [],
      idBank: bankId || 1
    };

    if (status && status !== '' && status !== '-1') {
      requestBody.bankStatusIds = [parseInt(status)];
    }

    if (currency && currency !== '' && currency !== '-1') {
      requestBody.currencyIdBank = [parseInt(currency)];
    }

    if (reviewStatus && reviewStatus !== '' && reviewStatus !== '-1') {
      requestBody.reviewStatusId = [parseInt(reviewStatus)];
    }

    if (periodIds && periodIds.length > 0) {
      requestBody.periodIds = periodIds;
    }

    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.httpClient.post<any>(`${this.apiWallet}/solicitudebank/listPen`, requestBody, { params }).pipe(
      map((response: any) => {
        return response;
      }),
      catchError(error => {
        console.error('Error en getListPendingBacancario:', error);
        return throwError(error);
      })
    );
  }

  getListVerificadoBacancario(
    page: number,
    size: number,
    search: string,
    status?: string,
    currency?: string,
    reviewStatus?: string,
    date?: string
  ): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (search) {
      params = params.set('search', search);
    }

    if (status && status !== '' && status !== '-1') {
      params = params.set('status', status);
    }

    if (currency && currency !== '' && currency !== '-1') {
      params = params.set('currency', currency);
    }

    if (reviewStatus && reviewStatus !== '' && reviewStatus !== '-1') {
      params = params.set('reviewStatus', reviewStatus);
    }

    if (date && date !== '') {
      params = params.set('date', date);
    }

    return this.httpClient.get<any>(`${this.apiWallet}/solicitudebank/listVerif`, { params }).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  updateAprobado(obj: solicituRetiro) {
    return this.httpClient.put<any>(`${this.apiWallet}/solicitudebank/update`, obj)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  gestListReazon(): Observable<any> {
    return this.httpClient.get<any>(`${this.apiWallet}/reasonbank/list`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  getBankReviewStatus() {
    return this.httpClient.get<any>(`${this.apiWallet}/bank-status/reviews`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  getBankStatus() {
    return this.httpClient.get<BankStatus[]>(`${this.apiWallet}/bank-status`).pipe(
      map((response: any) => {
        return response
      })
    )
  }

  onViewDetail(id: number, username: string | undefined) {
    let params = new HttpParams()
    if (username) {
      params = params.set('username', username);
    }

    return this.httpClient.put<void>(`${this.apiWallet}/bank-status/reviews/${id}`, {}, { params })
  }

  preValidateWithdrawals(username: string | undefined) {
    let params = new HttpParams()
    if (username) {
      params = params.set('username', username);
    }
    return this.httpClient.post<void>(`${this.apiWallet}/validate/validateAllBCP`, {}, { params })
  }

  downloadExcel(username: string | undefined): Observable<Blob> {
    let params = new HttpParams();

    if (username) {
      params = params.set('username', username);
    }

    return this.httpClient.get(
      `${this.apiWallet}/validate/download-excel`,
      {
        responseType: 'blob',
        params: params
      }
    ).pipe(
      catchError(error => {
        console.error('Error al descargar Excel:', error);
        return throwError(() => error);
      })
    );
  }

  downloadTxt(username: string | undefined): Observable<Blob> {
    let params = new HttpParams();

    if (username) {
      params = params.set('username', username);
    }

    return this.httpClient.get(
      `${this.apiWallet}/validate/download-txt`,
      {
        responseType: 'blob',
        params: params
      }
    ).pipe(
      catchError(error => {
        console.error('Error al descargar TXT:', error);
        return throwError(() => error);
      })
    );
  }

  updateBankWithdrawalNotificationByUser(username: string | undefined, obj: solicituRetiro) {
    let params = new HttpParams()

    if (username) {
      params = params.set('username', username);
    }
    return this.httpClient.put<solicituRetiro>(`${this.apiWallet}/solicitudebank/update`, obj, { params })
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  updateBankWithdrawalNotificationAll(username: string | undefined, obj: solicituRetiroMasivo) {
    let params = new HttpParams()

    if (username) {
      params = params.set('username', username);
    }
    return this.httpClient.put<any>(`${this.apiWallet}/solicitudebank/update-masivo`, obj, { params })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  getModificationAudit(
    page: number,
    size: number = 10,
    type?: number,
    periodIds?: number[],
    createDate: string = "",
    search: string = "",
    actionId?: number,
  ): Observable<any> {

    const requestBody = {
      page: page,
      size: size,
      search: search,
      type: type || 1,
      createDate: createDate,
      periodId: periodIds || [],
      actionId: actionId
    };

    if (createDate && createDate !== "") {
      requestBody.createDate = createDate;
    }

    if (periodIds && periodIds.length > 0) {
      requestBody.periodId = periodIds;
    }

    return this.httpClient.post(`${this.apiWallet}/auditlog/audit-logs/search`, requestBody).pipe(
      map((response: any) => {
        return response;
      }),
      catchError(error => {
        console.error('Error en getModificationAudit:', error);
        return throwError(() => error);
      })
    );
  }

  uploadExcelOfBcp(file: File, username: string | undefined): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    let params = new HttpParams();
    if (username) {
      params = params.set('username', username);
    }

    return this.httpClient.post(`${this.apiWallet}/validate/uploadBCP`, formData, { params }).pipe(
      map((response: any) => response),
      catchError(error => {
        console.error('Error al subir archivo:', error);
        return throwError(() => error);
      })
    );
  }

  rejectedWithdrawal(requestBody: any, username: string | undefined) {
    let params = new HttpParams()

    if (username) {
      params = params.set('username', username);
    }

    return this.httpClient.put<any>(`${this.apiWallet}/solicitudebank/update`, requestBody, { params })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }
}
