import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { map, Observable, tap } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class SponsorService {
	private urlAdmin = environment.URL_ADMIN;
	private baseUrl = environment.URL_JOBSTATUSAPI;
	private apiUrl = `${this.baseUrl}/liquidation/reactivatePostLiquidation`;
	constructor(private http: HttpClient) {}

	getSponsors(username: string): Observable<any[]> {
		const payload = {
			username: username,
			state: 1,
			familyPackage: -1,
			packageDetail: -1,
			typeUser: 1
		};

		return this.http.post<any[]>(`${this.urlAdmin}/user/getListUsersOfAdmin/search`, payload);
	}

	checkLiquidationStatus(userId: number): Observable<{ result: boolean; data: boolean }> {
		const url = `${this.baseUrl}/liquidation/isSocioLiquidated/${userId}`;
		return this.http.get<{ result: boolean; data: boolean }>(url);
	}

	reactivateMember(idSponsor: number, idUser: number): Observable<any> {
		const payload = { idSponsor, idUser };
		return this.http.post(this.apiUrl, payload);
	}
}
