import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';

import type { IResponseData } from '@interfaces/globals.interface';
import type { ITool, IToolDto } from '@interfaces/api';

import { HttpClient } from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})
export class ToolApiService {
	private readonly BASE = environment.CommonApi;

	constructor(private readonly client: HttpClient) {}

	public fetchGet(investmentId: number) {
		return this.client.get<IResponseData<ITool[]>>(`${this.BASE}/educational?investment=${investmentId}`);
	}

	public fetchGetById(id: number) {
		return this.client.get<IResponseData<ITool>>(`${this.BASE}/educational/${id}`);
	}

	public fetchCreate(dto: IToolDto) {
		return this.client.post<IResponseData<unknown>>(`${this.BASE}/educational`, dto);
	}

	public fetchUpdate(id: number, dto: Partial<IToolDto>) {
		return this.client.put<IResponseData<unknown>>(`${this.BASE}/educational/${id}`, dto);
	}

	public fetchDelete(id: number) {
		return this.client.delete<IResponseData<unknown>>(`${this.BASE}/educational/${id}`);
	}
}
