import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable, map } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class TransferLiquidationService {
	private urlAdmin = environment.URL_ADMIN;
	private urlTransfer = '/api/v1';

	constructor(private http: HttpClient) {}

  getUsersByFilter(search: string): Observable<any> {
		return this.http.get<any>(`${this.urlAdmin}/user/search/${search}`).pipe(
			map((response: any) => {
				return response;
			})
		);
  }

  getSuscriptionByIdUser(iduser: string): Observable<any> {
		return this.http.get<any>(`${this.urlAdmin}/suscription/view/user/${iduser}`).pipe(
			map((response: any) => {
				return response;
			})
		);
  }

  getSponsorByUser(iduser: string): Observable<any> {
	return this.http.get<any>(`${this.urlAdmin}/user/sponsor/${iduser}`).pipe(
		map((response: any) => {
			return response;
		})
	);
  }

  getTypeTransfer(): Observable<any> {
	return this.http.get<any>(`${this.urlTransfer}/typeTransfer/getAll`).pipe(
		map((response: any) => {
			return response;
		})
	);
  }

  saveTransfer(body: any): Observable<any> {
	return this.http.post<any>(`${this.urlTransfer}/transfer/save`, body);
  }

  saveNewUser(body: any): Observable<any> {
	return this.http.post<any>(`${this.urlTransfer}/transfer/saveUser`, body);
  }

  getReasonLiquidation(): Observable<any> {
	return this.http.get<any>(`${this.urlTransfer}/reasonLiquidation/getAll`).pipe(
		map((response: any) => {
			return response;
		})
	);
  }

  getOptionReturnMoney(): Observable<any> {
	return this.http.get<any>(`${this.urlTransfer}/optionReturnMoney/getAll`).pipe(
		map((response: any) => {
			return response;
		})
	);
  }

  saveLiquidation(body: any): Observable<any> {
	return this.http.post<any>(`${this.urlTransfer}/liquidation/save`, body);
  }

}
