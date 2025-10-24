// src/app/services/location.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';

const BASE_URL = environment.URL_ADMIN;

export interface OptionResponse {
  value: string; // code o id (para distrito es el id de world_locations)
  label: string; // nombre para mostrar en el select
}

export interface WorldLocation {
  id: number;
  countryCode: string;
  countryName: string;
  regionCode: string;
  regionName: string;
  provinceCode: string;
  provinceName: string;
  districtName: string;
}

export interface ApiResponse<T> {
  result: boolean;
  data: T;
  status?: number;
  message?: string;
  timestamp?: string | number;
}

@Injectable({ providedIn: 'root' })
export class LocationService {
  // Normaliza el BASE_URL por si viene con "/" al final
  private readonly apiBase = `${BASE_URL.replace(/\/$/, '')}/locations`;

  constructor(private http: HttpClient) {}

  /** 0) Listar países desde world_locations */
  getCountries(): Observable<OptionResponse[]> {
    const url = `${this.apiBase}/countries`;
    return this.http
      .get<ApiResponse<OptionResponse[]>>(url)
      .pipe(map(res => res?.data ?? []));
  }

  /** 1) Listar regiones por país */
  getRegions(country: string): Observable<OptionResponse[]> {
    const url = `${this.apiBase}/regions`;
    const params = new HttpParams().set('country', country);
    return this.http
      .get<ApiResponse<OptionResponse[]>>(url, { params })
      .pipe(map(res => res?.data ?? []));
  }

  /** 2) Listar provincias por región */
  getProvinces(country: string, region: string): Observable<OptionResponse[]> {
    const url = `${this.apiBase}/provinces`;
    const params = new HttpParams()
      .set('country', country)
      .set('region', region);
    return this.http
      .get<ApiResponse<OptionResponse[]>>(url, { params })
      .pipe(map(res => res?.data ?? []));
  }

  /** 3) Listar distritos por provincia */
  getDistricts(country: string, region: string, province: string): Observable<OptionResponse[]> {
    const url = `${this.apiBase}/districts`;
    const params = new HttpParams()
      .set('country', country)
      .set('region', region)
      .set('province', province);
    return this.http
      .get<ApiResponse<OptionResponse[]>>(url, { params })
      .pipe(map(res => res?.data ?? []));
  }

  /**
   * 4) Obtener el id (world_locations.id) del distrito seleccionado.
   * IMPORTANTE: este endpoint espera el NOMBRE del distrito (label del select).
   */
  getLocationId(country: string, region: string, province: string, districtLabel: string): Observable<number> {
    const url = `${this.apiBase}/id`;
    const params = new HttpParams()
      .set('country', country)
      .set('region', region)
      .set('province', province)
      .set('district', districtLabel);
    return this.http
      .get<ApiResponse<number>>(url, { params })
      .pipe(map(res => (res?.data ?? null) as unknown as number));
  }

  /**
   * 5) Buscar ubicación completa por ID de world_locations
   * Ejemplo: GET /api/locations/by-id/1515
   */
  getLocationById(id: number): Observable<WorldLocation | null> {
    const url = `${this.apiBase}/by-id/${id}`;
    return this.http
      .get<ApiResponse<WorldLocation>>(url)
      .pipe(map(res => res?.data ?? null));
  }
}
