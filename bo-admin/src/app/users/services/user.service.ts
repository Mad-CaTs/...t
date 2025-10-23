import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
	ICivilStatus,
	ICountry,
	IDocumentType,
	IRequestFixDataService,
	IRequestSearchUser
} from '@interfaces/users.interface';
import { catchError, map, shareReplay, tap } from 'rxjs/operators';
import { ISelectOpt } from '@interfaces/form-control.interface';
import { IPaginationPartner } from '@interfaces/paginatorPartner';
import { PartnerListDetail } from '@interfaces/partnetListDetail';
import { RangoPartnerList } from '@interfaces/rangoPartner';
import { IPaginationSponsors, SponsorsAdvanceResponseRaw } from '@interfaces/paginationSponsors';
import { SponsorsListDetail } from '@interfaces/sponsorsListDetail';

@Injectable({
	providedIn: 'root'
})
export class UserService {
	private readonly API = environment.api;
	private apiUrl = `${this.API}/api/`;
	private jobstatusapi = environment.jobstatusapi;
	private apiThree = environment.apiTree;
	private readonly DEFAULT_ID_STATE = 30004;

	constructor(private http: HttpClient) {}

	getUserByUsername(username: string): Observable<IRequestFixDataService> {
		return this.http.get<any>(`${this.apiUrl}user/username/${username}`).pipe(
			map((response) => {
				// Validación
				if (!response) {
					throw new Error('Invalid response structure');
				}

				return {
					idUser: response.idUser,
					name: response.name,
					lastName: response.lastName,
					birthdate: response.birthdate,
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
					id_location: response.id_location
				} as IRequestFixDataService;
			})
		);
	}

	getUsersByUsernameAndFullname(search: string): Observable<IRequestSearchUser[]> {
		return this.http.get<IRequestSearchUser[]>(`${this.apiUrl}user/search/${search}`).pipe(
			map((response) => {
				if (!response || response.length === 0) {
					throw new Error('No users found');
				}
				return response.map((user) => ({
					idUser: user.idUser,
					username: user.username,
					creationDate: user.creationDate,
					documentNumber: user.documentNumber,
					name: user.name,
					gender: user.gender,
					lastName: user.lastName,
					email: user.email,
					cellPhone: user.cellPhone,
					state: user.state,
					idTypeDocument: user.idTypeDocument,
					address: user.address,
					districtAddress: user.districtAddress,
					idResidenceCountry: user.idResidenceCountry,
					country: user.country
				}));
			})
		);
	}

	getAllCountries(): Observable<ICountry[]> {
		return this.http.get<any>(`${this.apiUrl}country/`).pipe(
			map((response) => {
				if (!response || !response.result || !Array.isArray(response.data)) {
					throw new Error('Invalid response structure');
				}

				return response.data.map((country: any) => ({
					idCountry: country.idCountry,
					iso: country.iso,
					countrydesc: country.countrydesc,
					nicename: country.nicename,
					iso3: country.iso3,
					numcode: country.numcode,
					phonecode: country.phonecode,
					symbol: country.symbol,
					courtesy: country.courtesy,
					icon: country.icon
				})) as ICountry[];
			})
		);
	}

	getAllCivilStatus(): Observable<ICivilStatus[]> {
		return this.http.get<any>(`${this.apiUrl}civilstatus/`).pipe(
			map((response) => {
				if (!response || !response.result || !Array.isArray(response.data)) {
					throw new Error('Invalid response structure');
				}

				return response.data.map((status: any) => ({
					idCivilStatus: status.idCivilStatus,
					description: status.description
				})) as ICivilStatus[];
			})
		);
	}

	getDocumentsTypebyCountry(idCountry: string): Observable<IDocumentType[]> {
		return this.http.get<any>(`${this.apiUrl}documenttype/country/${idCountry}`).pipe(
			map((response) => {
				if (!response.result || !response.data) {
					throw new Error('Invalid response structure');
				}
				return response.data.map((doc: any) => ({
					idDocumentType: doc.idDocumentType,
					name: doc.name,
					origin: doc.origin,
					idCountry: doc.idCountry
				})) as IDocumentType[];
			}),
			catchError((error) => {
				console.error('Error fetching document types:', error);
				return throwError(() => new Error('Error fetching document types'));
			})
		);
	}

