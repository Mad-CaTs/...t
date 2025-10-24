import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, tap } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class NewPartnerContactInfoService {
	private url = '/admin';
	constructor(private http: HttpClient) {}

/* 	getCivilstatus(): Observable<any> {
		return this.http.get<any>(`${this.url}/civilstatus/`).pipe(
			map((civilStatus) =>
				civilStatus.map((status) => {
					return { content: status.name, value: status.id };
				})
			)
		);
	} */
}
