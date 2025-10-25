import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable, map } from 'rxjs';

export interface IExchangeRate {
  idExchangeRate: number;
  buys: number;
  sale: number;
  date: number[];
  modificationDate: number[];
}

@Injectable({
  providedIn: 'root'
})
export class ModalPaymentService {
  private url = environment.URL_ADMIN;
  
  constructor(private http: HttpClient) { }

  getCurrency(): Observable<any> {
    return this.http.get<any>(`${this.url}/currency/`).pipe(
      map((response: any) =>
        response.data.map((cu) => {
          return { content: cu.name, value: cu.idCurrency + 0, ...cu };
        })
      )
    );
  }

  getTipoCambio(): Observable<IExchangeRate> {
    return this.http.get<any>(`${this.url}/exchangerate/getexchange`).pipe(
      map((response: any) => response.data)
    );
  }
}