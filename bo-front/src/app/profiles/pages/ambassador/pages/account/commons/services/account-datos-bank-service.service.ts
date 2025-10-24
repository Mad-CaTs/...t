import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { map, Observable } from 'rxjs';
import { AccountBankRequest } from '../../pages/account-datos-bank/commons/interface/accountBankRequest';

@Injectable({
  providedIn: 'root'
})
export class AccountDatosBankServiceService {
  private apiUrl = '/api/v1';
  private apiAccount = environment.URL_ACCOUNT
  private apiAdmin = environment.URL_ADMIN

  /*   private apiAccount = environment.URL_LOCAL
    private apiAdmin = environment.URL_LOCAL_ADMIN */

  constructor(private httpClient: HttpClient) { }

  getAccountBankIdUser(idUser: any): Observable<any> {
    return this.httpClient.get<any>(`${this.apiUrl}/accountbank/list/${idUser}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  postSaveGestion(accountbank: AccountBankRequest): Observable<any> {
    return this.httpClient.post<any>(this.apiAccount + "/accountbank", accountbank);
  }
  updateSaveGestion(accountbank: AccountBankRequest, idAccountBank: any): Observable<any> {
    return this.httpClient.put<any>(`${this.apiUrl}/accountbank/${idAccountBank}`, accountbank);
  }
  deleteSaveGestion(idAccountBank: any): Observable<any> {
    return this.httpClient.delete<any>(`${this.apiUrl}/accountbank/${idAccountBank}`);
  }
  findAllByIdCountry(): Observable<any> {
    let idCountry = 168;
    return this.httpClient.get<any>(`${this.apiAdmin}/bank/${idCountry}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  getTypeAccountBank(): Observable<any> {
    return this.httpClient.get<any>(`${this.apiAccount}/typeaccountbank/list`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
}
