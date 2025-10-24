import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { RetiroBankRequest } from '../../pages/account-datos-bank/commons/interface/retiroBankRequest';

@Injectable({
  providedIn: 'root'
})
export class RetiroBancariaService {
  private api = environment.URL_WALLET

  constructor(private httpClient: HttpClient) { }

  posSaveBancario(retirobank: RetiroBankRequest): Observable<any> {
    return this.httpClient.post<any>(this.api + "/solicitudebank/save", retirobank);
  }
}
