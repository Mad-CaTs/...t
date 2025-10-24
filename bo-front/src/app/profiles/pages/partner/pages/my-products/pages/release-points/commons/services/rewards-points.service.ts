import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class RewardsPointsService {
	private apiUrl = environment.URL_API_REWARDS + '/rewards';

	constructor(private http: HttpClient) {}

	releasePoints(idSus: number): Observable<any> {
		const url = `${this.apiUrl}/view/${idSus}`;
		return this.http.get(url);
	}

	sendReleasePoints(rewardsAmount: number, idSus: number): Observable<any> {
		const url = `${this.apiUrl}/subscriptions/${idSus}/rewards/release`;
		return this.http.post(url, { rewardsAmount });
	}

	getRecentMovements(idSus: number): Observable<any> {
		const url = `${this.apiUrl}/movements/recent/${idSus}`;
		return this.http.get(url);
	}

	getMovements(idSus: number, startDate?: string, endDate?: string): Observable<any> {
		const url = `${this.apiUrl}/movements/filter/${idSus}`;

		// Si no se pasan fechas, calcula los últimos 6 meses
		let start: string;
		let end: string;

		if (!startDate || !endDate) {
			const endDateObj = new Date();
			const startDateObj = new Date();
			startDateObj.setMonth(endDateObj.getMonth() - 6);

			// Formato DD/MM/YYYY
			const pad = (n: number) => n.toString().padStart(2, '0');
			start = `${pad(startDateObj.getDate())}/${pad(
				startDateObj.getMonth() + 1
			)}/${startDateObj.getFullYear()}`;
			end = `${pad(endDateObj.getDate())}/${pad(
				endDateObj.getMonth() + 1
			)}/${endDateObj.getFullYear()}`;
		} else {
			start = startDate;
			end = endDate;
		}

		const params = new URLSearchParams({
			startDate: start,
			endDate: end
		}).toString();

		return this.http.get(`${url}?${params}`);
	}
}
