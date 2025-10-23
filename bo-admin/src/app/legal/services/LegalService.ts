import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
	IGetDocumentsResponse,
	IPendingRequest,
	IPendingRequestOne,
	IDeleteStatusResponse,
	ILegalRatesResponse,
	ICycleResponse,
	ICycleSingleResponse,
	ICycle,
	IRejectReason,
	OptionDTO
} from '@interfaces/legal-module.interface';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root'
})
export class LegalService {
	//private readonly API = environment.api;
	//private readonly API = environment.apiBoRender;
	//private readonly API = environment.apiLocal;
	private readonly API = environment.apiLegal;
	private apiUrl = `${this.API}/api/v1/`;

	constructor(private http: HttpClient) {}

	getAllDocuments() {
		return this.http.get<any>(`${this.apiUrl}document/all`).pipe(
			map((response: any) => {
				return response;
			})
		);
	}

	//usar si solo se quiere recibir el array del backend
	getAllDocumentsArray(): Observable<IPendingRequestOne[]> {
		return this.http
			.get<IGetDocumentsResponse>(`${this.apiUrl}document/all`)
			.pipe(map((response) => response.data));
	}

	getDocumentsByType(documentTypeId: string) {
		return this.http.get(`${this.apiUrl}document/all/${documentTypeId}`);
	}

	/* approveDocument(payload: { userPanelId: number; documentKey: string }) {
        return this.http.post(`${this.apiUrl}document/approve`, payload, { responseType: 'text' });
    } */

	approveDocument(payload: { userPanelId: number; documentKey: string }): Observable<string> {
		return this.http.post(`${this.apiUrl}document/approve`, payload, { responseType: 'text' }).pipe(
			map((response: string) => {
				// Aquí puedes procesar el mensaje si lo necesitas
				return response;
			}),
			catchError((error) => {
				console.error('Error al aprobar el documento:', error);
				return throwError(() => error);
			})
		);
	}

	/* rejectDocument(documentKey: string, rejectionReason: string) {
        return this.http.post(`${this.apiUrl}document/reject/${documentKey}`, { rejectionReason });
    } */

	rejectDocument(
		documentKey: string,
		payload: {
			userPanelId: number;
			reasonText: string;
			reasonType: number;
		}
	): Observable<string> {
		const url = `${this.apiUrl}document/reject/${documentKey}`;
		return this.http.post(url, payload, { responseType: 'text' }).pipe(
			map((response: string) => response),
			catchError((error) => {
				console.error('Error al rechazar el documento:', error);
				return throwError(() => error);
			})
		);
	}

	//Metodo para obtener todas las solicitudes de rectificación
	getAllRectifications(documentTypeId: string = '50') {
		// Se hace la solicitud GET usando el documentTypeId dinámico 50
		return this.http.get<any>(`${this.apiUrl}document/all/${documentTypeId}`).pipe(
			map((response: any) => {
				return response;
			})
		);
	}

	//Rectificaciones
	getPickupAll(documentTypeId: string = '50'): Observable<any[]> {
		return this.http.get<any[]>(`${this.apiUrl}document/all/${documentTypeId}`).pipe(
			map((data) =>
				data.filter(
					(item) => item.status === 1 && item.legalizationType === 1
					//status= 1: pendiente, 2:aprobado ;  legalizationType: 1 Regular, 2 Express
				)
			)
		);
	}

	//metodo para vouchers de certificados pendientes
	getPendingRequestsOne(): Observable<IPendingRequest[]> {
		return this.http.get<IPendingRequest[]>('/api/v1/document/all/1').pipe(
			map((docs) =>
				docs.filter(
					(doc) => doc.status === 1 //1: pendiente, 2:aprobado
				)
			)
		);
	}

	//metodo para vouchers de contratos pendientes
	getPendingRequestsTwo(): Observable<IPendingRequest[]> {
		return this.http.get<IPendingRequest[]>('/api/v1/document/all/2').pipe(
			map((docs) =>
				docs.filter(
					(doc) => doc.status === 1 //1: pendiente, 2:aprobado
				)
			)
		);
	}

	//metodo para solicitudes de certificados
	getValidatedCertificates() {
		// return this.http.get<IPendingRequest[]>('/api/v1/document/all/101');
		return this.http.get<any>(`${this.apiUrl}document/all/101`).pipe(
			map((response: any) => {
				return response;
			})
		);
	}
	//metodo para solicitudes de contratos
	getValidatedContracts() {
		// return this.http.get<IPendingRequest[]>('/api/v1/document/all/101');
		return this.http.get<any>(`${this.apiUrl}document/all/102`).pipe(
			map((response: any) => {
				return response;
			})
		);
	}

	//http://legalapi-dev.inclub.world/api/v1/document/status/all

	getStatusAll() {
		return this.http.get<any>(`${this.apiUrl}document/status/all`).pipe(
			map((response: any) => {
				return response;
			})
		);
	}

	getStatusCodeAll() {
		return this.http.get<any>(`${this.apiUrl}document/status/legal-status-code`).pipe(
			map((response: any) => {
				return response;
			})
		);
	}

	//http://legalapi-dev.inclub.world/api/v1/document/status/edit/7

	editStatusById(
		id: number,
		payload: { color: string; name: string; detail: string; active: number }
	): Observable<string> {
		const url = `${this.apiUrl}document/status/edit/${id}`;
		return this.http.post(url, payload, { responseType: 'text' }).pipe(
			map((response: string) => response),
			catchError((error) => {
				console.error('Error al editar el status:', error);
				return throwError(() => error);
			})
		);
	}

