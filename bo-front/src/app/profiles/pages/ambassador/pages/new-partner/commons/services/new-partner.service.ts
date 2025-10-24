import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable, catchError, map, tap, throwError } from 'rxjs';
import { IRequestFixDataService, ValidationMultiCodeResponse } from '../interfaces/new-partner.interface';
import { SingleResponse } from 'src/app/authentication/commons/interfaces/authenticate.interface';

@Injectable({
	providedIn: 'root'
})
export class NewPartnerService {
	private apiUrl = '/api/v1';
	private urlAdmin = environment.URL_ADMIN;
	private urlGateway = environment.URL_GATEWEY;
	private urlaccount = environment.URL_ACCOUNT;
	private urlShip = environment.URL_API_PAYMENT;

	constructor(private http: HttpClient) { }

	createNewParner(body): Observable<any> {
		return this.http.post<any>(`${this.urlGateway}/membership`, body);
	}

	getCountriesList(): Observable<any> {
		return this.http.get<any>(`${this.urlAdmin}/country/`).pipe(
			map((paises) =>
				paises.data.map((pais) => {
					return { content: pais.nicename, value: pais.idCountry, ...pais };
				})
			)
		);
	}


	checkDocument(nroDocument: string, idDocumentType: number, idNationality: number): Observable<boolean> {
		return this.http.get<boolean>(
			`${this.urlaccount}/account/validate-account-nrodocument?nroDocument=${nroDocument}&document-type=${idDocumentType}&country-code=${idNationality}`
		);
	}

	validateIsParentAndCanCreateChild(idSponsor: number): Observable<SingleResponse<ValidationMultiCodeResponse>> {
		return this.http.get<SingleResponse<ValidationMultiCodeResponse>>(`${this.urlaccount}/account/multi-account/validate/${idSponsor}`);
	}

	checkEmail(email: string): Observable<boolean> {
		return this.http.get<boolean>(`${this.urlaccount}/account/validate-account-email?email=${email}`);
	}

	validateUserId(id: number): Observable<boolean> {
		const url = `${this.urlAdmin}/user/exists/${id}`;
		/*   const url = `${this.urlAdmin}/user/exists/4533`;  */
		return this.http.get<boolean>(url);
	}

	formatDate(dateInput: number[] | string | Date | null | undefined): string {
		try {
			if (!dateInput) return '';
			if (Array.isArray(dateInput)) {
				if (dateInput.length < 3) return '';
				const [year, month, day, hour = 0, minute = 0, second = 0] = dateInput.map((v) => Number(v));
				if (!year || !month || !day) return '';
				const d = new Date(Date.UTC(year, month - 1, day, hour, minute, second));
				if (isNaN(d.getTime())) return '';
				return d.toISOString().split('.')[0];
			}
			if (typeof dateInput === 'string') {
				const d = new Date(dateInput);
				if (isNaN(d.getTime())) return '';
				return d.toISOString().split('.')[0];
			}
			// Objeto Date
			if (dateInput instanceof Date) {
				if (isNaN(dateInput.getTime())) return '';
				return dateInput.toISOString().split('.')[0];
			}
			return '';
		} catch (_) {
			return '';
		}
	}

	getUserByUsername(username: string): Observable<IRequestFixDataService> {
		return this.http.get<any>(`${this.urlAdmin}/user/username/${username}`).pipe(
			map((response) => {
				if (!response) {
					throw new Error('Invalid response structure');
				}
				return {
					idUser: response.idUser,
					name: response.name,
					lastName: response.lastName,
					birthdate: this.formatDate(response.birthdate),
					gender: response.gender,
					idNationality: response.idNationality,
					email: response.email,
					nroDocument: response.nroDocument,
					districtAddress: response.districtAddress,
					address: response.address,
					userName: response.userName,
					password: response.password ? response.password : null,
					idResidenceCountry: response.idResidenceCountry,
					civilState: response.civilState,
					boolDelete: response.boolDelete,
					nroPhone: response.nroPhone,
					idDocument: response.idDocument,
					idState: response.idState,
					createDate: this.formatDate(response.createDate),
					profilePicture: response.profilePicture,
					code: response.code,
					idLocation: response.idLocation ?? response.id_location ?? null
				} as IRequestFixDataService;
			})
		);
	}

	modifyUser(username: string, userData: any): Observable<any> {
		const url = `${this.urlAdmin}/user/edit/${username}`;
		return this.http.put<any>(url, userData).pipe(
			catchError((error) => {
				console.error('Error modifying user:', error);
				return throwError(() => new Error('Error modifying user'));
			})
		);
	}

}
