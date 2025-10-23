import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ApiResponse } from "@app/entry/models/payments-validate.model";
import { ICarBonusResponse } from "@app/manage-prize/interface/bonus-history";
import { IBonusHistorySearchParams } from "@app/manage-prize/interface/bonus-history-search-params";
import { ICarAssignmentData, ICarAssignmentResponse } from "@app/manage-prize/interface/car-assignment";
import { ICarBonusAmounts } from "@app/manage-prize/interface/car-bonus-amounts";
import { ICarBonusSearchParams } from "@app/manage-prize/interface/car-bonus-search-params";
import { IRankBonus } from "@app/manage-prize/interface/rank-bonus";
import { RangeResponse } from "@app/manage-prize/pages/interface/ranges-response";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
const BASE_URL = environment.BonusApi;

@Injectable({ providedIn: 'root' })
export class BonusHistoryService {
  private endpoint = 'car-bonus/rank-bonuses/details/search';
  private endpointEx = 'car-bonus/assignments/active/export';
  private endpointUpdate = 'car-bonus/rank-bonuses';
  private endpointRanges = 'three/ranges/active';

  constructor(private http: HttpClient) {

  }

  searchBonusHistory(params: IBonusHistorySearchParams): Observable<ICarBonusResponse> {
    let httpParams = new HttpParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        httpParams = httpParams.set(key, value.toString());
      }
    });

    const url = `${BASE_URL}/${this.endpoint}`;
    return this.http.get<ICarBonusResponse>(url, { params: httpParams });
  }

  update(carAssignmentId: string, data: IRankBonus): Observable<ApiResponse<string>> {
    return this.http.put<ApiResponse<string>>(`${BASE_URL}/${this.endpointUpdate}/${carAssignmentId}`, data);
  }

  save(data: IRankBonus): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(`${BASE_URL}/${this.endpointUpdate}`, data);
  }

    delete(id: string): Observable<ApiResponse<string>> {
    return this.http.delete<ApiResponse<string>>(`${BASE_URL}/${this.endpointUpdate}/${id}`);
  }


  getRanges(): Observable<RangeResponse> {
    const url = `https://treepointrangeapi-dev.inclub.world/api/v1/${this.endpointRanges}`;
    return this.http.get<RangeResponse>(url);
  }

  exportBonusHistory(): Observable<Blob> {
    const url = `${BASE_URL}/${this.endpointEx}`;
    return this.http.get(url, { responseType: 'blob' });
  }
}