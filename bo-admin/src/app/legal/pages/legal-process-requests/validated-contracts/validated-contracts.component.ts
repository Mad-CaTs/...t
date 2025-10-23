import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormGroup, FormsModule } from '@angular/forms';
import { IValidatedContractRequestOne } from '@interfaces/legal-module.interface';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { TablesModule } from '@shared/components/tables/tables.module';
import { InlineSVGModule } from 'ng-inline-svg-2';

import { ContractTableComponent } from './contract-table/contract-table.component';
import { LegalService } from '@app/legal/services/LegalService';

@Component({
	selector: 'app-validated-contracts',
	standalone: true,
	templateUrl: './validated-contracts.component.html',
	styleUrls: ['./validated-contracts.component.scss'],
	imports: [CommonModule, TablesModule, InlineSVGModule, FormsModule, NgbNavModule, ContractTableComponent]
})
export class ValidatedContractsComponent {
	fullData: IValidatedContractRequestOne[] = [];
	filteredData: IValidatedContractRequestOne[] = [...this.fullData];

	//Filtros
	searchTerm: string = '';
	selectedLegalizacion: string = '';
	selectedSolicitadoEn: string = '';
	selectedDate: string = '';
	legalizacionOptions: string[] = ['Regular', 'Express'];
	solicitadoEnOptions: string[] = ['Perú - Lima', 'Provincia', 'Extranjero'];

	isLoading = true;

	constructor(private legalService: LegalService, private cdr: ChangeDetectorRef) {}

	ngOnInit(): void {
		this.loadData();
	}

	loadData(): void {
		this.legalService.getValidatedContracts().subscribe({
			next: (response) => {
				this.fullData = (response.data as IValidatedContractRequestOne[]).sort((a, b) => {
					const dateA = new Date(a.userDate || '').getTime();
					const dateB = new Date(b.userDate || '').getTime();
					return dateB - dateA; // orden descendente
				});
				console.log('Solicitudes Procesadas de Contratos', this.fullData);
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

	onFiltersChange() {
		const search = (this.searchTerm || '').toLowerCase();
		this.filteredData = this.fullData.filter((contract) => {
			const matchesSearch = search
				? (contract.userDni || '').toLowerCase().includes(search) ||
				  (contract.userRealName || '').toLowerCase().includes(search)
				: true;

			const matchesLegalizacion = this.selectedLegalizacion
				? (contract.legalizationType === 1 && this.selectedLegalizacion === 'Regular') ||
				  (contract.legalizationType === 2 && this.selectedLegalizacion === 'Express')
				: true;

			const matchesSolicitadoEn = this.selectedSolicitadoEn
				? (contract.userLocalUbic === 1 && this.selectedSolicitadoEn === 'Perú - Lima') ||
				  (contract.userLocalUbic === 2 && this.selectedSolicitadoEn === 'Provincia') ||
				  (contract.userLocalUbic === 3 && this.selectedSolicitadoEn === 'Extranjero')
				: true;

			const matchesDate = this.selectedDate
				? new Date(contract.userDate).toISOString().slice(0, 10) === this.selectedDate
				: true;

			return matchesSearch && matchesLegalizacion && matchesSolicitadoEn && matchesDate;
		});
	}

	formatDateToLocal(utcDateStr: string): string {
		const date = new Date(utcDateStr);
		return (
			date.getFullYear() +
			'-' +
			String(date.getMonth() + 1).padStart(2, '0') +
			'-' +
			String(date.getDate()).padStart(2, '0')
		);
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
