import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericCrudService } from './generic-crud.service';
import { Event } from '../models/event.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CreateEventService extends GenericCrudService<Event> {
  protected override endpoint = 'events';

  constructor(protected override http: HttpClient) {
    super(http);
  }

  private isNil(v: unknown): v is null | undefined {
    return v === null || v === undefined;
  }
  private isFile(v: unknown): v is File {
    // Evita problemas en SSR: File podría no existir
    return typeof File !== 'undefined' && v instanceof File;
  }
  private isDate(v: unknown): v is Date {
    return v instanceof Date;
  }

  // Builder robusto: ignora ''/'null'/'undefined' como strings, castea números/booleans, y solo adjunta File reales
  private buildFormData(data: Partial<Event>): FormData {
    const fd = new FormData();

    // Fuerza a TS a tratar los entries como [string, unknown][]
    (Object.entries(data) as [string, unknown][])
      .forEach(([key, value]) => {
        if (this.isNil(value)) return;

        if (this.isFile(value)) {
          fd.append(key, value, value.name);
          return;
        }

        if (this.isDate(value)) {
          fd.append(key, value.toISOString());
          return;
        }

        switch (typeof value) {
          case 'string': {
            const s = value.trim();
            if (!s) return;
            const lower = s.toLowerCase();
            if (lower === 'null' || lower === 'undefined') return;
            fd.append(key, s);
            return;
          }
          case 'number': {
            if (!Number.isFinite(value)) return;
            fd.append(key, String(value));
            return;
          }
          case 'boolean': {
            fd.append(key, value ? 'true' : 'false');
            return;
          }
          // Objetos/arrays no soportados: ignóralos a menos que los serialices explícitamente
          default:
            return;
        }
      });

    return fd;
  }

  override create(data: Partial<Event>): Observable<Event> {
    const formData = this.buildFormData(data);
    return this.http.post<Event>(this.baseUrl, formData);
  }

  updateFormData(id: number, data: Partial<Event>): Observable<Event> {
    const formData = this.buildFormData(data);
    return this.http.put<Event>(`${this.baseUrl}/${id}`, formData);
  }

  exportByStatus(
    status: 'past' | 'canceled' | 'active' | 'ongoing' | 'inactive'
  ): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${status}/export`, {
      responseType: 'blob',
    });
  }
}
