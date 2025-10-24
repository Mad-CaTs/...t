import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from '@environments/environment';
import {
	ILegalizationRate,
	ILegalizationRateFilter
} from '../../../my-products/pages/documents/pages/validate-documents/commons/interfaces';
import { ISelect } from '@shared/interfaces/forms-control';

@Injectable({
	providedIn: 'root'
})
export class LegalizationService {
	private url = environment.URL_API_LEGAL;

	constructor(private http: HttpClient) {}

	getDocumentCategories(): Observable<any[]> {
		return this.http.get<any>(`${this.url}/document/categories/20`).pipe(
			map((response: any) => {
				return response.data.map((categoriesOption: any) => {
					return {
						value: categoriesOption.categorieItemId,
						content: categoriesOption.categorieItemName
					};
				});
			})
		);
	}

	getLegalizationDocumentTypes(): Observable<any[]> {
		return this.http.get<any>(`${this.url}/document/categories/10`).pipe(
			map((response) => {
				const data = response.data;
				return data.map((item) => ({
					content: item.categorieItemName,
					value: item.categorieItemId
				}));
			})
		);
	}
	getFilteredRate(filter: ILegalizationRateFilter): Observable<ILegalizationRate | null> {
		return this.http
			.get<{ data: ILegalizationRate[] }>(`${this.url}/document/rates/type`, {
				params: {
					legalizationType: filter.legalizationType,
					documentType: filter.documentType,
					userLocalUbic: filter.userLocalUbic
				}
			})
			.pipe(
				map((res) => res.data?.[0] ?? null),
				catchError((err) => throwError(() => err))
			);
	}

	submitLegalizationRequest(payload: any, solicitudId: number): Observable<any> {
		return this.http.post<any>(`${this.url}/document/add/solicitud/${solicitudId}`, payload).pipe(
			map((response) => response),
			catchError((error) => {
				console.error('Error al registrar la solicitud:', error);
				return throwError(() => error);
			})
		);
	}

	getShippingCost(userLocalUbic: number, legalizationType: number): Observable<any> {
		return this.http
			.get<any>(
				`${this.url}/shipping/cost?userLocalUbic=${userLocalUbic}&legalizationType=${legalizationType}`
			)
			.pipe(
				map((response: any) => response),
				catchError((error) => {
					console.error('Error al obtener el costo de envío:', error);
					return throwError(() => error);
				})
			);
	}

	getLegalizationTypes(): Observable<ISelect[]> {
		return this.http.get<any>(`${this.url}/document/categories/by-name/LEGALIZATION_TYPE`).pipe(
			map((response) =>
				response.data.map((item) => ({
					value: item.categorieItemId,
					content: item.categorieItemNameFront
				}))
			)
		);
	}

	getDocumentTypes(): Observable<ISelect[]> {
		return this.http.get<any>(`${this.url}/document/categories/by-name/DOCUMENT_GENERAL_TYPE`).pipe(
			map((res) =>
				res.data.map((item: any) => ({
					value: item.categorieItemId,
					content: item.categorieItemNameFront
				}))
			)
		);
	}


	getApostilladoMonto(): Observable<{ monto: number; moneda: string }> {
		return this.http
			.get<{ monto: number; moneda: string }>(`${this.url}/document/options/apostillado-costo`)
			.pipe(
				catchError((error) => {
					console.error('Error al obtener el monto del apostillado:', error);
					return throwError(() => error);
				})
			);
	}
}
