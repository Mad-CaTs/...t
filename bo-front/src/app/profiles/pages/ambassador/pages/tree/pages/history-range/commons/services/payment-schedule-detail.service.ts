import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import type { IResponseData } from '@shared/interfaces/api-request';
import type { PaymentScheduleDetail } from '../interfaces/payment-schedule-detail.interface';

@Injectable({
  providedIn: 'root'
})
export class PaymentScheduleDetailApiService {
  private readonly BASE = `${environment.URL_BONUS_API}/scheduledetail`;

  constructor(private readonly client: HttpClient) {}

  public fetchGetById(id: number) {
    return this.client.get<IResponseData<PaymentScheduleDetail>>(`${this.BASE}/${id}`);
  }

  public fetchGetByPaymentScheduleId(paymentScheduleId: number) {
    return this.client.get<IResponseData<PaymentScheduleDetail[]>>(`${this.BASE}/payment-schedule/${paymentScheduleId}`);
  }

  public fetchGetAll() {
    return this.client.get<IResponseData<PaymentScheduleDetail[]>>(`${this.BASE}/test`);
  }

  public fetchCreate(dto: PaymentScheduleDetail) {
    return this.client.post<IResponseData<PaymentScheduleDetail>>(`${this.BASE}`, dto);
  }

  public fetchUpdate(id: number, dto: Partial<PaymentScheduleDetail>) {
    return this.client.put<IResponseData<PaymentScheduleDetail>>(`${this.BASE}/${id}`, dto);
  }

  public fetchDelete(id: number) {
    return this.client.delete<IResponseData<void>>(`${this.BASE}/${id}`);
  }
}
