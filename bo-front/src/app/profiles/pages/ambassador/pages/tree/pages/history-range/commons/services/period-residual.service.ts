import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable, map } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class PeriodResidualService {
	private url = environment.URL_API_COMMISSION;
	private apiUrl = environment.URL_API_COMMISSION;
	private apiGateway = environment.URL_GATEWEY;

	constructor(private http: HttpClient) {}

	getPeriodResidualByUser(userId: number, page: number, size: number): Observable<any> {
		return this.http.get<any>(`${this.url}/periodResidual/user/${userId}?page=${page}&size=${size}`).pipe(
			map((response: any) => {
				return response;
			})
		);
	}
	getActiveRanges(): Observable<any> {
		return this.http.get<any>(`${this.apiGateway}/three/ranges/active`);
	}

	getHistoricData(userId: number): Observable<any> {
		return this.http.get<any>(`${this.apiUrl}/periodCompound/historic/${userId}`).pipe(
			map((response: any) => {
				return response;
			})
		);
	}
}
