import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { map, Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class BuyPackageService {
	private apiUrl = '/api/v1';
	private urlAccount = environment.URL_ACCOUNT;

	constructor(private http: HttpClient) { }

	buyPackage(body): Observable<any> {
		return this.http.post<any>(`${this.apiUrl}/store`, body);
	}

	registerPromotionalGuest(body: any): Observable<any> {
		return this.http.post<any>(`${this.apiUrl}/promotionalGuest`, body);
	}

	getRegisteredList(userId: number, page: number, size: number): Observable<any> {
		return this.http
			.get<any>(`${this.apiUrl}/promotionalGuest/user/${userId}?page=${page}&size=${size}`)
			.pipe(
				map((response: any) => {
					return response;
				})
			);
	}

	deleteGuest(id: string): Observable<any> {
		const url = `${this.apiUrl}/promotionalGuest/${id}`;
		return this.http.delete(url);
	}

	findProspectById(id: number): Observable<any> {
		return this.http.get(`${this.apiUrl}/promotionalGuest/${id}`);
	}

	updatePromotionalGuest(data: any, id: number): Observable<any> {
		return this.http.put<any>(`${this.apiUrl}/promotionalGuest/${id}`, data).pipe(
			map((response: any) => {
				return response;
			})
		);
	}
}
