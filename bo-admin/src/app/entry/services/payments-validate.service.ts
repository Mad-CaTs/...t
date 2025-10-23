
import { Injectable } from "@angular/core";
import { GenericCrudService } from "./generic-crud.service";
import { ApiResponse, PaymentPage, PaymentsValidate } from "../models/payments-validate.model";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { PaymentRejectionReason } from "../models/payment-rejection-reasons.model";
import { map } from 'rxjs/operators';
import { RejectPaymentPayload } from "../models/reject-payment-payload.model";

@Injectable({ providedIn: 'root' })
export class PaymentsValidateService extends GenericCrudService<PaymentsValidate> {

  protected override endpoint = 'api/v1/ticket/payments';

  constructor(protected override http: HttpClient) { super(http); }

  validatePayments(page: number, size: number = 10): Observable<ApiResponse<PaymentPage>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<ApiResponse<PaymentPage>>(
      `${this.baseUrl}/validate`,
      { params }
    );
  }

  acceptPayments(id: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}/approve`, {});
  }

  getAllSelected(): Observable<PaymentRejectionReason[]> {
    return this.http
      .get<{ result: boolean; data: PaymentRejectionReason[] }>(
        `${this.baseUrl}/payment-rejection-reasons`
      )
      .pipe(map(res => res.data ?? []));
  }

  denyPayments(id: number, payload: { reasonId: number; detail: string }) {
    return this.http.put<void>(`${this.baseUrl}/${id}/reject`, payload);
  }

  rejectPayment(id: number, body: RejectPaymentPayload): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}/reject`, body);
  }

}

