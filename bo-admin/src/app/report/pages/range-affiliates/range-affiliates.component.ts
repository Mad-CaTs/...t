import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { downloadBlobFile } from '@app/report/helper/download-helper';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NgApexchartsModule } from 'ng-apexcharts';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { ManagementDashboardService, RangeSummary } from '@app/report/services/management-dashboard.service';

@Component({
	selector: 'app-range-affiliates',
	templateUrl: './range-affiliates.component.html',
	styleUrls: ['./range-affiliates.component.scss'],
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		InlineSVGModule,
		NgApexchartsModule,
		MatFormFieldModule,
		MatSelectModule,
		MatOptionModule,
		FormControlModule
	]
})
export class RangeAffiliatesComponent implements OnInit {
	donutSeries: number[] = [];
	donutLabels: string[] = [];
	exporting = false;

	donutChart = {
		chart: { type: 'donut' as const, height: 300 },
		legend: { position: 'left' as const },
		tooltip: { enabled: true },
		dataLabels: { enabled: true }
	};

	constructor(
		private dashboardService: ManagementDashboardService,
		private snackBar: MatSnackBar,
		private cdr: ChangeDetectorRef
	) {}

	ngOnInit(): void {
		this.dashboardService.getCountByLastDate().subscribe({
			next: (data: RangeSummary[]) => {
				if (data && data.length > 0) {
					const ordered = data.sort((a, b) => a.idRange - b.idRange);
					this.donutSeries = ordered.map((r) => r.total);
					this.donutLabels = ordered.map((r) => this.capitalizar(r.rango));
					this.cdr.detectChanges(); // Forzar actualización de vista
				} else {
					console.warn('No se recibieron datos de rangos.');
				}
			},
			error: (err) => console.error('Error al cargar rangos:', err)
		});
	}

	capitalizar(text: string): string {
		return text.toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
	}

	private showSuccessMessage(filename: string): void {
		this.snackBar.open(`✅ ${filename} descargado correctamente`, 'Cerrar', { duration: 3000 });
	}

	private showErrorMessage(): void {
		this.snackBar.open('❌ Error al descargar el Excel de rangos', 'Cerrar', { duration: 3000 });
	}

	exportarRangos(): void {
		this.exporting = true;

		this.dashboardService.downloadRangeLastDate().subscribe({
			next: (res: Blob) => {
				const filename = 'range_afiliados.xlsx';
				downloadBlobFile(res, filename);
				this.exporting = false;
				this.showSuccessMessage(filename);
				this.cdr.detectChanges();
			},
			error: () => {
				this.exporting = false;
				this.showErrorMessage();
				this.cdr.detectChanges();
			}
		});
	}
}
