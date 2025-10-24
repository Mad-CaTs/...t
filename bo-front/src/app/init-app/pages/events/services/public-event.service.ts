import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericCrudService } from './generic-crud.service';
import { PublicEvent } from '../models/public-event.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PublicEventService extends GenericCrudService<PublicEvent> {
  protected override endpoint = 'events/public/zones';

  constructor(protected override http: HttpClient) {
    super(http);
  }

  override getAll(): Observable<PublicEvent[]> {
    return this.http.get<PublicEvent[]>(this.baseUrl);
  }

  override getById(id: number): Observable<PublicEvent> {
    return this.http.get<PublicEvent>(`${this.baseUrl}/${id}`);
  }
}
