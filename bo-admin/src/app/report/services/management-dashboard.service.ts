import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface RangeSummary {
	idRange: number;
	rango: string;
	fecha: string;
	total: number;
}

@Injectable({
	providedIn: 'root'
})
export class ManagementDashboardService {
	private readonly API = environment.apireports;
	private readonly API2 = environment.apiReportsLocal;

	constructor(private http: HttpClient) {}

	getAffiliatesNationalitySummary(typeNationality: string, state?: number) {
		let params = new HttpParams().set('typeNationality', typeNationality);
		if (state != null) params = params.set('state', state.toString());
		return this.http.get(`${this.API}/reports/affiliates/nationality-summary`, { params });
	}

	getByMonth(year: number, state?: number, countries?: number[], month?: number) {
		let params = new HttpParams().set('year', year.toString());
		if (state != null) params = params.set('state', state.toString());
		if (countries && countries.length > 0) {
		countries.forEach(c => {
			params = params.append('countries', c.toString()); // ✅ agrega múltiples ?countries=...
		});
		}
		if (month != null) params = params.set('month', month.toString());

		return this.http.get(`${this.API}/reports/affiliates/historical/month`, { params });
	}

	getByQuarter(year: number, state?: number, countries?: number[]) {
		let params = new HttpParams().set('year', year.toString());
		if (state != null) params = params.set('state', state.toString());
		if (countries && countries.length > 0) {
		countries.forEach(c => {
			params = params.append('countries', c.toString()); // ✅ agrega múltiples ?countries=...
		});
		}

		return this.http.get(`${this.API}/reports/afiliados/historical/quarter`, { params });
	}

	compareByYear(year1: number, year2: number, state?: number, countries?: number[]) {
		let params = new HttpParams().set('year1', year1.toString()).set('year2', year2.toString());
		if (state != null) params = params.set('state', state.toString());
		if (countries && countries.length > 0) {
		countries.forEach(c => {
			params = params.append('countries', c.toString()); // ✅ agrega múltiples ?countries=...
		});
		}

		return this.http.get(`${this.API}/reports/affiliates/historical/year`, { params });
	}


	downloadByMonth(year: number, state?: number, countries?: number[], month?: number) {
		let params = new HttpParams().set('year', year.toString());
		if (state != null) params = params.set('state', state.toString());
		if (countries && countries.length > 0) {
		countries.forEach(c => {
			params = params.append('countries', c.toString());
		});
		}
		if (month != null) params = params.set('month', month.toString());

		return this.http.get(`${this.API}/reports/affiliates/download/month`, {
			params,
			responseType: 'blob'
		});
	}
	
	downloadByTwoYears(year1: number, year2: number, state?: number,  countries?: number[]) {
		let params = new HttpParams().set('year1', year1.toString()).set('year2', year2.toString());
		if (state != null) params = params.set('state', state.toString());
		if (countries && countries.length > 0) {
		countries.forEach(c => {
			params = params.append('countries', c.toString());
		});
		}

		return this.http.get(`${this.API}/reports/affiliates/download/years`, {
			params,
			responseType: 'blob'
		});
	}

	downloadByQuarter(year: number, state?: number, countries?: number[]) {
		let params = new HttpParams().set('year', year.toString());
		if (state != null) params = params.set('state', state.toString());
		if (countries && countries.length > 0) {
		countries.forEach(c => {
			params = params.append('countries', c.toString());
		});
		}
		return this.http.get(`${this.API}/reports/affiliates/download/quarter`, {
			params,
			responseType: 'blob'
		});
	}

	downloadSubscribersByPackage(year: number, packageId?: number, state?: number,month?: number, familyId?: number) {
		let params = new HttpParams().set('year', year.toString());
		if (packageId != null) params = params.set('packageId', packageId.toString());
		if (state != null) params = params.set('state', state.toString());
		if (month != null) params = params.set('month', month.toString());
		if (familyId != null) params = params.set('familyId', familyId.toString());

		return this.http.get(`${this.API}/reports/affiliates/download/subscribers/by-package`, {
			params,
			responseType: 'blob'
		});
	}

	downloadRangeLastDate() {
		return this.http.get(`${this.API}/reports/affiliates/range/download/last-date`, {
			responseType: 'blob'
		});
	}

	getAffiliatesByCountry(year: number, month?: number, state?: number) {
		let params = new HttpParams().set('year', year.toString());
		if (month != null) params = params.set('month', month.toString());
		if (state != null) params = params.set('state', state.toString());

		return this.http.get(`${this.API}/reports/affiliates/country`, { params });
	}

	getCountByLastDate(): Observable<RangeSummary[]> {
		return this.http.get<RangeSummary[]>(`${this.API}/reports/conteo-ultima-fecha`);
	}

	getSubscribersByPackage(
		year: number,
		packageId?: number,
		state?: number,
		month?: number,
		familyId?: number
	) {
		let params = new HttpParams().set('year', year.toString());
		if (packageId != null) params = params.set('packageId', packageId.toString());
		if (state != null) params = params.set('state', state.toString());
		if (month != null) params = params.set('month', month.toString());
		if (familyId != null) params = params.set('familyId', familyId.toString());

		return this.http.get(`${this.API}/reports/affiliates/subscribers/by-package`, { params });
	}
}
