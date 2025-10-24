import { Injectable } from '@angular/core';

import { environment } from '@environments/environment';


import { HttpClient } from '@angular/common/http';
import { IResponseData } from '@shared/interfaces/api-request';

@Injectable({
	providedIn: 'root'
})
export class NewApiService {
	private readonly API = environment.URL_API_CALENDAR;

	constructor(private httpClient: HttpClient) {}

/* 	public FetchRecently() {
		return this.httpClient.get<IResponseData<any>>(`${this.API}/news/recent`);
	}
 */
/* 	public FetchOne(id: number) {
		return this.httpClient.get<IResponseData<any>>(`${this.API}/news/${id}`);
	} */
}
