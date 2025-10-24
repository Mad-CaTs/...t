import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { map, Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class GracePeriodService {
	private urlGracePeriod = `/api/v1`;
	constructor(private httpClient: HttpClient) {}

	getGracePeriodActiveParameter(status: number): Observable<any> {
		return this.httpClient.get<any>(`${this.urlGracePeriod}/gracePeriod/parameterStatus/${status}`).pipe(
			map((response: any) => {
				return response;
			})
		);
	}

	getGracePeriodsBySuscriptionIdAndStatus(suscriptionId: number, status: number): Observable<any> {
		return this.httpClient
			.get<any>(`${this.urlGracePeriod}/gracePeriod/suscription/${suscriptionId}/status/${status}`)
			.pipe(
				map((response: any) => {
					return response;
				})
			);
	}

	saveGracePeriod(gracePeriod): Observable<any> {
		return this.httpClient.post<any>(`${this.urlGracePeriod}/gracePeriod`, gracePeriod);
	}

	updateGracePeriod(gracePeriod, gracePeriodId): Observable<any> {
		return this.httpClient.put<any>(`${this.urlGracePeriod}/gracePeriod/${gracePeriodId}`, gracePeriod);
	}

	calculateNormalGracePeriod(params: {
		daysApplied: number;
		flagSchedule: number;
		daysAvailable: number;
		amountOverdue: number;
		percentOverdueDetailId: number;
		quoteUsd: number;
	}): Observable<any> {
		const httpParams = new HttpParams()
			.set('daysApplied', params.daysApplied.toString())
			.set('flagSchedule', params.flagSchedule.toString())
			.set('daysAvailable', params.daysAvailable.toString())
			.set('amountOverdue', params.amountOverdue.toString())
			.set('percentOverdueDetailId', params.percentOverdueDetailId.toString())
			.set('quoteUsd', params.quoteUsd.toString());

		return this.httpClient.get<any>(`${this.urlGracePeriod}/gracePeriod/calculateNormalGracePeriod`, {
			params: httpParams
		});
	}
}
