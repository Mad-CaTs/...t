import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ISelectOptReason } from '@interfaces/form-control.interface';
import { ITableTransferRequest, ITransferType } from '@interfaces/transfer.interface';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root'
})
export class TransferService {
	private readonly API = environment.api;
	private apiUrl = `${this.API}/api/`;
	private apiUrlTransfer = environment.apiUrlTransfer;

	constructor(private http: HttpClient) {}

	validateTransfer(payload: any): Observable<any> {
		return this.http.post(this.apiUrl + 'transfer/validate', payload, { responseType: 'text' }).pipe(
			map((response: string) => {
				return response;
			}),
			catchError((error) => {
				console.error('Error en la validación del traspaso:', error);
				return throwError(() => error);
			})
		);
	}

	/*----------------------------------------- new transfer */

	listTransfers(payload: any = {}): Observable<any> {
		const url = `${this.apiUrlTransfer}/transfer/list/request`;
		return this.http.post<any>(url, payload);
	}

	getTransferTypes(): Observable<ITransferType[]> {
		return this.http.get<any>(`${environment.apiUrlTransfer}/typeTransfer/transfer/types`).pipe(
			map((response) =>
				response.data.map((item: any) => ({
					id: item.id,
					name: item.name,
					description: item.description
				}))
			)
		);
	}

	getRejectionTypes(): Observable<any> {
		return this.http.post(`${this.apiUrlTransfer}/transfer/rejection-types`, {});
	}

	rejectTransfer(payload: any): Observable<any> {
		return this.http
			.post(this.apiUrlTransfer + '/transfer/rejection-types', payload, { responseType: 'text' })
			.pipe(
				map((response: string) => {
					return response;
				}),
				catchError((error) => {
					console.error('Error al rechazar la transferencia:', error);
					return throwError(() => error);
				})
			);
	}

	approveTransfer(payload: any, transferType: number, idTransferRequest?: number): Observable<string> {
		let url = `${this.apiUrlTransfer}/transfer/edit`;

		if (transferType === 3 || transferType === 4) {
			url += `/${idTransferRequest}`;
		}

		return this.http.put(url, payload, {
			headers: { 'Content-Type': 'application/json' },
			responseType: 'text'
		});
	}

	getTransferHistory(): Observable<any> {
		const url = `${this.apiUrlTransfer}/transfer/history`;
		const headers = new HttpHeaders({
			Accept: 'application/json'
		});

		return this.http.get<any>(url, { headers });
	}

	addTransferObservation(payload: any): Observable<any> {
		const url = `${this.apiUrlTransfer}/transfer/observation-types`;
		return this.http.post<any>(url, payload);
	}

	public preApproveTransfer(id: number) {
		return this.http.post(`${this.apiUrlTransfer}/transfer/request/accept`, { id });
	}

	getTransferRequestByType(transferType: number): Observable<any> {
		const url = `${this.apiUrlTransfer}/transfer/request/by-type?transferType=${transferType}`;
		return this.http.get<any>(url).pipe(
			map((response) => response.data || response),
			catchError((error) => {
				console.error('Error al obtener transferencias por tipo:', error);
				return throwError(() => error);
			})
		);
	}

	reactivatePostLiquidation(payload: { idSponsor: number; idUser: number }): Observable<any> {
		return this.http.post(`${this.apiUrlTransfer}/jobstatus/reactivatePostLiquidation`, payload);
	}
}
