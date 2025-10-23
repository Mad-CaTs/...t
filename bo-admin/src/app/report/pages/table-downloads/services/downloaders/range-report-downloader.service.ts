import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseReportDownloader } from '../base/base-report-downloader.service';
import { DownloadParams, ReportDownloadResult } from '../../interfaces/report.interface';

@Injectable({
	providedIn: 'root'
})
export class RangeReportDownloader extends BaseReportDownloader {

	async download(params?: DownloadParams): Promise<ReportDownloadResult> {
		const downloadObservable = this.downloadRanges();
		const filename = this.generateFilename(params);
		
		return this.executeDownload(downloadObservable, filename);
	}

	generateFilename(params?: DownloadParams): string {
		return `rangos_${new Date().toISOString().split('T')[0]}.xlsx`;
	}

	/**
	 * Descarga el reporte de rangos (sin parámetros)
	 */
	private downloadRanges(): Observable<Blob> {
		const url = `${this.baseUrl}/reports/ranges/download`;
		const headers = this.getStandardHeaders();
		
		return this.http.get(url, { 
			responseType: 'blob',
			headers
		});
	}
}