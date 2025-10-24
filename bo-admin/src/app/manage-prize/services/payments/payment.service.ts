import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from '@shared/services/location.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.dev';
import { 
  PagedData,
  PaymentListView, 
  PaymentSearchParams, 
  RejectPaymentRequest } from '@app/manage-prize/models/payments/payment.model';

const BASE_URL = `${environment.BonusApi}/car-bonus/payments`;

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private endpointList = 'details';
  private endpointExport = 'details/export';
  private endpointApprove = 'approve';
    private endpointReject = 'reject';
  private endpointCorrect = 'correct';
  constructor(private http: HttpClient) {}

  createPayment(paymentData: FormData): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(BASE_URL, paymentData);
  }
  approvePayment(paymentId: string): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${BASE_URL}/${paymentId}/${this.endpointApprove}`, {});
  }
  rejectPayment(paymentId: string, request: RejectPaymentRequest): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${BASE_URL}/${paymentId}/${this.endpointReject}`, request);
  }
  correctRejectedPayment(
    paymentId: string, 
    voucherFile: File, 
    operationNumber: string, 
    note: string
  ): Observable<ApiResponse<any>> {
    const formData = new FormData();
    formData.append('voucherFile', voucherFile);
    formData.append('operationNumber', operationNumber);
    formData.append('note', note);

    return this.http.put<ApiResponse<any>>(
      `${BASE_URL}/${paymentId}/${this.endpointCorrect}`, 
      formData
    );
  }

  getPendingPayments(params: PaymentSearchParams): Observable<ApiResponse<PagedData<PaymentListView>>> {
    let httpParams = new HttpParams();
    
    if (params.member) {
      httpParams = httpParams.set('member', params.member);
    }
    if (params.bonusType !== undefined && params.bonusType !== null) {
      httpParams = httpParams.set('bonusType', params.bonusType.toString());
    }
    if (params.paymentDate) {
      httpParams = httpParams.set('paymentDate', params.paymentDate);
    }
    
    if (params.page !== undefined) {
      httpParams = httpParams.set('page', params.page.toString());
    }
    if (params.size !== undefined) {
      httpParams = httpParams.set('size', params.size.toString());
    }
    if (params.sortBy) {
      httpParams = httpParams.set('sortBy', params.sortBy);
    }
    if (params.asc !== undefined) {
      httpParams = httpParams.set('asc', params.asc.toString());
    }

    return this.http.get<ApiResponse<PagedData<PaymentListView>>>(
      `${BASE_URL}/${this.endpointList}`, 
      { params: httpParams }
    );
  }
  exportPendingPayments(params: PaymentSearchParams): Observable<Blob> {
    let httpParams = new HttpParams();
    
    if (params.member) {
      httpParams = httpParams.set('member', params.member);
    }
    if (params.bonusType !== undefined && params.bonusType !== null) {
      httpParams = httpParams.set('bonusType', params.bonusType.toString());
    }
    if (params.paymentDate) {
      httpParams = httpParams.set('paymentDate', params.paymentDate);
    }

    return this.http.get(`${BASE_URL}/${this.endpointExport}`, { 
      params: httpParams,
      responseType: 'blob'
    });
  }
}