	editStatusByIdX(id: number, payload: { color: string; description: string }): Observable<string> {
		const url = `${this.apiUrl}document/status/edit/${id}`;

		return this.http.put(url, payload, { responseType: 'text' }).pipe(
			map((response: string) => response),
			catchError((error) => {
				console.error('Error al editar el documento:', error);
				return throwError(() => error);
			})
		);
	}

	//http://legalapi-dev.inclub.world/api/v1/document/status/add
	addStatusCustom(payload: { color: string; name: string; description: string }): Observable<string> {
		const url = `${this.apiUrl}document/status/add`;
		return this.http.post(url, payload, { responseType: 'text' }).pipe(
			map((response: string) => response),
			catchError((error) => {
				console.error('Error al agregar el status:', error);
				return throwError(() => error);
			})
		);
	}

	//http://legalapi-dev.inclub.world/api/v1/document/status/delete/20
	deleteStatusById(statusId: number): Observable<any> {
		const url = `${this.apiUrl}document/status/delete/${statusId}`;
		return this.http.post(url, {}, { responseType: 'json' }).pipe(
			catchError((error) => {
				console.error('Error al eliminar el status:', error);
				return throwError(() => error);
			})
		);
	}

	deleteStatus(statusId: number): Observable<IDeleteStatusResponse> {
		const url = `${this.apiUrl}document/status/delete/${statusId}`;
		return this.http.post<IDeleteStatusResponse>(url, {}).pipe(
			catchError((error) => {
				console.error('Error al eliminar el status:', error);
				return throwError(() => error);
			})
		);
	}

	//http://legalapi-dev.inclub.world/api/v1/document/rates/all
	getAllRates(): Observable<ILegalRatesResponse> {
		const url = `${this.apiUrl}document/rates/all`;
		return this.http.get<ILegalRatesResponse>(url).pipe(
			catchError((error) => {
				console.error('Error al obtener tarifas:', error);
				return throwError(() => error);
			})
		);
	}

	//

	//http://legalapi-dev.inclub.world/api/v1/document/rates/edit
	editRate(data: {
		legalType: number;
		documentType: number;
		localType: number;
		price: number;
		status: number;
	}): Observable<any> {
		const url = `${this.apiUrl}document/rates/edit`;
		return this.http.post<any>(url, data).pipe(
			catchError((error) => {
				console.error('Error al editar tarifa:', error);
				return throwError(() => error);
			})
		);
	}

	//CRUD CRONOGRAMA NUEVO CICLO

	getAllCycles(): Observable<ICycleResponse> {
		return this.http.get<ICycleResponse>(`${this.apiUrl}ciclo/all`).pipe(
			catchError((error) => {
				console.error('Error al obtener ciclos:', error);
				return throwError(() => error);
			})
		);
	}

	getCycleById(id: number): Observable<ICycleSingleResponse> {
		return this.http.get<ICycleSingleResponse>(`${this.apiUrl}ciclo/${id}`).pipe(
			catchError((error) => {
				console.error(`Error al obtener ciclo con id ${id}:`, error);
				return throwError(() => error);
			})
		);
	}

	//agregar ciclo
	addCycle(cycle: Omit<ICycle, 'id' | 'createdAt' | 'modifiedAt'>): Observable<ICycleSingleResponse> {
		return this.http.post<ICycleSingleResponse>(`${this.apiUrl}ciclo/add`, cycle).pipe(
			catchError((error) => {
				console.error('Error al agregar ciclo:', error);
				return throwError(() => error);
			})
		);
	}

	//editar ciclo
	editCycle(
		id: number,
		cycle: Omit<ICycle, 'id' | 'createdAt' | 'modifiedAt'>
	): Observable<ICycleSingleResponse> {
		return this.http.post<ICycleSingleResponse>(`${this.apiUrl}ciclo/edit/${id}`, cycle).pipe(
			catchError((error) => {
				console.error('Error al editar ciclo:', error);
				return throwError(() => error);
			})
		);
	}

	//eliminar ciclo

	deleteCycle(id: number): Observable<ICycleSingleResponse> {
		return this.http.post<ICycleSingleResponse>(`${this.apiUrl}ciclo/delete/${id}`, {}).pipe(
			catchError((error) => {
				console.error('Error al eliminar ciclo:', error);
				return throwError(() => error);
			})
		);
	}

	getRejectReasonsx(): Observable<IRejectReason[]> {
		return this.http
			.get<any>(`${this.apiUrl}/categories/30`)
			.pipe(map((response) => response.data as IRejectReason[]));
	}

	getRejectReasons() {
		return this.http.get<any>(`${this.apiUrl}document/categories/30`);
	}

	getOptions(catalog: string): Observable<OptionDTO[]> {
		return this.http.get<OptionDTO[]>(`${this.apiUrl}document/options/${catalog}`);
	}

	changeDocumentStatus(payload: {
		userPanelId: number;
		documentKey: string;
		status: number;
		reasonType: number;
		reasonText: string;
	}): Observable<string> {
		const url = `${this.apiUrl}document/change`;
		return this.http.post(url, payload, { responseType: 'text' }).pipe(
			map((response: string) => response),
			catchError((error) => {
				console.error('Error al cambiar el estado del documento:', error);
				return throwError(() => error);
			})
		);
  }

  downloadConformity(): Observable<Blob> {
    const url = `${this.apiUrl}conformity-report/generate`;

    const headers = new HttpHeaders({
      'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    return this.http.get(url, {
      headers,
      responseType: 'blob'
    });
  }
}
