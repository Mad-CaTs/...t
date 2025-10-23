import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TableModel } from '@app/core/models/table.model';
import { IRatePenaltyRequest } from '@interfaces/legal-module.interface';
import { NgbModal, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { TablesModule } from '@shared/components/tables/tables.module';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { mockData } from './mock';
import { LegalService } from '@app/legal/services/LegalService';
import { TableService } from '@app/core/services/table.service';

@Component({
	selector: 'app-rate-penalty',
	standalone: true,
	templateUrl: './rate-penalty.component.html',
	styleUrls: ['./rate-penalty.component.scss'],

	imports: [CommonModule, TablesModule, InlineSVGModule, FormsModule, NgbNavModule]
})
export class RatePenaltyComponent implements OnInit {
	// Referencia al modal de exito
	@ViewChild('successModal') successModal!: any;
	//tabla
	readonly table: TableModel<IRatePenaltyRequest>;

	//statusMockData Mocks
	fullDataMock: IRatePenaltyRequest[] = mockData;
	filteredDataMock: IRatePenaltyRequest[] = [...this.fullDataMock];

	//Filtros
	//searchTerm: string = '';
	//isLoading = true;

	searchTerm = '';
	selectedTypeDoc = '';
	selectedSolicitado = '';
	isLoading = false;

	// Nuevos datos para agregar tarifa
	newTariff: Partial<IRatePenaltyRequest> = {
		typeDoc: 'Contrato',
		solicitado: 'Lima',
		status: 'Sin Legalizar',
		precio: '150'
	};

	constructor(
		private legalService: LegalService,
		private tableService: TableService,
		private modalService: NgbModal, //agregado
		private cdr: ChangeDetectorRef
	) {
		this.table = this.tableService.generateTable<IRatePenaltyRequest>({
			headers: ['N°', 'Tipo de documento', 'Solicitado En', 'Status', 'Precio penalidad', 'Acciones']
		});
	}

	ngOnInit(): void {
		this.loadMockData();
		//this.applyFilters();
	}

	loadMockData(): void {
		this.isLoading = true;

		this.searchTerm = '';

		this.table.data = [...this.fullDataMock];
		console.log('Datos cargados:', this.fullDataMock);
		this.applyFilters(); //
		this.cdr.detectChanges();
	}

	applyFilters(): void {
		this.filteredDataMock = this.fullDataMock.filter((item) => {
			const matchesSearch =
				this.searchTerm.trim() === '' ||
				item.typeDoc.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
				item.solicitado.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
				item.status.toLowerCase().includes(this.searchTerm.toLowerCase());

			const matchesType = this.selectedTypeDoc === '' || item.typeDoc === this.selectedTypeDoc;
			const matchesSolicitado =
				this.selectedSolicitado === '' || item.solicitado === this.selectedSolicitado;

			return matchesSearch && matchesType && matchesSolicitado;
		});

		this.table.data = [...this.filteredDataMock];

		this.cdr.detectChanges();
	}

	refreshFilters(): void {
		this.searchTerm = '';
		this.selectedTypeDoc = '';
		this.selectedSolicitado = '';
		this.applyFilters();
	}

	// Abrir modal de agregar tarifa
	openAddTariffModal(content: any): void {
		this.newTariff = {
			typeDoc: 'Contrato',
			solicitado: 'Lima',
			status: 'Sin Legalizar',
			precio: '150'
		};
		this.modalService.open(content, { size: 'md', backdrop: 'static' });
	}

	// Guardar tarifa mock
	saveTariff(modalRef: any): void {
		const newItem: IRatePenaltyRequest = {
			id: this.fullDataMock.length + 1,
			typeDoc: this.newTariff.typeDoc!,
			solicitado: this.newTariff.solicitado!,
			status: this.newTariff.status!,
			precio: this.newTariff.precio!.toString()
		};

		console.log('Nueva tarifa agregada:', newItem);

		this.fullDataMock.push(newItem);
		this.applyFilters();
		modalRef.close();

		// Mostrar modal de confirmacion
		this.modalService.open(this.successModal, { centered: true });
	}
}
