import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface DownloadParams {
	startDate?: Date | null;
	endDate?: Date | null;
	periodId?: number;
	state?: number;
	countries?: number[];
	month?: number;
	year?: number;
	packageId?: number;
	familyId?: number;
}

@Injectable({
	providedIn: 'root'
})
export class TableDownloadService {

	private readonly baseUrl = environment.apiReportsLocal;

	constructor(private http: HttpClient) {}

	/**
	 * Descarga el reporte de estados (sin parámetros)
	 */
	downloadStates(): Observable<Blob> {
		const url = `${this.baseUrl}/reports/states/download`;
		return this.http.get(url, { responseType: 'blob' });
	}

	/**
	 * Descarga el reporte de afiliados por mes
	 */
	downloadAffiliatesByMonth(params: DownloadParams): Observable<Blob> {
		const url = `${this.baseUrl}/reports/affiliates/download/month`;
		let httpParams = new HttpParams();
		
		if (params.year) httpParams = httpParams.set('year', params.year.toString());
		if (params.month) httpParams = httpParams.set('month', params.month.toString());
		if (params.state) httpParams = httpParams.set('state', params.state.toString());
		if (params.countries && params.countries.length > 0) {
			params.countries.forEach(country => {
				httpParams = httpParams.append('countries', country.toString());
			});
		}
		
		return this.http.get(url, { params: httpParams, responseType: 'blob' });
	}

	/**
	 * Descarga el reporte de afiliados por trimestre
	 */
	downloadAffiliatesByQuarter(params: DownloadParams): Observable<Blob> {
		const url = `${this.baseUrl}/reports/affiliates/download/quarter`;
		let httpParams = new HttpParams();
		
		if (params.year) httpParams = httpParams.set('year', params.year.toString());
		if (params.state) httpParams = httpParams.set('state', params.state.toString());
		if (params.countries && params.countries.length > 0) {
			params.countries.forEach(country => {
				httpParams = httpParams.append('countries', country.toString());
			});
		}
		
		return this.http.get(url, { params: httpParams, responseType: 'blob' });
	}

	/**
	 * Descarga el reporte de suscriptores por paquete
	 */
	downloadSubscribersByPackage(params: DownloadParams): Observable<Blob> {
		const url = `${this.baseUrl}/reports/affiliates/download/subscribers/by-package`;
		let httpParams = new HttpParams();
		
		if (params.year) httpParams = httpParams.set('year', params.year.toString());
		if (params.month) httpParams = httpParams.set('month', params.month.toString());
		if (params.state) httpParams = httpParams.set('state', params.state.toString());
		if (params.packageId) httpParams = httpParams.set('packageId', params.packageId.toString());
		if (params.familyId) httpParams = httpParams.set('familyId', params.familyId.toString());
		
		return this.http.get(url, { params: httpParams, responseType: 'blob' });
	}

	/**
	 * Descarga el reporte de rango por última fecha
	 */
	downloadRangeLastDate(): Observable<Blob> {
		const url = `${this.baseUrl}/reports/affiliates/range/download/last-date`;
		return this.http.get(url, { responseType: 'blob' });
	}

	/**
	 * Descarga el reporte compuesto del nuevo rango
	 */
	downloadCompoundNewRange(periodId: number): Observable<Blob> {
		const url = `${this.baseUrl}/reports/new-range/compound/download`;
		const params = new HttpParams().set('periodId', periodId.toString());
		return this.http.get(url, { params, responseType: 'blob' });
	}

	/**
	 * Descarga el reporte residual del nuevo rango
	 */
	downloadResidualNewRange(periodId: number): Observable<Blob> {
		const url = `${this.baseUrl}/reports/new-range/residual/download`;
		const params = new HttpParams().set('periodId', periodId.toString());
		return this.http.get(url, { params, responseType: 'blob' });
	}

	/**
	 * Descarga el reporte compuesto
	 */
	downloadCompound(periodId: number): Observable<Blob> {
		const url = `${this.baseUrl}/reports/compound/download`;
		const params = new HttpParams().set('periodId', periodId.toString());
		return this.http.get(url, { params, responseType: 'blob' });
	}

	/**
	 * Descarga el reporte residual
	 */
	downloadResidual(periodId: number): Observable<Blob> {
		const url = `${this.baseUrl}/reports/residual/download`;
		const params = new HttpParams().set('periodId', periodId.toString());
		return this.http.get(url, { params, responseType: 'blob' });
	}

	/**
	 * Descarga todos los usuarios (sin filtros)
	 */
	downloadAllUsers(): Observable<Blob> {
		const url = `${this.baseUrl}/reports/users/download`;
		const headers = {
			'Content-Type': 'application/json',
			'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
		};
		
		return this.http.post(url, {}, { 
			responseType: 'blob',
			headers
		});
	}

	/**
	 * Descarga usuarios con filtros de fecha
	 */
	downloadUsersByDateRange(params: DownloadParams): Observable<Blob> {
		const url = `${this.baseUrl}/reports/users/download`;
		const body: any = {};
		
		if (params.startDate) {
			body.startDate = params.startDate.toISOString();
		}
		
		if (params.endDate) {
			body.endDate = params.endDate.toISOString();
		}
		
		const headers = {
			'Content-Type': 'application/json',
			'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
		};
		
		return this.http.post(url, body, { 
			responseType: 'blob',
			headers
		});
	}

