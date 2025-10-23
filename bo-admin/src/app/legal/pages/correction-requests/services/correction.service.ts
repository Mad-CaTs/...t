import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, of, forkJoin } from 'rxjs';
import { tap, catchError, map, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { getCokkie } from '@utils/cokkies';
import {
  CorrectionRequest,
  CorrectionFilters,
  StatusHistory,
  CorrectionDetail,
  ObservacionRequest
} from '../models/correction.interface';

@Injectable({
  providedIn: 'root'
})
export class CorrectionService {
  private readonly API_URL = environment.apiLegal;
  private readonly ADMIN_API_URL = environment.api;
  private readonly PDF_API_URL = environment.apiPdf;

  constructor(private http: HttpClient) { }

  getCorrectionRequests(filters?: CorrectionFilters): Observable<CorrectionRequest[]> {
    const params: any = {
      documentId: filters?.documentType === 'certificates' ? 1 : 2
    };

    if (filters) {
      if (filters.search) params.search = filters.search;
      if (filters.portfolio) params.portfolio = filters.portfolio;
      if (filters.date) params.date = filters.date.toISOString().split('T')[0];
    }


    return this.http.get<CorrectionRequest[]>(`${this.API_URL}/api/v1/legal/correction-requests`, { params })
      .pipe(
        tap(response => {
          if (Array.isArray(response)) {
          } else {
            console.log('No es un array, es:', typeof response);
          }
        }),
        switchMap(requests => {
          const requestsWithData = requests.map(request => {
            if (request.customerId && request.suscriptionId) {
              return this.getPartnerData(request.customerId, request.suscriptionId)
                .pipe(
                  map(partnerData => ({
                    ...request,
                    partnerName: partnerData.fullName || '',
                    portfolio: partnerData.familyPackageName || '',
                    documentType: partnerData.documentType || '',
                    identityDocument: partnerData.documentNumber || ''
                  })),
                  catchError(() => of(request))
                );
            }
            return of(request);
          });

          return forkJoin(requestsWithData);
        }),
        catchError(error => {
          console.error('Error al obtener correcciones:', error);
          return throwError(() => error);
        })
      );
  }


  getCorrectionDetail(correctionId: number): Observable<CorrectionDetail> {
    const url = `${this.API_URL}/api/v1/legal/correction-requests/${correctionId}`;

    return this.http.get<CorrectionDetail>(url)
      .pipe(
        tap(response => console.log('Detalle:', response)),
        catchError(error => {
          console.error('Error al obtener detalle:', error);
          return throwError(() => error);
        })
      );
  }

  updateStatus(correctionId: number, status: number, message: string): Observable<any> {
    return this.http.put(`${this.API_URL}/api/v1/legal/correction-requests/${correctionId}/status`, {
      status: status.toString(),
      message,
      profileType: 'ADMIN'
    }).pipe(
      tap(response => console.log('Estado actualizado:', response)),
      catchError(error => {
        console.error('Error al actualizar estado:', error);
        return throwError(() => error);
      })
    );
  }

  getPartnerData(customerId: number | string, suscriptionId: number | string): Observable<any> {
    const numericCustomerId = Number(customerId);
    const numericSuscriptionId = Number(suscriptionId);

    if (isNaN(numericCustomerId) || isNaN(numericSuscriptionId)) {
      console.error('IDs inválidos:', { customerId, suscriptionId });
      return throwError(() => new Error('Los IDs deben ser números válidos'));
    }

    const url = `${this.API_URL}/api/v1/legal/user-data/complete?customerId=${numericCustomerId}&suscriptionId=${numericSuscriptionId}`;
    console.log('Llamando a API:', url);

    return this.http.get(url)
      .pipe(
        tap(response => console.log('Datos del socio:', response)),
        catchError(error => {
          return throwError(() => error);
        })
      );
  }

  getHistory(customerId: string | number): Observable<any> {
    return this.http.get(`${this.API_URL}/api/v1/legal/correction-requests/user/${customerId}`)
      .pipe(
        tap(response => console.log('Historial:', response)),
        catchError(error => {
          console.error('Error al obtener historial:', error);
          return throwError(() => error);
        })
      );
  }

  sendObservation(request: ObservacionRequest): Observable<any> {
    return this.http.post(`${this.API_URL}/api/corrections/${request.correctionId}/observe`, request)
      .pipe(
        tap(response => console.log('Observación enviada:', response)),
        catchError(error => {
          console.error('Error al enviar observación:', error);
          return throwError(() => error);
        })
      );
  }

  sendNotification(correctionId: number, type: 'OBSERVACION' | 'CORRECCION'): Observable<any> {
    return this.http.post(`${this.API_URL}/api/notifications/correction/${correctionId}`, { type })
      .pipe(
        tap(response => console.log('Notificación enviada:', response)),
        catchError(error => {
          console.error('Error al enviar notificación:', error);
          return throwError(() => error);
        })
      );
  }

  uploadEvidence(correctionId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(`${this.API_URL}/api/corrections/${correctionId}/evidence`, formData)
      .pipe(
        tap(response => console.log('Evidencia subida:', response)),
        catchError(error => {
          console.error('Error al subir evidencia:', error);
          return throwError(() => error);
        })
      );
  }

  deleteEvidence(correctionId: number, evidenceId: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/api/corrections/${correctionId}/evidence/${evidenceId}`)
      .pipe(
        tap(response => console.log('Evidencia eliminada:', response)),
        catchError(error => {
          console.error('Error al eliminar evidencia:', error);
          return throwError(() => error);
        })
      );
  }

  getPortfolios(): Observable<string[]> {
    const token = getCokkie('TOKEN');
    if (!token) {
      return throwError(() => new Error('No se encontró token de autorización'));
    }

    return this.http.get<any>(
      `${this.ADMIN_API_URL}/api/familypackage/all`,
      { headers: { Authorization: `Bearer ${token}` } }
    ).pipe(
      map(response => {
        console.log('Respuesta del API de portfolios:', response);
        if (!response || !response.data) {
          console.warn('No hay datos en la respuesta de portfolios');
          return [];
        }
        return response.data.map((fp: any) => fp.name);
      }),
      tap(response => console.log('Portfolios obtenidos:', response)),
      catchError(error => {
        console.error('Error al obtener portafolios:', error);
        return throwError(() => error);
      })
    );
  }

  getPackagesByCustomerData(customerId: number, suscriptionId: number): Observable<any> {
    return this.getPartnerData(customerId, suscriptionId).pipe(
      switchMap(partnerData => {
        console.log('Datos del socio obtenidos:', partnerData);
        const familyPackageId = partnerData.familyPackageId;
        return this.getPackagesByFamilyId(familyPackageId);
      })
    );
  }

  getPackagesByFamilyId(familyPackageId: number): Observable<any> {
    console.log('Obteniendo paquetes para familyPackageId:', familyPackageId);
    const token = getCokkie('TOKEN');
    if (!token) {
      return throwError(() => new Error('No se encontro token de autorizacion'));
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.get<any>(
      `${this.ADMIN_API_URL}/api/familypackage/package/detail/version/state/true`,
      { headers }
    ).pipe(
      tap(response => console.log('Respuesta completa del API:', response)),
      map(response => {
        if (!response.data) {
          console.error('No hay datos en la respuesta');
          return [];
        }
        const family = response.data.find((f: any) => f.idFamilyPackage === familyPackageId);
        if (family && family.packageList) {
          console.log('Familia encontrada:', family);
          return family.packageList.map((p: any) => p.name);
        }
        console.warn('No se encontró la familia o no tiene paquetes');
        return [];
      }),
      tap(memberships => console.log('Membresías extraídas:', memberships)),
      catchError(error => {
        console.error('Error al obtener paquetes:', error);
        return throwError(() => error);
      })
    )
  }

  createCorrectionRequest(request: any): Observable<any> {
    console.log('Enviando solicitud de corrección:', request);

    if (!request.suscriptionId && request.id_suscription) {
      request.suscriptionId = request.id_suscription;
    } else if (!request.id_suscription && request.suscriptionId) {
      request.id_suscription = request.suscriptionId;
    }

    if (!request.customerId || !request.suscriptionId) {
      console.error('Faltan datos requeridos:', { customerId: request.customerId, suscriptionId: request.suscriptionId });
      return throwError(() => new Error('customerId y suscriptionId son requeridos'));
    }

    if (request.status && typeof request.status !== 'string') {
      request.status = request.status.toString();
    }

    console.log('Request procesado:', request);

    return this.http.post(`${this.API_URL}/api/v1/legal/correction-requests`, request)
      .pipe(
        tap(response => console.log('Solicitud de corrección creada:', response)),
        catchError(error => {
          console.error('Error al crear solicitud de corrección:', error);
          return throwError(() => error);
        })
      );
  }
}