	modifyUser(username: string, userData: any): Observable<any> {
		const url = `${this.apiUrl}user/edit/${username}`;
		return this.http.put<any>(url, userData).pipe(
			catchError((error) => {
				console.error('Error modifying user:', error);
				return throwError(() => new Error('Error modifying user'));
			})
		);
	}

	getUsersByFilter(
		username: string,
		state: string,
		familyPackage: string,
		packageDetail: string,
		typeUser: string
	): Observable<any[]> {
		const url = `${this.apiUrl}user/getListUsersOfAdmin/search`;
		const body = {
			username,
			state,
			familyPackage,
			packageDetail,
			typeUser
		};

		return this.http.post<any[]>(url, body);
	}

	getAllStates(): Observable<any[]> {
		const url = `${this.apiUrl}state/`;
		return this.http.get<any>(url).pipe(
			map((response) => {
				if (!response || !response.result || !Array.isArray(response.data)) {
					throw new Error('Invalid response structure');
				}
				return response.data;
			}),
			catchError((error) => {
				console.error('Error fetching states:', error);
				return [];
			})
		);
	}

	getAllFamilyPackages(): Observable<any[]> {
		const url = `${this.apiUrl}familypackage/all`;
		return this.http.get<any>(url).pipe(
			map((response) => {
				if (!response || !response.result || !Array.isArray(response.data)) {
					throw new Error('Invalid response structure');
				}
				return response.data;
			}),
			catchError((error) => {
				console.error('Error fetching family packages:', error);
				return [];
			})
		);
	}

	getPackagesByFamilyPackage(familyPackage: string): Observable<any[]> {
		const url = `${this.apiUrl}package/` + familyPackage + `/family`;
		return this.http.get<any>(url).pipe(
			map((response) => {
				if (!response || !response.result || !Array.isArray(response.data)) {
					throw new Error('Invalid response structure');
				}
				return response.data;
			}),
			catchError((error) => {
				console.error('Error fetching packages:', error);
				return [];
			})
		);
	}

	getSuscriptionsByUserViewAdmin(idUser: string): Observable<any[]> {
		const url = `${this.apiUrl}suscription/user/` + idUser;
		return this.http.get<any>(url).pipe(
			map((response) => {
				return response;
			}),
			catchError((error) => {
				console.error('Error fetching packages:', error);
				return [];
			})
		);
	}

	getDocumentTypeById(idDocument: string): Observable<any> {
		const url = `${this.apiUrl}documenttype/` + idDocument;
		return this.http.get<any>(url).pipe(
			map((response) => {
				return response;
			}),
			catchError((error) => {
				console.error('Error fetching document type:', error);
				return [];
			})
		);
	}

	calculateStatusUserAndSuscriptions(id: string): Observable<string> {
		const url = `${this.apiUrl}user/calculate/status/${id}`;

		return this.http.put(url, {}, { responseType: 'text' }).pipe(
			map((response: string) => {
				if (response === 'Estados actualizados de suscripciones y de usuario correctamente') {
					return response;
				} else {
					throw new Error('Respuesta inesperada del servidor');
				}
			}),
			catchError((error) => of('Error al actualizar los estados'))
		);
	}

	updateJobStatus(idUser: string): Observable<string> {
		const url = `${this.jobstatusapi}/job-status/updateStatus`;
		const body = { idUser: idUser };

		return this.http
			.post(url, body, {
				headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
				observe: 'response'
			})
			.pipe(
				map((response: HttpResponse<any>) => {
					if (response.status === 200) {
						if (response.body === null || response.body === undefined) {
							return 'Estado del trabajo actualizado correctamente';
						}
						return response.body;
					} else {
						return `Error inesperado: Código de estado ${response.status}`;
					}
				}),
				catchError((error) => {
					console.error('Error al actualizar el estado del trabajo:', error);
					return of('Error al actualizar el estado del trabajo');
				})
			);
	}

