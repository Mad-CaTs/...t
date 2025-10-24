import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from '@environments/environment';
import { ISelect } from '@shared/interfaces/forms-control';

@Injectable({
	providedIn: 'root'
})
export class LegalizationValidateService {
	private url = environment.URL_API_LEGAL;
	private categoriesPath = `${this.url}/document/categories`;
	private optionsCategoriesPath = `${this.url}/document/options`;

	constructor(private http: HttpClient) {}

	getLegalizationMethods(): Observable<ISelect[]> {
		return this.http.get<any[]>(`${this.optionsCategoriesPath}/DISPONIBILIDAD_LEGALIZAR`).pipe(
			map((response) =>
				response.map((item) => ({
					content: item.description,
					value: item.code
				}))
			)
		);
	}

	getAvailabilityOptions(): Observable<ISelect[]> {
		return this.http.get<any[]>(`${this.optionsCategoriesPath}/DISPONIBILIDAD_TRAMITE`).pipe(
			map((response) =>
				response.map((item) => ({
					content: item.description,
					value: item.code
				}))
			)
		);
	}

	getProvinceDeliveryOptions(): Observable<ISelect[]> {
		return this.http.get<any[]>(`${this.categoriesPath}/envio-provincia`).pipe(
			map((response) =>
				response.map((item) => ({
					content: item.descripcion,
					value: item.id
				}))
			)
		);
	}

	getLocalTypeOptions(): Observable<ISelect[]> {
		return this.http.get<any>(`${this.categoriesPath}/50`).pipe(
			map((response) =>
				response.data.map((item: any) => ({
					value: item.categorieItemId,
					content: this.capitalizeEachWord(item.categorieItemName)
				}))
			),
			catchError((error) => {
				console.error('Error al obtener opciones de LOCAL_TYPE:', error);
				return throwError(() => error);
			})
		);
	}
	private capitalizeEachWord(text: string): string {
		if (!text) return '';
		return text
			.toLowerCase()
			.split(' ')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');
	}
}
