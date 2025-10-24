import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import type { IResponseData } from '@shared/interfaces/api-request';
import type { PartnerBonus, PartnerBonusAwardDetail } from '../interfaces/partner-bonus.interface';

@Injectable({
  providedIn: 'root'
})
export class PartnerBonusApiService {
  private readonly BASE = `${environment.URL_BONUS_API}/assignment`;

  constructor(private readonly client: HttpClient) {}

  public fetchGetById(id: number) {
    return this.client.get<IResponseData<PartnerBonus>>(`${this.BASE}/${id}`);
  }

  public fetchGetByFullName(fullName: string) {
    return this.client.get<IResponseData<PartnerBonus[]>>(`${this.BASE}/fullname/${fullName}`);
  }

  public fetchGetAwardDetailByFullName(fullName: string) {
    return this.client.get<IResponseData<PartnerBonusAwardDetail>>(`${this.BASE}/fullname/${fullName}/awarddetail`);
  }

  public fetchGetAll() {
    return this.client.get<IResponseData<PartnerBonus[]>>(`${this.BASE}/test`);
  }

  public fetchCreate(dto: PartnerBonus) {
    return this.client.post<IResponseData<PartnerBonus>>(`${this.BASE}`, dto);
  }

  public fetchUpdate(id: number, dto: Partial<PartnerBonus>) {
    return this.client.put<IResponseData<PartnerBonus>>(`${this.BASE}/${id}`, dto);
  }

  public fetchDelete(id: number) {
    return this.client.delete<IResponseData<void>>(`${this.BASE}/${id}`);
  }
}
