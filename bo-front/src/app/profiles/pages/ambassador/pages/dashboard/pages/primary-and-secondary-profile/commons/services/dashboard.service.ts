import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable, map } from 'rxjs';
import { Colors, IPointKafka, PointKafkaBody } from '../interfaces/dashboard.interface';

@Injectable({
	providedIn: 'root'
})
export class DashboardService {
	private urlImg = environment.URL_IMG;
	private urlBonificaciones = environment.URL_API_COMMISSION
	private apiGateway = environment.URL_GATEWEY;

	constructor(private http: HttpClient) { }

	getPoints(idSocio: number): Observable<any> {
		return this.http.get(`${this.apiGateway}/points/${idSocio}`);
	}

	postPointsKafka(body: PointKafkaBody): Observable<any> {
		return this.http.post(`${this.apiGateway}/three/pointskafka`, body);
	}

	getRange(idSocio: number): Observable<any> {
		return this.http.get(`${this.apiGateway}/points/ranges/${idSocio}`);
	}

	getRangeArray(idSocio: number[]): Observable<any> {
		return this.http.get(`${this.apiGateway}/points/ranges?ids=${idSocio}`);
	}

	getColors(): Observable<any> {
		return this.http.get(`${this.apiGateway}/points/ranges/colors`)
	}

	getRangeImages(name: string): Observable<any> {
		return this.http.get(`${this.urlImg}Ranges/${name}.png`);
	}

	getNextRanges(idSocio: number): Observable<any> {
		return this.http.get(`${this.apiGateway}/points/next/ranges/${idSocio}`);
	}

	getPointRangesPercentages(idSocio: number): Observable<any> {
		return this.http.get(`${this.apiGateway}/points/pointRanges/percentages/${idSocio}`);
	}

	getBonus(idSocio: number): Observable<any> {
		return this.http.get<any>(`${this.urlBonificaciones}/commissions/dashboard/user/${idSocio}`);
	}
}