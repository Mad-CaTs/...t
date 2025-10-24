import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericCrudService } from './generic-crud.service';
import { PublicBasicEvent } from '../models/public-basic-event.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PublicBasicEventService extends GenericCrudService<PublicBasicEvent> {
  protected override endpoint = 'events/public';

  constructor(protected override http: HttpClient) {
    super(http);
  }

  override getAll(): Observable<PublicBasicEvent[]> {
    return this.http.get<PublicBasicEvent[]>(this.baseUrl);
  }

  override getById(id: number): Observable<PublicBasicEvent> {
    return this.http.get<PublicBasicEvent>(`${this.baseUrl}/${id}`);
  }
}
