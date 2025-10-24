import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	private url = environment.URL_ADMIN;
	private apiGateway = environment.URL_GATEWEY;
	private apiUrlLogin = `${this.apiGateway}/auth/login`;
	private apiUrlLogout = `${this.apiGateway}/auth/logout`;
	private apiUrlUser = (username: string) => `${this.apiGateway}/account/user/${encodeURIComponent(username)}`;

	constructor(private http: HttpClient) {}

	getCompanyData(): Observable<any> {
		return this.http.get<any>(`${this.url}/master/company`);
	}

	login(username: string, password: string): Observable<any> {
		return this.http.post(this.apiUrlLogin, { username, password });
	}

	getUser(username: string): Observable<any> {
		return this.http.get(this.apiUrlUser(username));
	}

	logout(): Observable<any> {
		return this.http.post(this.apiUrlLogout, {});

	}
}
