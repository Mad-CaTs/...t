import { IPaginationSponsors } from './../interfaces/paginationSponsors';
import { IPaginationPartner } from './../interfaces/paginationPartner';
import { RangoPartnetList } from './../interfaces/rangoPartnerList';
import { PartnerListDetail } from './../interfaces/partnerListDetail';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable, map, take } from 'rxjs';
import { ISponsorTree } from '../interfaces/sponsor-tree.interfaces';
import { ILeyend } from '../interfaces';
import { IPaginationListPartner } from '../interfaces/pagination';
import { SponsorsListDetail } from '../interfaces/sponsorsListDetail';
import { ApiResponse, NextPayment } from '../interfaces/nextPayment';

@Injectable({
	providedIn: 'root'
})
export class TreeService {
	private urlState = environment.URL_ADMIN;
	private apiBaseUrl = '/api/v1/pay';
	constructor(private http: HttpClient) { }

	postTreeSponsorById(body: ISponsorTree): Observable<any> {
		return this.http.post<any>(`/api/v1/three/findById`, body);
	}

	getListAllStates(): Observable<ILeyend[]> {
		return this.http.get<any>(`${this.urlState}/state/`).pipe(
			map((response) => {
				return response.data.map((state: any) => ({
					...state,
					content: state.description,
					value: state.idState
				}));
			})
		);
	}

	getListPartners(body: IPaginationListPartner, page: number, size: number): Observable<any> {
		return this.http.post<any>(`/api/v1/three/listPartners?page=${page}&size=${size}`, body).pipe(
			map((response: any) => {
				return response;
			})
		);
	}


	getPartnerDetails(idUser: number) {
		return this.http.get<PartnerListDetail>(`/api/v1/three/listPartnersAdvanced/${idUser}/detail`);
	}

	// getSponsorsDetail(idUser: number, starDate: Date | string, endDate: Date | string){
	// 	return this.http.get<SponsorsListDetail>(`${this.urlState}/api/v1/three/listPartnersAdvanced/${idUser}${starDate}${endDate}`);
	// }

	getSponsorsDetail(
		idUser: number,
		startDate: Date | string,
		endDate: Date | string
	) {
		const toYMD = (d: Date | string) => {
			if (typeof d === 'string') return d.trim();
			// Evita desfases de zona horaria (no uses toISOString() aquí)
			const pad = (n: number) => String(n).padStart(2, '0');
			return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
		};

		const params = new HttpParams()
			.set('startDate', toYMD(startDate))
			.set('endDate', toYMD(endDate));

		return this.http.get<SponsorsListDetail>(`${this.urlState}/user/affiliateStats/${idUser}`, { params });
	}

	getAllRangesSelected(): Observable<RangoPartnetList[]> {
		return this.http
			.get<{ result: boolean; data: any[] }>(`/api/v1/three/ranges/active`)
			.pipe(
				map(res => (res.data ?? []).map(r => ({
					idRange: Number(r.idRange),
					name: String(r.name)
				})))
			);
	}

	getListPartnersUpdate(body: IPaginationPartner, page: number, size: number): Observable<any> {
		const params = this.buildParamsFromPagination(body, page, size);
		return this.http.get<any>(`/api/v1/three/listPartnersAdvanced?`, { params });
	}

	getListSponsors(body: IPaginationSponsors, page: number, size: number): Observable<any> {
		const params = this.buildParamasFromPaginationSponsors(body, page, size);
		return this.http.get<any>(`/api/v1/three/listSponsors`, { params });
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
			idUser: String(body.idUser),
			sponsorSearch: body.sponsorName?.trim() || undefined,
			partnerSearch: body.partnerSearch?.trim() || undefined,
			rangeId: body.rangeId != null ? String(body.rangeId) : undefined,
			branch: branch != null && branch !== -1 ? String(branch) : undefined,
			startDate: toYMD(body.starDate),
			endDate: toYMD(body.endDate),
			page: String(page),
			size: String(size)
		};

		Object.keys(raw).forEach(k => raw[k] === undefined && delete raw[k]);
		return new HttpParams({ fromObject: raw as Record<string, string> });
	}

	private buildParamsFromPagination(body: IPaginationPartner, page: number, size: number): HttpParams {
		const rawBranch = body.branch as unknown; // puede ser number | string | null | undefined
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
		};

		Object.keys(raw).forEach(k => raw[k] === undefined && delete raw[k]);
		return new HttpParams({ fromObject: raw as Record<string, string> });
	}


	/*   sendEmail(payload: any): Observable<any> {
		const url = `${this.urlState}/email/admin/sendemail`;
		return this.http.post<any>(url, payload);
	} */
	sendEmail(payload: any): Observable<any> {
		return this.http.post(`${this.urlState}/email/admin/sendemail`, payload).pipe(
			take(1)
		);
	}


	getSubscriptionDetail(idSuscription: number): Observable<any> {
		return this.http.get<any>(`${this.apiBaseUrl}/suscription-detail/${idSuscription}`);
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
			idUser: String(body.idUser),
			sponsorName: body.sponsorName?.trim() || undefined,
			partnerSearch: body.partnerSearch?.trim() || undefined,
			rangeId: body.rangeId != null ? String(body.rangeId) : undefined,
			idState: body.idState != null ? String(body.idState) : undefined,
			startDate: toYMD(body.startDate ?? body['starDate' as any]),
			endDate: toYMD(body.endDate),
		};
		Object.keys(raw).forEach(k => raw[k] === undefined && delete raw[k]);
		const params = new HttpParams({ fromObject: raw as Record<string, string> });

		return this.http.get(`/api/v1/three/listSponsors/export`, {
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

		return this.http.get(`/api/v1/three/listPartnersAdvanced/export`, {
			params,
			responseType: 'blob',
			observe: 'response'
		});
	}

	getNextPaymentList(idSuscription: number): Observable<NextPayment> {
		const body = [idSuscription];
		return this.http.post<ApiResponse<NextPayment>>(`${this.apiBaseUrl}/next-payment`, body, {
			headers: {'Content-Type': 'application/json'}
		}).pipe(map(res => res.data));
	}


}
