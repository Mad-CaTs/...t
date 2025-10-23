import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ApiResponse } from "@app/entry/models/payments-validate.model";
import { ICarAssignmentData, ICarAssignmentResponse } from "@app/manage-prize/interface/car-assignment";
import { ICarBonusAmounts } from "@app/manage-prize/interface/car-bonus-amounts";
import { ICarBonusSearchParams } from "@app/manage-prize/interface/car-bonus-search-params";
import { CarModel } from "@app/manage-prize/models/bonus-type/bonus-car/create-car/car-model.model";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
const BASE_URL = environment.BonusApi;

@Injectable({ providedIn: 'root' })
export class CarAssignmentService {
  private endpoint = 'car-bonus/assignments/active/search';
  private endpointEx = 'car-bonus/assignments/active/export';
  private endpointUpdate = 'car-bonus/schedules/installments';
  private endpointCarModels = 'car-bonus/models';

  constructor(private http: HttpClient) {

  }

  searchCarAssignment(params: ICarBonusSearchParams): Observable<ICarAssignmentResponse> {
    let httpParams = new HttpParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        httpParams = httpParams.set(key, value.toString());
      }
    });

    const url = `${BASE_URL}/${this.endpoint}`;
    return this.http.get<ICarAssignmentResponse>(url, { params: httpParams });
  }

  update(carAssignmentId: string, data: ICarBonusAmounts): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(`${BASE_URL}/${this.endpointUpdate}/${carAssignmentId}`, data);
  }

  exportCarAssignments(): Observable<Blob> {
    const url = `${BASE_URL}/${this.endpointEx}`;
    return this.http.get(url, { responseType: 'blob' });
  }

  searchCarModels(): Observable<any> {
    const url = `${BASE_URL}/${this.endpointCarModels}`;
    return this.http.get<any>(url, {

    });
  }
}