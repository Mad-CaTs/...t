import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';

import type { IResponseData } from '@interfaces/globals.interface';
import type { IFamilyDto, IPackageDetailDto, IPackageDto, ITypeChangeDto } from '@interfaces/api';

import { HttpClient } from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})
export class ChangeTypeService {
	private readonly BASE = environment.api;

	constructor(private client: HttpClient) {}

	public fetchChanges() {
		return this.client.get<IResponseData<unknown>>(`${this.BASE}/api/exchangerate/`);
	}

	public fetchChangeCreate(body: ITypeChangeDto) {
		return this.client.post<IResponseData<unknown>>(`${this.BASE}/api/exchangerate/insert`, body);
	}
}
