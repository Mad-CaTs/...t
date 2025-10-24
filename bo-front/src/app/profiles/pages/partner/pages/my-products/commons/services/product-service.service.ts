import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable, map } from 'rxjs';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';
import { RejectedPaymentResponse } from '../interfaces/pay-fee.interface';

@Injectable({
	providedIn: 'root'
})
export class ProductService {
	private baseUrl = '/api/v1';
	private urlJobstatus = environment.URL_JOBSTATUSAPI;
	private urlAdmin = environment.URL_ADMIN;
	private membershipApiUrl = environment.URL_API_PAYMENT; // https://membershipapi-dev.inclub.world/api/v1

	constructor(private http: HttpClient, private userInfoService: UserInfoService) {}
	getProducts(): Observable<any[]> {
		const userInfo = this.userInfoService.userInfo;
		const userId = userInfo.id;
		const url = `${this.baseUrl}/pay/suscription/${userId}`;
		return this.http.get<any[]>(url).pipe(map((response: any) => response.data));
	}

	getSuscription(idUser: number): Observable<any[]> {
		const url = `${this.baseUrl}/pay/suscription/${idUser}`;
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

	payQuote(payload): Observable<any> {
		return this.http.post<any>(`${this.baseUrl}/pay`, payload);
	}

	getQuoteDetail(idPayment: number): Observable<any> {
		const url = `${this.baseUrl}/pay/payment/${idPayment}`;
		return this.http.get<any>(url).pipe(map((response: any) => response.data));
	}

	getTotalQuotes(productId: number): Observable<number> {
		return this.getCronograma(productId).pipe(map((cronograma) => cronograma.length));
	}

	getSuscriptionDetail(id: number): Observable<any> {
		return this.http.get<any>(`${this.baseUrl}/pay/suscription/detail/${id}`);
	}

	updateJobStatus(idUser: number) {
		return this.http.post(
			`${this.urlJobstatus}/job-status/updateStatus`,
			{ idUser },
			{
				headers: new HttpHeaders({
					'Content-Type': 'application/json'
				})
			}
		);
	}

	getPaymentRejectionByIdPayment(idPayment: number): Observable<RejectedPaymentResponse> {
		return this.http.get<RejectedPaymentResponse>(`${this.urlAdmin}/payment/reason`, {
			params: {
				'id-payment': idPayment
			}
		});
	}


	getActiveCouponBySubscription(idSubscription: number, idUser: number): Observable<any> {
		const url = `${this.membershipApiUrl}/coupons/searchactive/${idSubscription}/${idUser}`;
		
		return this.http.get<any>(url).pipe(
			map(response => {
				if (response.state && response.data) {
					return {
						found: true,
						idCoupon: response.data.idCoupon,
						discountPercentage: response.data.discountPercentage,
						code: response.data.code,
						state: response.data.state,
						dateStart: response.data.dateStart,
						dateEnd: response.data.dateEnd,
						isPartner: response.data.isPartner
					};
				}
				return { found: false };
			})
		);
	}
}
