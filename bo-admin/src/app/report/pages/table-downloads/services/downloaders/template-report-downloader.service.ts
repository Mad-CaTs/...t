import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseReportDownloader } from '../base/base-report-downloader.service';
import { DownloadParams, ReportDownloadResult } from '../../interfaces/report.interface';

/**
 * Template para crear nuevos downloaders de reportes
 * 
 * Pasos para implementar un nuevo downloader:
 * 1. Copiar este archivo y renombrarlo (ej: affiliate-report-downloader.service.ts)
 * 2. Cambiar el nombre de la clase (ej: AffiliateReportDownloader)
 * 3. Implementar los métodos download() y generateFilename()
 * 4. Agregar los métodos privados para llamar a la API
 * 5. Registrar en el ReportDownloaderFactory
 */

@Injectable({
	providedIn: 'root'
})
export class TemplateReportDownloader extends BaseReportDownloader {

	async download(params?: DownloadParams): Promise<ReportDownloadResult> {
		// TODO: Implementar lógica específica del reporte
		// Ejemplo:
		// const downloadObservable = this.downloadSpecificReport(params);
		// const filename = this.generateFilename(params);
		// return this.executeDownload(downloadObservable, filename);
		
		throw new Error('TemplateReportDownloader debe ser implementado');
	}

	generateFilename(params?: DownloadParams): string {
		// TODO: Generar nombre específico del archivo
		// Ejemplo:
		// return `mi_reporte_${new Date().toISOString().split('T')[0]}.xlsx`;
		
		return `template_reporte_${new Date().toISOString().split('T')[0]}.xlsx`;
	}

	/**
	 * TODO: Implementar método específico para descargar desde la API
	 */
	private downloadSpecificReport(params?: DownloadParams): Observable<Blob> {
		// Ejemplo:
		// const url = `${this.baseUrl}/reports/mi-endpoint/download`;
		// const headers = this.getStandardHeaders();
		// return this.http.get(url, { responseType: 'blob', headers });
		
		throw new Error('downloadSpecificReport debe ser implementado');
	}
}