import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.dev';
import { IPaymentSearchParams, IRejectPaymentRequest, IRejectPaymentResponse } from '@app/manage-prize/interface/payment-request';
import { IPaymentListViewResponse } from '@app/manage-prize/interface/payment-list-view';

const BASE_URL = `${environment.BonusApi}/car-bonus/payments`;

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private endpointList = 'details';
  private endpointExport = 'details/export';
  private endpointApprove = 'approve';
    private endpointReject = 'reject';
  private endpointCorrect = 'correct';
  constructor(private http: HttpClient) {}

  getPendingPayments(params: IPaymentSearchParams): Observable<IPaymentListViewResponse> {
    let httpParams = new HttpParams();
    
    if (params.member) {
      httpParams = httpParams.set('member', params.member);
    }
    if (params.bonusType) {
      httpParams = httpParams.set('bonusType', params.bonusType);
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

    return this.http.get<IPaymentListViewResponse>(`${BASE_URL}/${this.endpointList}`, 
      { params: httpParams });
  }

  exportPendingPayments(params: IPaymentSearchParams): Observable<Blob> {
    let httpParams = new HttpParams();
    
    if (params.member) {
      httpParams = httpParams.set('member', params.member);
    }
    if (params.bonusType) {
      httpParams = httpParams.set('bonusType', params.bonusType);
    }
    if (params.paymentDate) {
      httpParams = httpParams.set('paymentDate', params.paymentDate);
    }

    return this.http.get(`${BASE_URL}/${this.endpointExport}`, { 
      params: httpParams,
      responseType: 'blob'
    });
  }

  approvePayment(paymentId: string): Observable<IRejectPaymentResponse> {
    return this.http.put<IRejectPaymentResponse>(`${BASE_URL}/${paymentId}/${this.endpointApprove}`, {});
  }

  rejectPayment(paymentId: string, request: IRejectPaymentRequest): Observable<IRejectPaymentResponse> {
    return this.http.put<IRejectPaymentResponse>(`${BASE_URL}/${paymentId}/${this.endpointReject}`, request);
  }

  correctRejectedPayment(
    paymentId: string, 
    formData: FormData
  ): Observable<IRejectPaymentResponse> {
    return this.http.put<IRejectPaymentResponse>(
      `${BASE_URL}/${paymentId}/${this.endpointCorrect}`, 
      formData
    );
  }
}





