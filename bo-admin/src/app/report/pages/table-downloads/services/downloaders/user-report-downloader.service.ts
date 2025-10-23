import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseReportDownloader } from '../base/base-report-downloader.service';
import { DownloadParams, ReportDownloadResult } from '../../interfaces/report.interface';

@Injectable({
	providedIn: 'root'
})
export class UserReportDownloader extends BaseReportDownloader {

	async download(params?: DownloadParams): Promise<ReportDownloadResult> {
		const hasDateFilters = !!(params?.startDate || params?.endDate);
		const downloadObservable = hasDateFilters 
			? this.downloadUsersByDateRange(params) 
			: this.downloadAllUsers();

		const filename = this.generateFilename(params);
		
		return this.executeDownload(downloadObservable, filename);
	}

	generateFilename(params?: DownloadParams): string {
		const hasDateFilters = params?.startDate || params?.endDate;
		const datePrefix = hasDateFilters 
			? `filtrado_${new Date().toISOString().split('T')[0]}` 
			: `todos_${new Date().toISOString().split('T')[0]}`;
		return `usuarios_${datePrefix}.xlsx`;
	}

	/**
	 * Descarga todos los usuarios (sin filtros)
	 */
	private downloadAllUsers(): Observable<Blob> {
		const url = `${this.baseUrl}/reports/users/download`;
		const headers = this.getStandardHeaders();
		
		return this.http.post(url, {}, { 
			responseType: 'blob',
			headers
		});
	}

	/**
	 * Descarga usuarios con filtros de fecha
	 */
	private downloadUsersByDateRange(params?: DownloadParams): Observable<Blob> {
		const url = `${this.baseUrl}/reports/users/download`;
		const body: any = {};
		
		if (params?.startDate) {
			// Enviar fecha en formato LocalDateTime (sin zona horaria)
			body.startDate = this.formatDateForBackend(params.startDate);
		}
		
		if (params?.endDate) {
			// Enviar fecha en formato LocalDateTime (sin zona horaria)  
			body.endDate = this.formatDateForBackend(params.endDate);
		}
		
		const headers = this.getStandardHeaders();
		
		return this.http.post(url, body, { 
			responseType: 'blob',
			headers
		});
	}

}