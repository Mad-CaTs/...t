import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BeneficiaryService {
  private urlAdmin = environment.URL_ADMIN;

  private urlBeneficiary = environment.URL_API_PAYMENT;

  constructor(private httpClient: HttpClient) { }

  getMembershipsBySubscriptionId(idSubscription: number): Observable<any> {
    return this.httpClient.get<any>(`${this.urlBeneficiary}/pay/suscription/${idSubscription}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  getBeneficiariesByUserId(userId: number, page: number, size: number): Observable<any> {
    return this.httpClient.get<any>(`${this.urlBeneficiary}/beneficiaries/user/${userId}?page=${page}&size=${size}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  getBeneFiciariesBySubscriptionId(idSubscription: number): Observable<any> {
    return this.httpClient.get<any>(`${this.urlBeneficiary}/beneficiaries/subscription/${idSubscription}`).pipe(
      map( (response: any) => {
        return response;
      })
    );
  }

  getPackageById(idPackageDetail: number): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.urlAdmin}/packagedetail/${idPackageDetail}`).pipe(
      map((response: any) => {
        return response.data;
      })
    );
  }

  findBeneficiaryById(id: number) {
    return this.httpClient.get<any>(`${this.urlBeneficiary}/beneficiaries/${id}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  saveBeneficiary(data: any): Observable<any> {
    return this.httpClient.post<any>(`${this.urlBeneficiary}/beneficiaries/`, data).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  updateBeneficiary(data: any, id: number): Observable<any> {
    return this.httpClient.put<any>(`${this.urlBeneficiary}/beneficiaries/${id}`, data).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  deleteBeneficiary(id: number) {
    return this.httpClient.delete<any>(`${this.urlBeneficiary}/beneficiaries/${id}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

}
