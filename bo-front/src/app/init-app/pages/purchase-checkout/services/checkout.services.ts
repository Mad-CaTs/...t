// src/app/init-app/pages/purchase-checkout/services/checkout.services.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export type PublicUserInfo = {
	fullName: string;
	documentNumber: string;
	documentTypeName: string;
};

@Injectable({ providedIn: 'root' })
export class CheckoutService {
	private readonly baseUrl = `${environment.URL_API_TicketApi}/users`;

	constructor(private http: HttpClient) {}

	getPublicUserInfo(userId: number | string): Observable<PublicUserInfo> {
		return this.http.get<PublicUserInfo>(`${this.baseUrl}/${userId}/info`);
	}
}

