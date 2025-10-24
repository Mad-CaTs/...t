import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable, catchError, map, throwError } from 'rxjs';
import {
	IUserRequest,
	IWalletGenerateToken,
	IWalletRegisterTransferWallet,
	IWalletValidatePassword,
	IWalletValidateUsernameAndAmount
} from '../../commons/interfaces/wallet.interface';

@Injectable({
	providedIn: 'root'
})
export class WalletService {
	private urlWallet = '/api/v1';
	httpClient: any;
	private urlWalletDirecto = environment.URL_WALLET

	constructor(private http: HttpClient) { }

	getWalletById(id: number): Observable<any> {
		return this.http.get<any>(`${this.urlWallet}/wallet/user/${id}`).pipe(
			map((response: any) => {
				return response.data;
			})
		);
	}

	getWalletPayLaterById(id: number): Observable<any> {
		return this.http.get<any>(`${this.urlWalletDirecto}/wallet/user/${id}`).pipe(
			map((response: any) => {
				return response.data;
			})
		);
	}

	

	getAllListWalletById(id: number, page: number, size: number): Observable<any> {
		return this.http.get<any>(`${this.urlWallet}/wallettransaction/list/${id}?page=${page}&size=${size}`).pipe(
			map((response: any) => {
				return response;
			})
		);
	}

	/* 	getAllListWalletById(id: number): Observable<any> {
			return this.http.get<any>(`${this.urlWallet}/wallettransaction/list/${id}`).pipe(
				map((response: any) => {
					return response.data;
				})
			);
		} */
	postValidateUsername(data: { username: string, password: string }): Observable<any> {
		return this.http.post<any>(`${this.urlWallet}/account/within/validate-password`, data).pipe(
			map(response => response.data),
			catchError((error: any) => {
				return throwError(error);
			})
		);
	}


	/* 	postValidateUsername(body: IWalletValidateUsernameAndAmount): Observable<any> {
			return this.http.post<any>(`${this.urlWallet}/wallet/transaction/validate`, body);
		} */

	postValidatePassword(data: IUserRequest): Observable<any> {
		return this.http.post<any>(
			`/api/v1/account/within/validate-password`,
			data
		);
	}

	postGenerateToken(body: IWalletGenerateToken): Observable<any> {
		return this.http.post<any>(`${this.urlWallet}/tokenwallet/create`, body);
	}

	postRegisterTransferWallet(body: IWalletRegisterTransferWallet): Observable<any> {
		return this.http.post<any>(`${this.urlWallet}/wallettransaction/transfer`, body);
	}

	getHistoryElectronicWallet(id: number): Observable<any> {
		return this.http.get<any>(`${this.urlWallet}/withdrawalrequest/electronicpurse/user/${id}`).pipe(
			map((response: any) => {
				return response.data;
			})
		);
	}

	getElectronicPurse(id: number): Observable<any> {
		return this.http.get<any>(`${this.urlWallet}/electronicpurse/user/${id}`).pipe(
			map((response: any) => {
				return response.data;
			})
		);
	}

	postSolicitTransfer(file: File, data: any): Observable<any> {
		if (!file || !file.name) {
			console.error('Invalid file or file name');
			return throwError('Invalid file or file name');
		}

		const formData: FormData = new FormData();
		formData.append('file', file, file.name);
		formData.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }));

		return this.http.post<any>(`${this.urlWallet}/withdrawalrequest/electronicpurse/solicit`, formData);
	}

	getHistoryBank(id: number): Observable<any> {
		return this.http.get<any>(`${this.urlWallet}/withdrawalrequest/accountbank/user/${id}`).pipe(
			map((response: any) => {
				return response.data;
			})
		);
	}

	getAccountBank(id: number): Observable<any> {
		return this.http.get<any>(`${this.urlWallet}/accountbank/user/${id}`).pipe(
			map((response: any) => {
				return response.data;
			})
		);
	}

	postSolicitTransferBank(file: File, data: any): Observable<any> {
		if (!file || !file.name) {
			console.error('Invalid file or file name');
			return throwError('Invalid file or file name');
		}

		const formData: FormData = new FormData();
		formData.append('file', file, file.name);
		formData.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }));

		return this.http.post<any>(`${this.urlWallet}/withdrawalrequest/accountbank/solicit`, formData);
	}

}
