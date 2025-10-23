import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericCrudService } from './generic-crud.service';
import { SeatType} from '../models/seat-type.module';

@Injectable({ providedIn: 'root' })
export class SeatTypeService extends GenericCrudService<SeatType> {
  
  protected override endpoint = 'seattypes';

  constructor(protected override http: HttpClient) {
    super(http);
  }
}
