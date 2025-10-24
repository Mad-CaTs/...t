import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from '@environments/environment';

@Injectable({
	providedIn: 'root'
})
export class DirectUsersService {
	private urlPlacement = '/api/v1';
	private urlUnplacement = '/api/v1/three';
	private urlState = environment.URL_ADMIN;
	private urlJobstatus = environment.URL_JOBSTATUSAPI;
	private apiUrl = `${this.urlJobstatus}/liquidation/getDirectsOrDirectsByLiquidation`;
	constructor(private http: HttpClient) {}

	getListPlacement(id: number): Observable<any> {
		return this.http.get<any>(`${this.urlPlacement}/placement/${id}`).pipe(
			map((response: any) => {
				return response.data;
			})
		);
	}

	getListBranches(id: number): Observable<any> {
		return this.http.get<any>(`${this.urlPlacement}/three/placementBranches/${id}`).pipe(
			map((response: any) => {
				return response.data;
			})
		);
	}

	getDirectsOrLiquidation(idSocio: number, directsByLiquidation: boolean): Observable<any> {
		const body = {
			idSocio,
			directsByLiquidation
		};

		return this.http.post(this.apiUrl, body);
	}

	/* putPlacement(body: IPlacementPut): Observable<any> {
		return this.http.put<any>(`${this.urlPlacement}/three/placement/position`, body).pipe(
			catchError((error) => {
				console.error('Error in putPlacement', error);
				return throwError(error);
			})
		);
	}

	putDesplacement(body: IPlacementPut): Observable<any> {
		return this.http.put<any>(`${this.urlPlacement}/three/placement/unposition`, body).pipe(
			catchError((error) => {
				console.error('Error in putPlacement', error);
				return throwError(error);
			})
		);
	} */

	getListAllMembership(): Observable<any> {
		return this.http.get<any>(`${this.urlState}/package/detail/version/state/true`).pipe(
			map((response) => {
				return response.data;
			})
		);
	}

	getListUnplacement(id: number): Observable<any> {
		return this.http.get<any>(`${this.urlUnplacement}/desplacement/${id}`).pipe(
			map((response: any) => {
				return response.data;
			})
		);
	}
}
