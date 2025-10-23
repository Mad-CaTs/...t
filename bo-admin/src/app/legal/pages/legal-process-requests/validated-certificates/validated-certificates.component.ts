import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormGroup, FormsModule } from '@angular/forms';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { TablesModule } from '@shared/components/tables/tables.module';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { CertificateTableComponent } from './certificate-table/certificate-table.component';
import { IValidatedCertificatesRequestOne } from '@interfaces/legal-module.interface';
import { LegalService } from '@app/legal/services/LegalService';
import { TableService } from '@app/core/services/table.service';

@Component({
	selector: 'app-validated-certificates',
	standalone: true,
	templateUrl: './validated-certificates.component.html',
	styleUrls: ['./validated-certificates.component.scss'],
	imports: [
		CommonModule,
		TablesModule,
		InlineSVGModule,
		FormsModule,
		NgbNavModule,
		CertificateTableComponent
	]
})
export class ValidatedCertificatesComponent {
	//tabla datos
	fullData: IValidatedCertificatesRequestOne[] = [];
	filteredData: IValidatedCertificatesRequestOne[] = [...this.fullData];

	// Filtros
	searchTerm: string = '';
	selectedLegalizacion: string = '';
	selectedSolicitadoEn: string = '';
	selectedDate: string = '';

	legalizacionOptions: string[] = ['Regular', 'Express'];
	solicitadoEnOptions: string[] = ['Perú - Lima', 'Provincia', 'Extranjero'];

	isLoading = true;

	constructor(
		private legalService: LegalService,
		private cdr: ChangeDetectorRef,
		private tableService: TableService
	) {}

	ngOnInit(): void {
		this.loadData();
	}

	loadData(): void {
		this.legalService.getValidatedCertificates().subscribe({
			next: (response) => {
				this.fullData = (response.data as IValidatedCertificatesRequestOne[]).sort((a, b) => {
					const dateA = new Date(a.userDate || '').getTime();
					const dateB = new Date(b.userDate || '').getTime();
					return dateB - dateA; // orden descendente
				});
				console.log('Solicitudes Procesadas de Certificados', this.fullData);
				this.filteredData = [...this.fullData];
				this.cdr.detectChanges();
				this.isLoading = false;
			},
			error: (error) => {
				console.error('Error cargando documentos:', error);
				this.fullData = [];
				this.filteredData = [];
				this.isLoading = false;
				this.cdr.detectChanges();
			}
		});
	}

	toISODateString(dateStr: string): string {
		// Caso: viene en formato dd/MM/yyyy
		if (dateStr.includes('/')) {
			const [day, month, year] = dateStr.split('/');
			return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
		}

		// Caso: ya viene en formato yyyy-MM-dd
		return dateStr.substring(0, 10);
	}

	private normalizeBackendDate(dateStr: string): string {
		if (!dateStr) return '';
		return dateStr.split('T')[0]; // "2025-07-05T02:44:08.303Z" -> "2025-07-05"
	}
	/* 
onFiltersChange() {
	const search = (this.searchTerm || '').toLowerCase();

	let total05 = 0;
	let mostrados05 = 0;

	this.filteredData = this.fullData.filter((certificate) => {
		const matchesSearch = search
			? (certificate.userDni || '').toLowerCase().includes(search) ||
			  (certificate.userRealName || '').toLowerCase().includes(search)
			: true;

		const matchesLegalizacion = this.selectedLegalizacion
			? (certificate.legalizationType === 1 && this.selectedLegalizacion === 'Regular') ||
			  (certificate.legalizationType === 2 && this.selectedLegalizacion === 'Express')
			: true;

		const matchesSolicitadoEn = this.selectedSolicitadoEn
			? (certificate.userLocalUbic === 1 && this.selectedSolicitadoEn === 'Perú - Lima') ||
			  (certificate.userLocalUbic === 2 && this.selectedSolicitadoEn === 'Provincia') ||
			  (certificate.userLocalUbic === 3 && this.selectedSolicitadoEn === 'Extranjero')
			: true;

		const matchesDate = this.selectedDate
			? this.normalizeBackendDate(certificate.userDate) === this.selectedDate
			: true;

		const passed =
			matchesSearch &&
			matchesLegalizacion &&
			matchesSolicitadoEn &&
			matchesDate;

		console.log('Comparando fechas:', {
			originalSelected: this.selectedDate,
			certDate: this.normalizeBackendDate(certificate.userDate),
			userDateOriginal: certificate.userDate,
		});

		if (this.selectedDate && this.normalizeBackendDate(certificate.userDate) === this.selectedDate) {
			total05++;
			if (passed) {
				mostrados05++;
			} else {
				console.log("DESCARTADO:", {
					id: certificate.id,
					userDate: certificate.userDate,
					matchesSearch,
					matchesLegalizacion,
					matchesSolicitadoEn,
					matchesDate,
				});
			}
		}

		return passed;
	});

	console.log(
		'Fechas que pasan el filtro:',
		this.filteredData.map(c => ({
			id: c.id,
			date: this.normalizeBackendDate(c.userDate),
			original: c.userDate,
		}))
	);

	if (this.selectedDate) {
		console.log(
			`Resumen ${this.selectedDate}: Habían ${total05}, mostrados ${mostrados05}, descartados ${total05 - mostrados05}`
		);
	}
} */

