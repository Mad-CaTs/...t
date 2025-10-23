import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseReportDownloader } from '../base/base-report-downloader.service';
import { DownloadParams, ReportDownloadResult } from '../../interfaces/report.interface';

@Injectable({
	providedIn: 'root'
})
export class AffiliateReportDownloader extends BaseReportDownloader {

	async download(params?: DownloadParams): Promise<ReportDownloadResult> {
		const hasDateFilters = !!(params?.startDate || params?.endDate);
		const downloadObservable = hasDateFilters 
			? this.downloadAffiliatesByDateRange(params) 
			: this.downloadAllAffiliates();

		const filename = this.generateFilename(params);
		
		return this.executeDownload(downloadObservable, filename);
	}

	generateFilename(params?: DownloadParams): string {
		const hasDateFilters = !!(params?.startDate || params?.endDate);
		
		if (hasDateFilters && params?.startDate && params?.endDate) {
			const startDateStr = params.startDate.toISOString().split('T')[0];
			const endDateStr = params.endDate.toISOString().split('T')[0];
			return `affiliates_${startDateStr}_a_${endDateStr}.xlsx`;
		}
		
		const datePrefix = hasDateFilters 
			? `filtrado_${new Date().toISOString().split('T')[0]}` 
			: `sistema`;
		
		return `affiliates_${datePrefix}.xlsx`;
	}

	/**
	 * Descarga todos los afiliados (sin filtros)
	 */
	private downloadAllAffiliates(): Observable<Blob> {
		const url = `${this.baseUrl}/reports/affiliates/download`;
		const headers = this.getStandardHeaders();
		
		return this.http.post(url, {}, { 
			responseType: 'blob',
			headers
		});
	}

	/**
	 * Descarga afiliados con filtros de fecha
	 */
	private downloadAffiliatesByDateRange(params?: DownloadParams): Observable<Blob> {
		const url = `${this.baseUrl}/reports/affiliates/download`;
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