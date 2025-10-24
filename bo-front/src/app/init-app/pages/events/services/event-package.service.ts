import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { GenericCrudService } from './generic-crud.service';
import {
  EventPackage,
  GroupedResponse,
  CreateUpdatePackagePayload,
  GroupedPackage,
} from '../models/event-package.model';

@Injectable({ providedIn: 'root' })
export class EventPackageService extends GenericCrudService<EventPackage> {
  protected override endpoint = 'api/v1/ticket-packages';

  constructor(protected override http: HttpClient) {
    super(http);
  }

  getGrouped(page: number, size: number): Observable<GroupedResponse> {
    const params = new HttpParams().set('page', String(page)).set('size', String(size));
    return this.http.get<GroupedResponse>(`${this.baseUrl}/grouped`, { params });
  }

  getDetail(id: number): Observable<GroupedPackage> {
    return this.http.get<GroupedPackage>(`${this.baseUrl}/detailpackage/${id}`);
  }

  createPackage(payload: CreateUpdatePackagePayload): Observable<EventPackage> {
    return this.http.post<EventPackage>(`${this.baseUrl}/create`, payload);
  }

  updatePackage(id: number, payload: CreateUpdatePackagePayload): Observable<EventPackage> {
    // return this.http.put<EventPackage>(`${this.baseUrl}/update/${id}`, payload);
    return this.http.put<EventPackage>(`${this.baseUrl}/${id}`, payload);
  }

  override delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/detailpackage/${id}`);
  }
}
