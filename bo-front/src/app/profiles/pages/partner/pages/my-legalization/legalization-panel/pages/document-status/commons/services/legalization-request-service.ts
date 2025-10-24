import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from '@environments/environment';
import { ILegalizationRequestResponse } from '../interfaces/legalization-request.interface';
import { ISelect } from '@shared/interfaces/forms-control';

@Injectable({
	providedIn: 'root'
})
export class LegalizationRequestService {
	private baseUrl = environment.URL_API_LEGAL;

	constructor(private http: HttpClient) {}

	getUserLegalizationRequests(userId: number): Observable<ILegalizationRequestResponse> {
		return this.http
			.get<ILegalizationRequestResponse>(`${this.baseUrl}/document/query/user/${userId}`)
			.pipe(
				catchError((error) => {
					console.error('Error al obtener solicitudes de legalización:', error);
					return throwError(() => error);
				})
			);
	}

	/* 	getDocumentProgress(userId: number, documentKey: string): Observable<any> {
		const url = `${this.baseUrl}/document/progress/user/${userId}/progress/${documentKey}`;
		return this.http.get<any>(url).pipe(
			catchError((error) => {
				console.error('Error al obtener progreso del documento:', error);
				return throwError(() => error);
			})
		);
	} */
	getDocumentProgress(documentKey: string): Observable<any> {
		const url = `${this.baseUrl}/document/query/${documentKey}/progress`;
		return this.http.get<any>(url).pipe(
			catchError((error) => {
				console.error('Error al obtener progreso del documento:', error);
				return throwError(() => error);
			})
		);
	}

	getVouchersFromApi(documentId: string): Observable<any[]> {
		const url = `${this.baseUrl}/document/${documentId}/vouchers`;
		return this.http.get<any[]>(url);
	}

	reuploadVouchers(documentId: string, vouchers: any[]) {
		const url = `${this.baseUrl}/document/${documentId}/reupload-vouchers`;
		return this.http.put(url, vouchers);
	}
	getUserDocumentsGrouped(userId: number): Observable<any> {
		return this.http.get<any>(`${this.baseUrl}/document/query/user/${userId}/documents-grouped`);
	}

	getDocumentDetail(documentKey: string): Observable<any> {
		const url = `${this.baseUrl}/document/${documentKey}/detail`;
		return this.http.get<any>(url);
	}

	updateShippingInfo(documentKey: string, userId: string | number, payload: any): Observable<any> {
		const params = new HttpParams().set('userId', userId.toString());
		const url = `${this.baseUrl}/document/${documentKey}/shipping`;

		return this.http.patch(url, payload, { params });
	}
	/* previo- modal */
	getLegalizationVouchers(documentKey: string): Observable<any> {
		const url = `${this.baseUrl}/document/${documentKey}/vouchers`;
		return this.http.get<any>(url);
	}

	validateSolicitudExiste(documentKey: string, userId: number): Observable<any> {
		const url = `${this.baseUrl}/document/query/validate/solicitud-existe`;
		const params = { documentKey, userId: userId.toString() };
		return this.http.get<any>(url, { params });
	}

	getConformityStatus(idSuscription: number, idCustomer: number) {
		const url = `${this.baseUrl}/conformity/by-suscription/${idSuscription}/customer/${idCustomer}`;
		return this.http.get(url);
	}
}
