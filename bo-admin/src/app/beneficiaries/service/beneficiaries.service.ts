import { HttpClient, HttpContext, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { SKIP_AUTH } from "@app/core/interceptors/http.interceptor";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";

@Injectable({ providedIn: 'root' })
export class BeneficiariesService {

  private urlBeneficiaries = `https://membershipapi-dev.inclub.world/api/v1/beneficiaries/`;
  private urlMembership = 'https://membershipapi-dev.inclub.world/api/v1/pay/';

  private readonly API = environment.api;
  private apiUrl = `${this.API}/api/`;
  //private urlAdmin = environment.
  private noAuthCtx() { return { context: new HttpContext().set(SKIP_AUTH, true) }; }
  constructor(private http: HttpClient) { }

  getMembershipsBySubscriptionId(idSubscription: number): Observable<any> {
    const url = `${this.urlMembership}suscription/${idSubscription}`; 
    return this.http.get<any>(url, this.noAuthCtx()).pipe(map(r => r));
  }

  getBeneFiciariesBySubscriptionId(idSubscription: number): Observable<any> {
    const url = `${this.urlBeneficiaries}subscription/${idSubscription}`;
    return this.http.get<any>(url, {
      context: new HttpContext().set(SKIP_AUTH, true)
    }).pipe(map((response: any) => response));
  }

  findBeneficiaryById(id: number) {
    const url = `${this.urlBeneficiaries}${id}`;
    return this.http.get<any>(url, {
      context: new HttpContext().set(SKIP_AUTH, true)
    }).pipe(map((response: any) => response));
  }

  getBeneficiariesByUserId(userId: number, offset: number, size: number): Observable<any> {
    return this.http
      .get<any>(`${this.urlBeneficiaries}user/${userId}?page=${offset}&size=${size}`)
      .pipe(map((response) => response));
  }

  getUsersByFilter(username: string, typeUser: string): Observable<any[]> {
    const url = `${this.apiUrl}user/getListUsersOfAdmin/search`;
    const body = { username, typeUser };
    return this.http.post<any[]>(url, body);
  }

  getPackageById(idPackageDetail: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/packagedetail/${idPackageDetail}`).pipe(
      map((response: any) => {
        return response.data;
      })
    );
  }

  saveBeneficiary(data: any): Observable<any> {
    const url = `${this.urlBeneficiaries}`;
    return this.http.post<any>(url, data, {
      context: new HttpContext().set(SKIP_AUTH, true)
    }).pipe(map((response: any) => response));
  }

  updateBeneficiary(data: any, id: number): Observable<any> {
    const url = `${this.urlBeneficiaries}${id}`;
    return this.http.put<any>(url, data, {
      context: new HttpContext().set(SKIP_AUTH, true)
    }).pipe(map((response: any) => response));
  }

  deleteBeneficiary(id: number) {
    const url = `${this.urlBeneficiaries}${id}`;
    return this.http.delete<any>(url, {
      context: new HttpContext().set(SKIP_AUTH, true)
    }).pipe(map((response: any) => response));
  }

  getCountriesList(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}country/`).pipe(
      map((paises) =>
        paises.data.map((pais: any) => {
          return { content: pais.nicename, value: pais.idCountry, ...pais };
        })
      )
    );
  }

  getDocumentType(idCountry: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}documenttype/country/${idCountry}`).pipe(
      map((response) => {
        const data = response.data;
        return data.map((type: any) => ({
          content: type.name,
          value: type.idDocumentType
        }));
      })
    );
  }


}