import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { DetailPackageRewardsDto } from '../pages/packages/detail-page/detail-detail-page/models/package-rewards-request-dto.interface';

@Injectable({
	providedIn: 'root'
})
export class PackageDetailRewardsService {
	private readonly API = environment.api;
	private apiUrl = `${this.API}/api/packagedetail-rewards`;

	constructor(private http: HttpClient) {}

	updatePackageDetailRewards(body: any, id: number): Observable<any> {
		const url = `${this.apiUrl}/${id}/rewards`;
		return this.http.put<any>(url, body).pipe(
			map((response) => response),
			catchError((error: any) => {
				return throwError(error);
			})
		);
	}

	createPackageDetailRewards(body: any): Observable<any> {
		const url = `${this.apiUrl}/`;
		return this.http.post<any>(url, body).pipe(
			map((response) => response),
			catchError((error: any) => {
				return throwError(error);
			})
		);
	}

	getPackageDetailRewards(id: number): Observable<DetailPackageRewardsDto> {
		const url = `${this.apiUrl}/${id}`;
		return this.http.get<{ result: boolean; data: DetailPackageRewardsDto; status: number }>(url).pipe(
			map((response) => response.data),
			catchError((error: any) => {
				return throwError(error);
			})
		);
	}

	/**
	 * List package detail rewards by family package and membership version
	 * @param idFamilyPackage number
	 * @param idMembershipVersion number
	 */
	listPackageDetailRewards(idFamilyPackage: number, idMembershipVersion: number): Observable<any[]> {
		const params: string[] = [];
		if (idFamilyPackage !== undefined && idFamilyPackage !== null) {
			params.push(`idFamilyPackage=${idFamilyPackage}`);
		}
		if (idMembershipVersion !== undefined && idMembershipVersion !== null) {
			params.push(`idMembershipVersion=${idMembershipVersion}`);
		}
		const query = params.length ? `?${params.join('&')}` : '';
		const url = `${this.apiUrl}${query}`;
		return this.http.get<{ result: boolean; data: any[]; status: number }>(url).pipe(
			map((response) => response.data),
			catchError((error: any) => {
				return throwError(error);
			})
		);
	}
}