	searchUsersByQuery(query: string): Observable<ISelectOpt[]> {
		if (!query || query.length < 2) {
			return of([]);
		}

		return this.getUserByUsername(query).pipe(
			map((user) => [
				{
					id: user.idUser.toString(),
					text: `${user.name} ${user.lastName}`
				}
			]),
			shareReplay({ bufferSize: 1, refCount: false }),
			catchError(() => of([]))
		);
	}

	formatDate(dateArray: number[]): string {
		if (!dateArray || dateArray.length < 3) {
			return '';
		}

		const [year, month, day, hour = 0, minute = 0, second = 0] = dateArray;
		const formattedDate = new Date(Date.UTC(year, month - 1, day, hour, minute, second));

		return formattedDate.toISOString().split('.')[0];
	}

	getListPartner(body: IPaginationPartner, page: number, size:number): Observable<any>{
		const params = this.buildParamsFromPagination(body,page,size);
		return this.http.get<any>(`${this.apiThree}/api/v1/three/listPartnersAdvanced?`, {params});
	}

	getPartnerDetails(idUser: number){
		return this.http.get<PartnerListDetail>(`${this.apiThree}/api/v1/three/listPartnersAdvanced/${idUser}/detail`);
	}

	getAllRangesSelect(): Observable<RangoPartnerList[]>{
		return this.http
			.get<{ result: boolean; data: any[] }>(`${this.apiThree}/api/v1/three/ranges/active`)
			.pipe(
			map(res => (res.data ?? []).map(r => ({
				idRange: Number(r.idRange),
				name: String(r.name)
			})))
		);
	}

	private buildParamsFromPagination(body:IPaginationPartner, page:number, size: number): HttpParams{
		const rawBranch = body.branch as unknown;
		let branch: number | undefined;

		if (rawBranch == null || rawBranch === '') {
			branch = undefined;
		} else if (typeof rawBranch === 'string') {
			const t = rawBranch.trim();
			branch = (t === '-' ? -1 : Number(t));
		} else if (typeof rawBranch === 'number') {
			branch = rawBranch;
		}

		const raw: Record<string, string | undefined> = {
			idUser: String(body.idUser),
			sponsorName: body.sponsorName?.trim() || undefined,
			partnerSearch: body.partnerSearch?.trim() || undefined,
			rangeId: body.rangeId != null ? String(body.rangeId) : undefined,
			idState: body.idState != null ? String(body.idState) : undefined,
			branch: branch != null && branch !== -1 ? String(branch) : undefined,
			page: String(page),
			size: String(size),
			//...(page != null && size != null ? { page: String(page), size: String(size) } : {})
		};

		Object.keys(raw).forEach(k => raw[k] === undefined && delete raw[k]);
		return new HttpParams({ fromObject: raw as Record<string, string> });
	}

	getListSponsors(body: IPaginationSponsors, page: number, size: number): Observable<any> {
		const params = this.buildParamasFromPaginationSponsors(body, page, size);
		return this.http.get<any>(`${this.apiThree}/api/v1/three/listSponsors`, { params });
	}

	private buildParamasFromPaginationSponsors(body: IPaginationSponsors, page: number, size: number): HttpParams {
		const rawBranch = body.branch as unknown;
		let branch: number | undefined;

		if (rawBranch == null || rawBranch === '') {
			branch = undefined;
		} else if (typeof rawBranch === 'string') {
			const t = rawBranch.trim();
			branch = (t === '-' ? -1 : Number(t));
		} else if (typeof rawBranch === 'number') {
			branch = rawBranch;
		}

		const toYMD = (d?: Date | string | null) => {
			if (!d) return undefined;
			if (typeof d === 'string') return d.trim() || undefined;
			return d.toISOString().split('T')[0];
		};

		const raw: Record<string, string | undefined> = {
			idUser: String(this.DEFAULT_ID_STATE),
			sponsorName: body.sponsorName?.trim() || undefined, 
			partnerSearch: body.partnerSearch?.trim() || undefined,
			rangeId: body.rangeId != null ? String(body.rangeId) : undefined,
			idState: body.idState != null ? String(body.idState) : undefined,  
			branch: branch != null && branch !== -1 ? String(branch) : undefined,
			startDate: toYMD(body.starDate),  
			endDate: toYMD(body.endDate),
			page: String(page),
			size: String(size),
			//...(page != null && size != null ? { page: String(page), size: String(size) } : {})
		};

		Object.keys(raw).forEach(k => raw[k] === undefined && delete raw[k]);
		return new HttpParams({ fromObject: raw as Record<string, string> });
	}

