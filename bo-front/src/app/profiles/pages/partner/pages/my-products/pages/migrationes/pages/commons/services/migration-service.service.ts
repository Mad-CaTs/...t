import { HttpClient, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable, map, tap } from 'rxjs';
import { ILeyend } from 'src/app/profiles/pages/ambassador/pages/tree/commons/interfaces';

@Injectable({
	providedIn: 'root'
})
export class MigrationService {
	private apiUrl = environment.URL_ADMIN;
	/*   private baseUrl = '/api/v1';
	 */
	private baseUrl = environment.URL_API_REGISTER_MIGRATION;
	private prueba = `${this.baseUrl}/migration/detail`;

	constructor(private http: HttpClient) {}

	getAvailablePackages(id: number): Observable<any> {
		return this.http.get<any>(`${this.apiUrl}/migrations/package/detail/${id}/migration/package`);
	}

	getAvailablePortafolios(id: number): Observable<any> {
		return this.http.get<any>(`${this.apiUrl}/migrations/package/detail/${id}/migration/portafolio`);
	}

	getPackageDetail(idPackageDetail: number, idPackage: number): Observable<any> {
		const url = `${this.apiUrl}/packagedetail/${idPackageDetail}/package/${idPackage}`;
		return this.http.get(url);
	}

	registerMigration(payload: any, files: File[]): Observable<any> {
		const formData = new FormData();
		files.forEach((file) => {
			formData.append('file', file);
		});
		const requestFile = new File([JSON.stringify(payload)], 'request.json', { type: 'application/json' });
		formData.append('request', requestFile);
		formData.forEach((value, key) => {
			console.log(`🔹 ${key}:`, value);
		});
		return this.http.post<any>(`${this.baseUrl}/migration/process-migration`, formData, {
			headers: new HttpHeaders({
				Accept: 'application/json'
			})
		});
	}

	getMigrationDetail(
		idSuscription: number,
		idPackageDetailNew: number,
		idPackageNew: number
	): Observable<any> {
		const params = new HttpParams()
			.set('idSuscription', idSuscription.toString())
			/*       .set('idOption', idOption.toString())
			 */ .set('idPackageDetailNew', idPackageDetailNew.toString())
			.set('idPackageNew', idPackageNew.toString());

		return this.http.get(`${this.baseUrl}/migration/options`, { params });
	}

	getMigrationScheduleDetail(
		idSuscription: number,
		idOption: number,
		idPackageNew: number,
		idPackageDetailNew: number
	): Observable<any> {
		let params = new HttpParams()
			.set('idSuscription', idSuscription.toString())
			.set('idOption', idOption.toString())

			.set('idOption', idOption.toString())
			.set('idPackageNew', idPackageNew.toString())
			.set('idPackageDetailNew', idPackageDetailNew.toString());

		return this.http.get<any>(`${this.baseUrl}/migration/migration-schedule-detail`, { params });
	}

	/*   simulateMigration(idSuscription: number, idPackageNew: number, idPackageDetailNew: number): Observable<any> {
    const url = `${this.baseUrl}/migration/schedule-simulation?idSuscription=${idSuscription}&idPackageNew=${idPackageNew}&idPackageDetailNew=${idPackageDetailNew}`;
    return this.http.get<any>(url);
  } */
	simulateMigration(
		idSuscription: number,
		idOption: number,
		idPackageNew: number,
		idPackageDetailNew: number
	): Observable<any> {
		const url = `${this.baseUrl}/migration/schedule-simulation?idSuscription=${idSuscription}&idOption=${idOption}&idPackageNew=${idPackageNew}&idPackageDetailNew=${idPackageDetailNew}`;
		return this.http.get<any>(url);
	}

	// MigrationService
	getPreviewMigration(idSuscriptionOld: number, idPackageNew: number, idPackageDetailNew: number) {
		return this.http.get<{ data: any }>(
			`${this.baseUrl}/migration/${idSuscriptionOld}/${idPackageNew}/${idPackageDetailNew}`
		);
	}
}
