import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable, map } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class LiquidationAdminPackageService {
	private url = environment.URL_ADMIN;
	private urlMembership = '/api/v1';

	constructor(private http: HttpClient) {}

 	getFamilyPackage(): Observable<any> {
		return this.http.get<any[]>(`${this.url}/familypackage/all`).pipe(
			map((response: any) => {
				return response;
			})
		);
	}

	getSusbcriptionsByFamilyPackage(idUser: number): Observable<any> {
		return this.http.get<any[]>(`${this.urlMembership}/pay/suscription/${idUser}`).pipe(
			map((response: any) => {
				return response;
			})
		);
	}

	getAllPayments(idSuscription: number): Observable<any> {
		return this.http.get<any[]>(`${this.urlMembership}/pay/cronograma/${idSuscription}`).pipe(
			map((response: any) => {
				return response;
			})
		);
	}
  
}