	/* 
onFiltersChange() {
	const search = (this.searchTerm || '').toLowerCase();

	this.filteredData = this.fullData.filter((certificate) => {
		const matchesSearch = search
			? (certificate.userDni || '').toLowerCase().includes(search) ||
			  (certificate.userRealName || '').toLowerCase().includes(search)
			: true;

		const matchesLegalizacion = this.selectedLegalizacion
			? (certificate.legalizationType === 1 && this.selectedLegalizacion === 'Regular') ||
			  (certificate.legalizationType === 2 && this.selectedLegalizacion === 'Express')
			: true;

		const matchesSolicitadoEn = this.selectedSolicitadoEn
			? (certificate.userLocalUbic === 1 && this.selectedSolicitadoEn === 'Perú - Lima') ||
			  (certificate.userLocalUbic === 2 && this.selectedSolicitadoEn === 'Provincia') ||
			  (certificate.userLocalUbic === 3 && this.selectedSolicitadoEn === 'Extranjero')
			: true;

		const matchesDate = this.selectedDate
			? this.normalizeBackendDate(certificate.userDate) === this.selectedDate
			: true;
			console.log('selectedDate crudo:', this.selectedDate);


		console.log('Comparando fechas:', {
			originalSelected: this.selectedDate,
			certDate: this.normalizeBackendDate(certificate.userDate),
			selectedNorm: this.selectedDate, 
			userDateOriginal: certificate.userDate
		});

		return matchesSearch && matchesLegalizacion && matchesSolicitadoEn && matchesDate;

		
	});
} */

	onFiltersChange() {
		const search = (this.searchTerm || '').toLowerCase();
		this.filteredData = this.fullData.filter((certificate) => {
			const matchesSearch = search
				? (certificate.userDni || '').toLowerCase().includes(search) ||
				  (certificate.userRealName || '').toLowerCase().includes(search)
				: true;

			const matchesLegalizacion = this.selectedLegalizacion
				? (certificate.legalizationType === 1 && this.selectedLegalizacion === 'Regular') ||
				  (certificate.legalizationType === 2 && this.selectedLegalizacion === 'Express')
				: true;

			const matchesSolicitadoEn = this.selectedSolicitadoEn
				? (certificate.userLocalUbic === 1 && this.selectedSolicitadoEn === 'Perú - Lima') ||
				  (certificate.userLocalUbic === 2 && this.selectedSolicitadoEn === 'Provincia') ||
				  (certificate.userLocalUbic === 3 && this.selectedSolicitadoEn === 'Extranjero')
				: true;

			const matchesDate = this.selectedDate
				? this.normalizeBackendDate(certificate.userDate) === this.selectedDate
				: true;

			return matchesSearch && matchesLegalizacion && matchesSolicitadoEn && matchesDate;
		});
	}

	clearFilters() {
		this.searchTerm = '';
		this.selectedLegalizacion = '';
		this.selectedSolicitadoEn = '';
		this.selectedDate = '';
		this.filteredData = [...this.fullData];
		this.cdr.detectChanges();
	}
}
