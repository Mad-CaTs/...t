import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import type { IResponseData } from '@shared/interfaces/api-request';
import type { PaymentSchedule } from '../interfaces/payment-schedule.interface';

@Injectable({
  providedIn: 'root'
})
export class PaymentScheduleApiService {
  private readonly BASE = `${environment.URL_BONUS_API}/schedule`;

  constructor(private readonly client: HttpClient) {}

  public fetchGetById(id: number) {
    return this.client.get<IResponseData<PaymentSchedule>>(`${this.BASE}/${id}`);
  }

  public fetchGetByPartnerBonusId(partnerBonusId: number) {
    return this.client.get<IResponseData<PaymentSchedule[]>>(`${this.BASE}/partner-bonus/${partnerBonusId}`);
  }

  public fetchGetAll() {
    return this.client.get<IResponseData<PaymentSchedule[]>>(`${this.BASE}/test`);
  }

  public fetchCreate(dto: PaymentSchedule) {
    return this.client.post<IResponseData<PaymentSchedule>>(`${this.BASE}`, dto);
  }

  public fetchUpdate(id: number, dto: Partial<PaymentSchedule>) {
    const formData = new FormData();

    // Append all fields from dto to FormData
    if (dto.date) formData.append('date', dto.date);
    if (dto.description) formData.append('description', dto.description);
    if (dto.status) formData.append('status', dto.status);
    if (dto.netFinancingInstallmentValue) formData.append('netFinancingInstallmentValue', dto.netFinancingInstallmentValue.toString());
    if (dto.insurance) formData.append('insurance', dto.insurance.toString());
    if (dto.fractionatedInitial) formData.append('fractionatedInitial', dto.fractionatedInitial.toString());
    if (dto.companyInitial) formData.append('companyInitial', dto.companyInitial.toString());
    if (dto.gps) formData.append('gps', dto.gps.toString());
    if (dto.rangeBonus) formData.append('rangeBonus', dto.rangeBonus.toString());
    if (dto.partnerAssumedPayment) formData.append('partnerAssumedPayment', dto.partnerAssumedPayment.toString());
    if (dto.paymentVoucher instanceof File) {
      formData.append('paymentVoucher', dto.paymentVoucher, dto.paymentVoucher.name);
    } else if (typeof dto.paymentVoucher === 'string' && dto.paymentVoucher) {
      formData.append('paymentVoucher', dto.paymentVoucher);
    }

    return this.client.put<IResponseData<PaymentSchedule>>(`${this.BASE}/${id}`, formData);
  }

  public fetchDelete(id: number) {
    return this.client.delete<IResponseData<void>>(`${this.BASE}/${id}`);
  }
}
