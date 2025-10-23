import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';

import type { IResponseData } from '@interfaces/globals.interface';
import type { IFamilyDto, IPackageDetailDto, IPackageDto } from '@interfaces/api';

import { HttpClient } from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})
export class PackagesApiService {
	private readonly BASE = environment.SubscriptionApi;

	constructor(private client: HttpClient) {}

	public fetchFamily(id: number) {
		return this.client.get<IResponseData<unknown>>(`${this.BASE}/family-packages/${id}`);
	}

	public fetchFamilyCreate(body: IFamilyDto) {
		return this.client.post<IResponseData<unknown>>(`${this.BASE}/family-packages`, body);
	}

	public fetchFamilyUpdate(id: number, body: Partial<IFamilyDto>) {
		return this.client.put<IResponseData<unknown>>(`${this.BASE}/family-packages/${id}`, body);
	}

	public fetchPackageCreate(body: IPackageDto) {
		return this.client.post<IResponseData<unknown>>(`${this.BASE}/packages`, body);
	}

	public fetchPackageUpdate(id: number, body: Partial<IPackageDto>) {
		return this.client.put<IResponseData<unknown>>(`${this.BASE}/packages/${id}`, body);
	}

	public fetchDetailCreate(body: IPackageDetailDto) {
		return this.client.post<IResponseData<unknown>>(`${this.BASE}/package-details`, body);
	}

	public fetchDetailUpdate(id: number, body: Partial<IPackageDetailDto>) {
		return this.client.put<IResponseData<unknown>>(`${this.BASE}/package-details/${id}`, body);
	}
}
