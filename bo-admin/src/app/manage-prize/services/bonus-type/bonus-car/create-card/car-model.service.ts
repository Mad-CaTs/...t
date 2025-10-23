import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { GenericCrudService } from '../../generic-crud.service';
import { CarModel } from '@app/manage-prize/models/bonus-type/bonus-car/create-car/car-model.model';

@Injectable({ providedIn: 'root' })
export class CarModelService extends GenericCrudService<CarModel> {
  protected override endpoint = 'car-bonus/models';

  constructor(protected override http: HttpClient) {
    super(http);
  }

  search(brandId: number, name: string): Observable<CarModel[]> {
    return this.http.get<CarModel[]>(`${this.baseUrl}/search`, {
      params: { brandId, name }
    });
  }
}
