import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericCrudService } from './generic-crud.service';
import { EventType } from '../models/event-type.model';

@Injectable({ providedIn: 'root' })
export class EventTypeService extends GenericCrudService<EventType> {
  protected override endpoint = 'eventtypes';

  constructor(protected override http: HttpClient) {
    super(http);
  }
}
