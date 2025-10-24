import { Environment } from '@shared/interfaces/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';
import { environment } from '@environments/environment';
import { Affiliate } from '../interfaces/membership.model';

@Injectable({
  providedIn: 'root'
})
export class WalletPaymentService {
  private baseUrl = '/api/v1';
  private walletUrl = environment.URL_WALLET;

  constructor( private http: HttpClient, private userInfoService: UserInfoService) {  }

  getProducts(): Observable<any[]> {
    const userInfo = this.userInfoService.userInfo;
    const userId = userInfo.id;
    const url = `${this.baseUrl}/pay/suscription/${userId}`;
    return this.http.get<any[]>(url).pipe(map((response: any) => response.data));
  }

  getCronograma(id: number): Observable<any[]> {
    const url = `${this.baseUrl}/pay/cronograma/${id}`;
    return this.http.get<any[]>(url).pipe(
      map((response: any) => {
        return response.data;
      })
    );
  }

  saveAffiliateAutomaticPayment(affiliate: any): Observable<any> {
    return this.http.post<any>(`${this.walletUrl}/affiliatepay/affiliate`, affiliate ,
      { 
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      }
  )};

  getAllAffiliatesPay(idUser : number): Observable<any> {
    return this.http.get<any>(`${this.walletUrl}/affiliatepay/allafiliatespay/${idUser}`, 
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      }
  )};

  updateAllAffiliatesPay(affiliate: any): Observable<any> {
    return this.http.put<any>(`${this.walletUrl}/affiliatepay/desaffiliate`, affiliate,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      }
  )};

  saveReasonDisaffiliation(reason: any): Observable<any> {
    return this.http.post<any>(`${this.walletUrl}/reason/save-reason`, reason,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      }
    )};

}