	/**
	 * Función genérica para descargar archivo blob
	 */
	private downloadFile(blob: Blob, filename: string): void {
		try {
			console.log('📁 Creando descarga de archivo:', { filename, size: blob.size, type: blob.type });
			
			const url = window.URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = url;
			link.download = filename;
			
			// Agregar al DOM temporalmente
			document.body.appendChild(link);
			
			// Activar la descarga
			link.click();
			
			// Limpiar
			document.body.removeChild(link);
			window.URL.revokeObjectURL(url);
			
			console.log('✅ Descarga iniciada correctamente');
		} catch (error) {
			console.error('❌ Error al crear la descarga:', error);
			throw error;
		}
	}

	/**
	 * Maneja la descarga de estados
	 */
	handleStatesDownload(): Promise<void> {
		return new Promise((resolve, reject) => {
			this.downloadStates().subscribe({
				next: (blob: Blob) => {
					const filename = `estados_${new Date().toISOString().split('T')[0]}.xlsx`;
					this.downloadFile(blob, filename);
					resolve();
				},
				error: (error) => {
					console.error('Error descargando estados:', error);
					reject(error);
				}
			});
		});
	}

	/**
	 * Maneja la descarga de afiliados
	 */
	handleAffiliatesDownload(params: DownloadParams): Promise<void> {
		return new Promise((resolve, reject) => {
			this.downloadAffiliatesByMonth(params).subscribe({
				next: (blob: Blob) => {
					const filename = `afiliados_${new Date().toISOString().split('T')[0]}.xlsx`;
					this.downloadFile(blob, filename);
					resolve();
				},
				error: (error) => {
					console.error('Error descargando afiliados:', error);
					reject(error);
				}
			});
		});
	}

	/**
	 * Maneja la descarga de rangos
	 */
	handleRangesDownload(): Promise<void> {
		return new Promise((resolve, reject) => {
			this.downloadRangeLastDate().subscribe({
				next: (blob: Blob) => {
					const filename = `rangos_${new Date().toISOString().split('T')[0]}.xlsx`;
					this.downloadFile(blob, filename);
					resolve();
				},
				error: (error) => {
					console.error('Error descargando rangos:', error);
					reject(error);
				}
			});
		});
	}

	/**
	 * Maneja la descarga de usuarios
	 */
	handleUsersDownload(params?: DownloadParams): Promise<void> {
		return new Promise((resolve, reject) => {
			const hasDateFilters = params?.startDate || params?.endDate;
			const downloadObservable = hasDateFilters 
				? this.downloadUsersByDateRange(params) 
				: this.downloadAllUsers();

			console.log('🚀 Iniciando descarga de usuarios...', { 
				hasDateFilters, 
				params,
				url: hasDateFilters ? `${this.baseUrl}/reports/users/download` : `${this.baseUrl}/reports/users/download`
			});

			downloadObservable.subscribe({
				next: (blob: Blob) => {
					console.log('✅ Descarga exitosa!', {
						blobSize: blob.size,
						blobType: blob.type,
						hasContent: blob.size > 0
					});
					
					if (blob.size === 0) {
						console.warn('⚠️ El archivo descargado está vacío');
						reject(new Error('El archivo descargado está vacío'));
						return;
					}
					
					const datePrefix = hasDateFilters 
						? `filtrado_${new Date().toISOString().split('T')[0]}` 
						: `todos_${new Date().toISOString().split('T')[0]}`;
					const filename = `usuarios_${datePrefix}.xlsx`;
					this.downloadFile(blob, filename);
					resolve();
				},
				error: (error) => {
					console.error('Error descargando usuarios:', {
						error,
						status: error.status,
						message: error.message,
						url: error.url
					});
					reject(error);
				}
			});
		});
	}

	/**
	 * Router de descargas según el tipo de reporte
	 */
	async downloadReport(reportType: string, params?: DownloadParams): Promise<void> {
		switch (reportType) {
			case 'estados':
				return this.handleStatesDownload();
			case 'afiliado':
				return this.handleAffiliatesDownload(params || {});
			case 'rangos':
				return this.handleRangesDownload();
			case 'suscripcion':
				// Implementar según el endpoint correspondiente
				console.log('Descarga de suscripción no implementada aún');
				break;
			case 'user':
				return this.handleUsersDownload(params);
			case 'usuario':
				return this.handleUsersDownload(params);
			case 'cierre-residual':
				if (params?.periodId) {
					return this.downloadResidualNewRange(params.periodId).toPromise().then(blob => {
						if (blob) {
							const filename = `cierre_residual_${params.periodId}.xlsx`;
							this.downloadFile(blob, filename);
						}
					});
				}
				break;
			case 'cierre-compuesto':
				if (params?.periodId) {
					return this.downloadCompoundNewRange(params.periodId).toPromise().then(blob => {
						if (blob) {
							const filename = `cierre_compuesto_${params.periodId}.xlsx`;
							this.downloadFile(blob, filename);
						}
					});
				}
				break;
			case 'codigos-paises':
				// Implementar según el endpoint correspondiente
				console.log('Descarga de códigos de países no implementada aún');
				break;
			default:
				console.warn('Tipo de reporte no reconocido:', reportType);
		}
	}
}