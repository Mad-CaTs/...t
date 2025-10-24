import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { GenericCrudService } from './generic-crud.service';
import { HttpParams } from '@angular/common/http';

export interface ValidateDiscountPayload {
	userId: number | string;
	code: string;
}

export interface ValidateDiscountRequest {
	userId: number | string | null;
	userdniId: number | string;
	code: string;
	type: 'PROMOTER' | 'GENERAL' | string;
}

export interface CheckDiscountResponse {

	code?: string;
	status?: 'exists' | 'not_found' | string;
	message?: string;
	discountPercentage?: number;
	data?: any;
}

@Injectable({ providedIn: 'root' })
export class EventDiscountService extends GenericCrudService<any> {
	protected override endpoint = 'api/v1/discounts';

	constructor(protected override http: HttpClient) {
		super(http);
	}

	check(code: string, type?: 'PROMOTER' | 'GENERAL' | string): Observable<CheckDiscountResponse> {
		let params = new HttpParams().set('code', code);
		if (type) params = params.set('type', type);
		return this.http.get<CheckDiscountResponse>(`${this.baseUrl}/check`, { params });
	}

		validate(body: ValidateDiscountRequest): Observable<CheckDiscountResponse> {
			return this.http.post<CheckDiscountResponse>(`${this.baseUrl}/validate`, body);
		}
}

