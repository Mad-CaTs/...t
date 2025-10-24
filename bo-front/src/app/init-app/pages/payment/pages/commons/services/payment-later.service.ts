import { Environment } from './../../../../../../shared/interfaces/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable, map, throwError } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class PaymentLaterService {
	private urlPaymentPrueba = environment.URL_API_PAYMENT;
	private urlAdmin = environment.URL_ADMIN;
  private apiUrl = '/api/v1';


	constructor(private http: HttpClient) {}

	getValitateToken(token: string): Observable<any> {
		return this.http.get<any>(`${this.urlPaymentPrueba}/pay/validate/token/${token}`).pipe(
			map((response: any) => {
				return response.data;
			})
		);
	}

	getSuscription(id: number): Observable<any> {
		return this.http.get<any>(`${this.urlPaymentPrueba}/pay/suscription/${id}`).pipe(
			map((response: any) => {
				return response.data;
			})
		);
	}

	getPackageById(idPackageDetail: number): Observable<any[]> {
		return this.http.get<any[]>(`${this.urlAdmin}/packagedetail/${idPackageDetail}`).pipe(
			map((response: any) => {
				return response.data;
			})
		);
	}

	postPay(payload): Observable<any> {
		return this.http.post<any>(`${this.urlPaymentPrueba}/pay`, payload);
	}

  validateCode(code: string): Observable<any> {
    const url = `${this.apiUrl}/wallettransaction/validate-code/${code}`;  
    return this.http.get<any>(url);
  }

	
}
