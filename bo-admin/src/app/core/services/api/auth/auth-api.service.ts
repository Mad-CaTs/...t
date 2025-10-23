import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';

import type { ILoginDto, ILoginResponse } from '@interfaces/api';
import type { IResponseData } from '@interfaces/globals.interface';

import { HttpClient } from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})
export class AuthApiService {
	private readonly BASE = environment.api;

	constructor(private client: HttpClient) {}

	public fetchLogin(dto: ILoginDto) {
		return this.client.post<ILoginResponse>(`${this.BASE}/login`, dto);
	}
}
