import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Payrolls } from '../interfaces/guest-components.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class PayrollsService {
  private _http: HttpClient = inject(HttpClient);
  // se ingresara el codigo mostrado cuando el flujo de nomina comience
  // public getPayrolls(): Observable<Payrolls[]> {
  //     return this._http.get<Payrolls[]>('/assets/mocks/payrolls-mock.json');
  // }
}