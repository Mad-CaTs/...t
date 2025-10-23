// src/app/event/services/event-zone.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { GenericCrudService } from './generic-crud.service';
import {
  EventZone,
  EventZoneDetail,
  EventZoneCreatePayload,
  EventZoneUpdatePayload,
} from '../models/event-zone.model';

@Injectable({ providedIn: 'root' })
export class EventZoneService extends GenericCrudService<EventZone> {
  protected override endpoint = 'event-zones';

  constructor(protected override http: HttpClient) {
    super(http);
  }
  createEventZones(
    eventId: number,
    ticketTypeId: number,
    zones: EventZoneDetail[]
  ): Observable<EventZone> {
    const payload: EventZoneCreatePayload = { eventId, ticketTypeId, zones };
    return this.http.post<EventZone>(this.baseUrl, payload);
  }
  override getById(eventId: number): Observable<EventZone> {
    return this.http.get<EventZone>(`${this.baseUrl}/event/${eventId}`);
  }
  updateByEventId(
    eventId: number,
    payload: EventZoneUpdatePayload
  ): Observable<EventZone> {
    return this.http.put<EventZone>(`${this.baseUrl}/${eventId}`, payload);
  }
}
