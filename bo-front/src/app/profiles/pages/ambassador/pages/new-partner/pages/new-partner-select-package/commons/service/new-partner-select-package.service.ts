import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable, map } from 'rxjs';
import { ListResponse } from 'src/app/authentication/commons/interfaces/authenticate.interface';
import { PackageToTransfer } from '../interfaces/new-partner-select-package';
import { CountryType } from '../../../new-partner-payment/commons/enums';
import { Router } from '@angular/router';

@Injectable({
	providedIn: 'root'
})
export class NewPartnerSelectPackageService {
	private url = environment.URL_ADMIN;
	private urlGateway = environment.URL_GATEWEY;

	constructor(
		private http: HttpClient,
		private route: Router
	) { }

	/* 	getFamilyPackage(): Observable<any> {
			return this.http.get<any[]>(`${this.url}/familypackage/package/detail/version/state/true`).pipe(
				map((family) => {
					return family.map((family) => {
						family.packageList.forEach((sub) => {
							sub.content = sub.description;
							sub.value = sub.idFamilyPackage;
						});
						return family;
					});
				})
			);
		} */

	getFamilyPackage(isForeigner?: boolean): Observable<any> {
		let url = `${this.url}/familypackage/package/detail/version/state/true`;

		if (isForeigner !== undefined) {
			url += `?isForeigner=${isForeigner}`;
		} else if (this.route.url === '/profile/ambassador/store') {
			url += `?isForeigner=${false}`;
		}

		return this.http.get<any>(url).pipe(
			map((response: any) => {
				if (!response || !response.data) {
					return [];
				}
				
				return response.data.map((familyPackage: any) => {
					familyPackage.packageList.forEach((subPackage) => {
						subPackage.content = subPackage.description;
						subPackage.value = subPackage.idFamilyPackage;
					});
					return familyPackage;
				});
			})
		);
	}

	getFamilyPackageByCountry(idCountry: number): Observable<any> {		
		const isPeruSelected = idCountry === CountryType.PERU;

		if (isPeruSelected) {
			return this.getFamilyPackage(false);
		} else {
			return this.getFamilyPackage();
		}
	}

	getFamilyByPackageId(packageId: number): Observable<any> {
		return this.getFamilyPackage().pipe(
			map((familyPackages: any[]) => {
				const foundPackage = familyPackages.find(family => family.packageList.some(subPackage => subPackage.idPackage === packageId));
				return foundPackage;
			})
		);
	}

	getValidSubscriptions(
		registerType: number,
		idParent: number
	): Observable<ListResponse<PackageToTransfer>> {
		return this.http.get<ListResponse<PackageToTransfer>>(
			`${this.urlGateway}/membership/multi-code/valid-subscriptions`,
			{
				params: {
					'register-type': registerType,
					'id-parent': idParent
				}
			}
		);
	}
}
