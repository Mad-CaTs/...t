import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { map, Observable } from 'rxjs';
import {
	PasswordChangeRequest,
	PasswordRecoveryRequest,
	TokenGenerationResult,
	TokenRequest,
	TokenValidationResult
} from '../interfaces/recovery.interface';

@Injectable({
	providedIn: 'root'
})
export class RecoveryService {
	private apiUrl = environment.URL_GATEWEY;

	private _http: HttpClient = inject(HttpClient);

	sendRecoveryToken(request: PasswordRecoveryRequest): Observable<TokenGenerationResult> {
		return this._http
			.post<TokenGenerationResult>(`${this.apiUrl}/auth/password/recovery`, request)
			.pipe(map((response: any) => response.data));
	}

	validateToken(request: TokenRequest): Observable<TokenValidationResult> {
		return this._http
			.post<TokenValidationResult>(`${this.apiUrl}/auth/password/validate/token`, request)
			.pipe(map((response: any) => response.data));
	}

	changePassword(request: PasswordChangeRequest): Observable<TokenValidationResult> {
		return this._http
			.post<TokenValidationResult>(`${this.apiUrl}/auth/password/change`, request)
			.pipe(map((response: any) => response.data));
	}
}
