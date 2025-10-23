import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CarModel } from "@app/manage-prize/models/bonus-type/bonus-car/create-car/car-model.model";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
const BASE_URL = environment.BonusApi;

@Injectable({ providedIn: 'root' })
export class UtilService {
  private endpointCarModels = 'car-bonus/models';

  constructor(private http: HttpClient) {

  }

  searchCarModels(): Observable<any> {
    const url = `${BASE_URL}/${this.endpointCarModels}`;
    return this.http.get<any>(url, {});
  }
}