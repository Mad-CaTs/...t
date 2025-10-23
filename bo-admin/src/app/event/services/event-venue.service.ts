import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericCrudService } from './generic-crud.service';
import { EventVenue } from '../models/event-venue.model';

@Injectable({ providedIn: 'root' })
export class EventVenueService extends GenericCrudService<EventVenue> {
  protected override endpoint = 'eventvenues';

  constructor(protected override http: HttpClient) {
    super(http);
  }
}
