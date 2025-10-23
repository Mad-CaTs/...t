import { Injectable } from '@angular/core';
import { ReportDownloaderFactory, ReportType } from './report-downloader.factory';
import { DownloadParams, ReportDownloadResult } from '../interfaces/report.interface';

@Injectable({
	providedIn: 'root'
})
export class ReportDownloadService {

	constructor(private downloaderFactory: ReportDownloaderFactory) {}

	/**
	 * Descarga un reporte según el tipo especificado
	 */
	async downloadReport(reportType: ReportType, params?: DownloadParams): Promise<ReportDownloadResult> {
		try {
			const downloader = this.downloaderFactory.getDownloader(reportType);
			const result = await downloader.download(params);
			
			if (!result.success) {
				throw new Error(result.error || 'Error desconocido en la descarga');
			}
			
			return result;
		} catch (error: any) {
			console.error(`Error descargando reporte ${reportType}:`, error);
			throw error;
		}
	}

	/**
	 * Genera el nombre de archivo para un reporte específico
	 */
	generateFilename(reportType: ReportType, params?: DownloadParams): string {
		try {
			const downloader = this.downloaderFactory.getDownloader(reportType);
			return downloader.generateFilename(params);
		} catch (error) {
			console.warn(`No se pudo generar filename para ${reportType}, usando genérico`);
			return `reporte_${reportType}_${new Date().toISOString().split('T')[0]}.xlsx`;
		}
	}

	/**
	 * Verifica si un tipo de reporte está implementado
	 */
	isReportTypeImplemented(reportType: ReportType): boolean {
		try {
			this.downloaderFactory.getDownloader(reportType);
			return true;
		} catch (error) {
			return false;
		}
	}
}