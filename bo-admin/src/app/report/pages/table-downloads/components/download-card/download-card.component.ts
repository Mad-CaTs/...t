import { Component, Input, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { ReportDownloadService } from '../../services/report-download.service';
import { ReportType } from '../../services/report-downloader.factory';
import { DownloadParams } from '../../interfaces/report.interface';

export interface DownloadCardData {
	id: string;
	title: string;
	description: string;
	icon: string;
	filterType: 'date' | 'period' | 'none';
	isDownloading: boolean;
	startDate: Date | null;
	endDate: Date | null;
}

@Component({
	selector: 'app-download-card',
	templateUrl: './download-card.component.html',
	styleUrls: ['./download-card.component.scss'],
	standalone: true,
	imports: [
		CommonModule,
		HttpClientModule,
		FormsModule,
		MatDatepickerModule,
		MatInputModule,
		MatFormFieldModule,
		MatNativeDateModule,
		MatIconModule,
		MatButtonModule,
		SpinnerComponent
	]
})
export class DownloadCardComponent {
	@Input() card!: DownloadCardData;

	constructor(
		private reportDownloadService: ReportDownloadService,
		private cdr: ChangeDetectorRef
	) {}

	async onDownload() {
		if (this.card.isDownloading) return;
		
		this.card.isDownloading = true;
		this.cdr.detectChanges(); // Forzar actualización para mostrar spinner
		
		try {
			const params = this.buildDownloadParams();
			await this.reportDownloadService.downloadReport(this.card.id as ReportType, params);
		} catch (error: any) {
			
			// Mostrar mensaje de error más descriptivo
			let errorMessage = 'Error desconocido';
			if (error?.status === 500) {
				errorMessage = 'Error interno del servidor. Verifique que el microservicio esté funcionando.';
			} else if (error?.status === 404) {
				errorMessage = 'Endpoint no encontrado. Verifique la URL del servicio.';
			} else if (error?.status === 0) {
				errorMessage = 'No se puede conectar al servidor. Verifique que esté ejecutándose.';
			} else if (error?.message) {
				errorMessage = error.message;
			}
			
			alert(`Error en la descarga de ${this.card.title}: ${errorMessage}`);
		} finally {
			this.card.isDownloading = false;
			this.cdr.detectChanges(); // Forzar actualización para ocultar spinner
		}
	}

	private buildDownloadParams(): DownloadParams {
		const params: DownloadParams = {};
		
		if (this.card.filterType !== 'none') {
			if (this.card.startDate) {
				params.startDate = this.card.startDate;
				params.year = this.card.startDate.getFullYear();
				params.month = this.card.startDate.getMonth() + 1;
			}
			
			if (this.card.endDate) {
				params.endDate = this.card.endDate;
			}
		}
		
		// Agregar parámetros específicos según el tipo de reporte
		switch (this.card.id) {
			case 'cierre-residual':
			case 'cierre-compuesto':
				// Para estos reportes necesitaríamos el periodId
				// Por ahora usar un valor por defecto
				params.periodId = 1;
				break;
		}
		
		return params;
	}

	private getDateRangeInfo(): string {
		if (this.card.filterType === 'none') {
			return 'todos los registros';
		}
		
		const { startDate, endDate } = this.card;
		
		if (startDate && endDate) {
			return `desde ${startDate.toLocaleDateString()} hasta ${endDate.toLocaleDateString()}`;
		} else if (startDate) {
			return `desde ${startDate.toLocaleDateString()}`;
		} else if (endDate) {
			return `hasta ${endDate.toLocaleDateString()}`;
		}
		
		return 'sin filtro de fecha';
	}
}