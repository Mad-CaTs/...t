//src/app/event/services/event-history.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericCrudService } from './generic-crud.service';
import { EventHistory } from '../models/event-history.model';

@Injectable({ providedIn: 'root' })
export class EventHistoryService extends GenericCrudService<EventHistory> {
  protected override endpoint = 'events/past';

  constructor(protected override http: HttpClient) {
    super(http);
  }
  updateWithMedia(
    id: number,
    payload: {
      description: string;
      imageFile?: File;
      secondImageFile?: File;
      videoUrl?: string;
    }
  ) {
    const form = new FormData();
    form.append('description', payload.description ?? '');
    form.append('imageFile', payload.imageFile ?? new Blob(), payload.imageFile?.name ?? '');
    form.append('secondImageFile', payload.secondImageFile ?? new Blob(), payload.secondImageFile?.name ?? '');
    form.append('videoUrl', payload.videoUrl ?? '');
    return this.http.put<EventHistory>(`${this.baseUrl}/${id}`, form);
  }
}
