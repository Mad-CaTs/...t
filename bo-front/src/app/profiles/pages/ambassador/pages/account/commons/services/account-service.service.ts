import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { map, Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class AccountServiceService {
	private url = 'api/v1';
	

	private apiGateway = environment.URL_GATEWEY;

	constructor(private httpClient: HttpClient) { }

	changePassword(data: any): Observable<any> {
		return this.httpClient.post<any>(`${this.apiGateway}/auth/change-old-password`, data).pipe(
			map((response: any) => {
				return response;
			})
		);
	}

	sendCode(email: string): Observable<any> {
		return this.httpClient.get<any>(`${this.apiGateway}/auth/send-code-password/${email}`).pipe(
			map((response: any) => {
				return response;
			})
		);
	}

	validateCode(userId: any, code: any): Observable<any> {
		return this.httpClient.get<any>(`${this.apiGateway}/code/${code}/user/${userId}`).pipe(
			map((response: any) => {
				return response;
			})
		);
	}

}
