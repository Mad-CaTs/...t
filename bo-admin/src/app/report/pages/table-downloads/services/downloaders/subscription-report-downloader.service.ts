import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseReportDownloader } from '../base/base-report-downloader.service';
import { DownloadParams, ReportDownloadResult } from '../../interfaces/report.interface';

@Injectable({
	providedIn: 'root'
})
export class SubscriptionReportDownloader extends BaseReportDownloader {

	async download(params?: DownloadParams): Promise<ReportDownloadResult> {
		const hasDateFilters = !!(params?.startDate || params?.endDate);
		const downloadObservable = hasDateFilters 
			? this.downloadSubscriptionsByDateRange(params) 
			: this.downloadAllSubscriptions();

		const filename = this.generateFilename(params);
		
		return this.executeDownload(downloadObservable, filename);
	}

	generateFilename(params?: DownloadParams): string {
		const hasDateFilters = !!(params?.startDate || params?.endDate);
		
		if (hasDateFilters && params?.startDate && params?.endDate) {
			const startDateStr = params.startDate.toISOString().split('T')[0];
			const endDateStr = params.endDate.toISOString().split('T')[0];
			return `subscriptions_${startDateStr}_a_${endDateStr}.xlsx`;
		}
		
		const datePrefix = hasDateFilters 
			? `filtrado_${new Date().toISOString().split('T')[0]}` 
			: `sistema`;
		
		return `subscriptions_${datePrefix}.xlsx`;
	}

	/**
	 * Descarga todas las suscripciones (sin filtros)
	 */
	private downloadAllSubscriptions(): Observable<Blob> {
		const url = `${this.baseUrl}/reports/subscriptions/download`;
		const headers = this.getStandardHeaders();
		
		return this.http.post(url, {}, { 
			responseType: 'blob',
			headers
		});
	}

	/**
	 * Descarga suscripciones con filtros de fecha
	 */
	private downloadSubscriptionsByDateRange(params?: DownloadParams): Observable<Blob> {
		const url = `${this.baseUrl}/reports/subscriptions/download`;
		const body: any = {};
		
		if (params?.startDate) {
			body.startDate = this.formatDateForBackend(params.startDate);
		}
		
		if (params?.endDate) {
			body.endDate = this.formatDateForBackend(params.endDate);
		}
		
		const headers = this.getStandardHeaders();
		
		return this.http.post(url, body, { 
			responseType: 'blob',
			headers
		});
	}

}