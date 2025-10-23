import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericCrudService } from './generic-crud.service';
import { EntryType } from '../models/entry-type.model';

@Injectable({ providedIn: 'root' })
export class EntryTypeService extends GenericCrudService<EntryType> {
  protected override endpoint = 'tickettypes';

  constructor(protected override http: HttpClient) {
    super(http);
  }
}
