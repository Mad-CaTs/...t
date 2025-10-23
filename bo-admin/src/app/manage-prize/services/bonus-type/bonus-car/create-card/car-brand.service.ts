import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { GenericCrudService } from '../../generic-crud.service';
import { CarBrand } from '@app/manage-prize/models/bonus-type/bonus-car/create-car/car-brand.model';

@Injectable({ providedIn: 'root' })
export class CarBrandService extends GenericCrudService<CarBrand> {
  protected override endpoint = 'car-bonus/brands';

  constructor(protected override http: HttpClient) {
    super(http);
  }

  searchByName(name: string): Observable<CarBrand[]> {
    return this.http.get<CarBrand[]>(`${this.baseUrl}/search`, {
      params: { name }
    });
  }
}
