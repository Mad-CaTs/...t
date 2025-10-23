import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TicketReport } from '../models/ticket-report.model';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class TicketReportService {
  private baseUrl = environment.TicketApi;

  constructor(private http: HttpClient) {}

  getReport(eventId: number): Observable<{ result: boolean; data: TicketReport[] }> {
    return this.http.get<{ result: boolean; data: TicketReport[] }>(
      `${this.baseUrl}/events/${eventId}/tickets/report`
    );
  }

  getReportV2(eventId: number, filters?: {
    canjeado?: string;
    zona?: string;
    tipoComprador?: string;
    nominado?: string;
    socio?: string;
    page?: number;
    size?: number;
  }): Observable<{ result: boolean; data: any }> {
    let url = `${this.baseUrl}/events/tickets/report/filter`;
    
    const params = new URLSearchParams();
    
    // Agregar eventId como parámetro
    params.append('eventId', eventId.toString());
    
    // Agregar filtros
    if (filters?.canjeado) params.append('canjeado', filters.canjeado);
    if (filters?.zona) params.append('zona', filters.zona);
    if (filters?.tipoComprador) params.append('tipoComprador', filters.tipoComprador);
    if (filters?.nominado) params.append('nominado', filters.nominado);
    if (filters?.socio) params.append('socio', filters.socio);
    
    // Agregar paginación
    if (filters?.page !== undefined) params.append('page', filters.page.toString());
    if (filters?.size !== undefined) params.append('size', filters.size.toString());
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    return this.http.get<{ result: boolean; data: any }>(url);
  }

  getEventZones(eventId: number): Observable<{ result: boolean; data: any[] }> {
    return this.http.get<{ result: boolean; data: any[] }>(
      `${this.baseUrl}/events/${eventId}/zones`
    );
  }

  getReportSummary(eventId: number, filters?: {
    canjeado?: string;
    zona?: string;
    tipoComprador?: string;
    nominado?: string;
    socio?: string;
  }): Observable<{ result: boolean; data: any }> {
    let url = `${this.baseUrl}/events/tickets/report/summary`;
    
    const params = new URLSearchParams();
    
    // Agregar eventId como parámetro
    params.append('eventId', eventId.toString());
    
    // Agregar filtros
    if (filters?.canjeado) params.append('canjeado', filters.canjeado);
    if (filters?.zona) params.append('zona', filters.zona);
    if (filters?.tipoComprador) params.append('tipoComprador', filters.tipoComprador);
    if (filters?.nominado) params.append('nominado', filters.nominado);
    if (filters?.socio) params.append('socio', filters.socio);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    return this.http.get<{ result: boolean; data: any }>(url);
  }

  exportReport(eventId: number, filters?: {
    canjeado?: string;
    zona?: string;
    tipoComprador?: string;
    nominado?: string;
    socio?: string;
  }): Observable<{ result: boolean; data: any[] }> {
    let url = `${this.baseUrl}/events/tickets/report/export`;
    
    const params = new URLSearchParams();
    
    // Agregar eventId como parámetro
    params.append('eventId', eventId.toString());
    
    // Agregar filtros
    if (filters?.canjeado) params.append('canjeado', filters.canjeado);
    if (filters?.zona) params.append('zona', filters.zona);
    if (filters?.tipoComprador) params.append('tipoComprador', filters.tipoComprador);
    if (filters?.nominado) params.append('nominado', filters.nominado);
    if (filters?.socio) params.append('socio', filters.socio);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    return this.http.get<{ result: boolean; data: any[] }>(url);
  }
}
