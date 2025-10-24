import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { IMulticodeData, ITransferUserData } from '../../interfaces';

@Injectable({
	providedIn: 'root'
})
export class TransferService {
	private apiUrl = environment.URL_API_TRANSFER;
	 private apiUrlAccount = environment.URL_ACCOUNT

	constructor(private http: HttpClient) {}

	submitTransfer(payload: any): Observable<any> {
		return this.http.post(`${this.apiUrl}/transfer/request`, payload);
	}

	getTransferTypes(): Observable<any[]> {
		return this.http
			.get<{ result: boolean; data: any[] }>(`${this.apiUrl}/typeTransfer/transfer/types?=null`)
			.pipe(map((res) => res.data));
	}

	getTransferTypesByUser(
		idUser: number,
		requestedType: number
	): Observable<{ result: boolean; message: string; data: any[] }> {
		const params = new HttpParams().set('idUser', idUser).set('requestedType', requestedType);

		return this.http.get<{ result: boolean; message: string; data: any[] }>(
			`${this.apiUrl}/typeTransfer/transfer/types`,
			{ params }
		);
	}

	getTransferListByUser(idUser: number, transferType: number) {
		const params = new HttpParams().set('idUser', idUser).set('transferType', transferType);

		return this.http
			.get<{ data: ITransferUserData }>(`${this.apiUrl}/transfer/listTransferUser`, { params })
			.pipe(map((res) => res.data));
	}

	getSponsorByMulticode(idMulticode: number): Observable<IMulticodeData[]> {
		return this.http
			.get<{ result: boolean; data: IMulticodeData[] }>(
				`${this.apiUrl}/transfer/multicodes/${idMulticode}`
			)
			.pipe(map((res) => res.data));
	}

	getSubscriptionsByUsername(username: string): Observable<any[]> {
		return this.http
			.get<{ result: boolean; data: any[] }>(`${this.apiUrl}/transfer/subscriptions`, {
				params: { username }
			})
			.pipe(map((res) => res.data));
	}

	getTransferRequest(id: number): Observable<any> {
		return this.http.get<any>(`${this.apiUrl}/transfer/request/${id}`);
	}

	uploadDocuments(files: File[], folderNumber: number): Observable<any> {
		const formData = new FormData();
		files.forEach((file) => {
			formData.append('file', file, file.name);
		});
		formData.append('folderNumber', folderNumber.toString());
		return this.http.post<any>(`${this.apiUrl}/documents/upload`, formData);
	}

	getTransferListBySponsor(transferType: number, sponsorUsername: string) {
		const params = new HttpParams()
			.set('transferType', transferType)
			.set('sponsorUsername', sponsorUsername);

		return this.http
			.get<{ data: any[] }>(`${this.apiUrl}/transfer/listTransferUser`, { params })
			.pipe(map((res) => res.data));
	}
	registerAccountTransfer(payload: any): Observable<any> {
	return this.http.post(`${this.apiUrlAccount}/account/register/transfer?registrationType=2`, payload);
}


/* 	registerAccountTransfer(payload: any): Observable<any> {
		return this.http.post(`${this.apiUrl}/transfer/registerAccountTransfer`, payload);
	} */

	getTransferListForExistingUser(username: string): Observable<any> {
		const url = `${this.apiUrl}/transfer/user/by-username`;
		return this.http.get(url, { params: { username } });
	}
}
