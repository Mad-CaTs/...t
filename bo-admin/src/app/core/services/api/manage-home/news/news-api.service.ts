import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';

import type { INew, INewDto, ITableNewDto, ITableResponse } from '@interfaces/api';
import type { IResponseData } from '@interfaces/globals.interface';

import { HttpClient } from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})
export class NewsApiService {
	private readonly BASE = 'https://scheduleapi-dev.inclub.world/api/v1';

	constructor(private client: HttpClient) {}

	public fetchCreate(dto: INewDto) {
		return this.client.post<IResponseData<unknown>>(`${this.BASE}/news/create`, dto);
	}

	public fetchUpdate(id: number, dto: Partial<INewDto>) {
		return this.client.put<IResponseData<unknown>>(`${this.BASE}/news/${id}`, dto);
	}

	public fetchGetById(id: number) {
		return this.client.get<IResponseData<INew>>(`${this.BASE}/news/${id}`);
	}

	public fetchTable(dto: ITableNewDto) {
		let URL = `${this.BASE}/news/paginated?page=${dto.page}&size=${dto.size}`;

		if (dto.title) URL += `&title=${dto.title}`;

		return this.client.get<IResponseData<ITableResponse<INew>>>(URL);
	}
}
