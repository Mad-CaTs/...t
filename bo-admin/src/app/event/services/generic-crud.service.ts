import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
const BASE_URL = environment.TicketApi;

@Injectable()
export abstract class GenericCrudService<T> {

  protected abstract endpoint: string;
  
  constructor(protected http: HttpClient) {}

  protected get baseUrl(): string {
    return `${BASE_URL}/${this.endpoint}`;
  }

  getAll(): Observable<T[]> {
    return this.http.get<T[]>(this.baseUrl);
  }
  getById(id: number): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${id}`);
  }
  create(data: Partial<T>): Observable<T> {
    return this.http.post<T>(this.baseUrl, data);
  }
  update(id: number, data: Partial<T>): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${id}`, data);
  }
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