	getSponsorsDetail(
		idUser: number,
		startDate: Date | string,
		endDate: Date | string
		) {
		const toYMD = (d: Date | string) => {
			if (typeof d === 'string') return d.trim();
			const pad = (n: number) => String(n).padStart(2, '0');
			return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
		};

		const params = new HttpParams()
			.set('startDate', toYMD(startDate))
			.set('endDate', toYMD(endDate));

		return this.http.get<SponsorsListDetail>(`${this.apiUrl}user/affiliateStats/${idUser}`, { params });
	}

	exportListSponsorsExcel(body: {
		idUser: number;
		sponsorName?: string;
		partnerSearch?: string;
		rangeId?: number;
		idState?: number;
		startDate?: string | Date | null;
		endDate?: string | Date | null;
	}) {
		const toYMD = (d?: Date | string | null) => {
			if (!d) return undefined;
			if (typeof d === 'string') return d.trim() || undefined;
			const pad = (n: number) => String(n).padStart(2, '0');
			return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
		};

		const raw: Record<string, string | undefined> = {
			idUser: String(this.DEFAULT_ID_STATE),
			sponsorName: body.sponsorName?.trim() || undefined,
			partnerSearch: body.partnerSearch?.trim() || undefined,
			rangeId: body.rangeId != null ? String(body.rangeId) : undefined,
			idState: body.idState != null ? String(body.idState) : undefined,
			startDate: toYMD(body.startDate),
			endDate: toYMD(body.endDate),
		};
		Object.keys(raw).forEach(k => raw[k] === undefined && delete raw[k]);
		const params = new HttpParams({ fromObject: raw as Record<string, string> });

		return this.http.get(`${this.apiThree}/api/v1/three/listSponsors/export`, {
			params,
			responseType: 'blob',
			observe: 'response'
		}) as Observable<HttpResponse<Blob>>;
	}

	exportListPartnersExcel(body: {
		idUser: number;
		sponsorName?: string;
		partnerSearch?: string;
		rangeId?: number | string | null;
		idState?: number | string | null;
		branch?: number | string | null; 
	}): Observable<HttpResponse<Blob>> {

		// Normaliza branch (puede venir como string, number, '', null, etc.)
		const normalizeBranch = (v: any): number | undefined => {
			if (v === null || v === undefined || v === '') return undefined;
			const t = String(v).trim();
			if (t === '-' || t === '-1') return undefined; 
			const n = Number(t);
			return Number.isNaN(n) ? undefined : n;
		};

		const raw: Record<string, string | undefined> = {
			idUser: String(body.idUser),
			sponsorName: body.sponsorName?.trim() || undefined,
			partnerSearch: body.partnerSearch?.trim() || undefined,
			rangeId: body.rangeId != null && Number(body.rangeId) !== -1 ? String(body.rangeId) : undefined,
			idState: body.idState != null && Number(body.idState) !== -1 ? String(body.idState) : undefined,
			branch: (() => {
				const b = normalizeBranch(body.branch);
				return b !== undefined ? String(b) : undefined;
			})()
		};

		Object.keys(raw).forEach(k => raw[k] === undefined && delete raw[k]);
		const params = new HttpParams({ fromObject: raw as Record<string, string> });

		return this.http.get(`${this.apiThree}/api/v1/three/listPartnersAdvanced/export`, {
			params,
			responseType: 'blob',
			observe: 'response'
		});
	}

}
