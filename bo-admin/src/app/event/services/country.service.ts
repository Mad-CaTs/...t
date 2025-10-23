import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
const BASE_URL = environment.api;

export interface CountryOption {
  idCountry: number;
  nicename: string;
  courtesy?: string | null;
  icon: string;
  iso: string;
  phonecode: number;
}

interface CountryApiResponse {
  result: boolean;
  data: any[] | null;
  message?: string;
  timestamp?: number;
  status?: number;
}

@Injectable({ providedIn: 'root' })
export class CountryService {
  private readonly apiUrl = `${BASE_URL}/api/country/`;

  constructor(private http: HttpClient) {}

  getCountries(): Observable<CountryOption[]> {
    const headers = new HttpHeaders().set('Accept', 'application/json');

    return this.http.get<CountryApiResponse>(this.apiUrl, { headers }).pipe(
      map((res) => {
        const list = Array.isArray(res?.data) ? res.data! : [];
        return list.map((c: any) => ({
          idCountry: c.idCountry,
          nicename: c.nicename,
          courtesy: c.courtesy ?? null,
          icon: c.icon,
          iso: c.iso,
          phonecode: c.phonecode
        })) as CountryOption[];
      }),
      catchError((err) => {
        console.error('[CountryService] GET /country/ falló:', err);
        return of([] as CountryOption[]);
      })
    );
  }
}
