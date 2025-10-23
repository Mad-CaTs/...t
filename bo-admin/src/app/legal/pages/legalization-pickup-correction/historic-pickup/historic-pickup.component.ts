import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TableModel } from '@app/core/models/table.model';
import { TableService } from '@app/core/services/table.service';
import {
	IPickupHistoricRequest,
	IPickupHistoricRequestOne,
	IValidatedRequest
} from '@interfaces/legal-module.interface';
import { NgbModal, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { TablesModule } from '@shared/components/tables/tables.module';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { LegalService } from '@app/legal/services/LegalService';

@Component({
	selector: 'app-historic-pickup',
	standalone: true,
	templateUrl: './historic-pickup.component.html',
	styleUrls: ['./historic-pickup.component.scss'],
	imports: [CommonModule, TablesModule, InlineSVGModule, FormsModule, NgbNavModule]
})
export class HistoricPickupComponent implements OnInit {
	//tabla
	readonly table: TableModel<IPickupHistoricRequestOne>;
	//por defecto en la pestaña “certificados”
	activeSubTab: 'certificados' | 'contratos' = 'certificados';
	mostrarContratos = false; //desactiva la pestaña de contratos

	searchTerm = '';
	fullData: IPickupHistoricRequestOne[] = [];
	filteredData: IPickupHistoricRequestOne[] = [];

	@ViewChild('imageModal') imageModalRef!: TemplateRef<any>;
	selectedImageUrl: string | null = null;
	// Filtros adicionales
	filtroFecha = '';
	filtroLegalizacion = '';
	filtroSolicitadoEn = '';
	filtroStatusFinal = '';
	filtroStatus: string = '';

	isLoading = true;
	//datos mock
	//certificadosData: IPickupHistoricRequest[] = certificadosData;
	//contratosData: IPickupHistoricRequest[] = contratosData;

	constructor(
		private cdr: ChangeDetectorRef,
		private tableService: TableService,
		private modalService: NgbModal, // agregado
		private legalService: LegalService //nuevo servicio
	) {
		this.table = this.tableService.generateTable<IPickupHistoricRequestOne>({
			headers: [
				'N°',
				'Fec. de Solicitud',
				'Solicitante',
				'DNI',
				//'Tipo de documento', //falta por parte de back
				'Legalización',
				//'Portafolio',
				'Modificar el lugar de recojo a',
				'Estado de legalización',
				'Pago por penalidad',
				'Voucher',
				'Estado Final'
			]
		});
	}

	ngOnInit(): void {
		//this.loadSubTabData();
		this.loadSubTabDataReal();
	}

	/** carga datos según la sub-pestaña activa */
	/* loadSubTabDataX(): void {
		this.searchTerm = '';
		this.filtroFecha = '';
		this.filtroLegalizacion = '';
		this.filtroSolicitadoEn = '';
		this.filtroStatusFinal = '';
		this.fullData = this.activeSubTab === 'certificados' ? this.certificadosData : this.contratosData;

		this.table.data = [...this.fullData];
		this.cdr.detectChanges();
	} */

	loadSubTabDataReal(): void {
		const documentTypeId = this.activeSubTab === 'certificados' ? 1 : 2;
		this.searchTerm = '';
		this.filtroFecha = '';
		this.filtroLegalizacion = '';
		this.filtroSolicitadoEn = '';
		this.legalService.getAllRectifications().subscribe({
			next: (response) => {
				this.fullData = (response.data as IPickupHistoricRequestOne[]).filter(
					(item) => item.status === 2 || item.status === 3
				);
				console.log('Rectificaciones Historicos', this.fullData);
				this.table.data = [...this.fullData];
				this.cdr.detectChanges();
				this.isLoading = false;
			},

			error: (error) => {
				console.error('Error cargando documentos', error);
				this.fullData = [];
				this.table.data = [];
				this.isLoading = false;
				this.cdr.detectChanges();
			}
		});
	}

	/** Cambio de sub-pestaña */
	onSubTabChange(tab: 'certificados' | 'contratos'): void {
		this.activeSubTab = tab;
		this.loadSubTabDataReal();
	}

	applyFilter(): void {
		this.table.data = this.fullData.filter((item) => {
			const fechaOk = this.filtroFecha
				? this.formatDateToLocal(item.userDate)?.startsWith(this.filtroFecha)
				: true;

			const legalizacion = this.filtroLegalizacion
				? (item.legalizationType === 1 && this.filtroLegalizacion === 'Regular') ||
				  (item.legalizationType === 2 && this.filtroLegalizacion === 'Express')
				: true;

			//aca deberia venir del back Oficina de Surquillo y Club Ribera del Rio
			const solicitadoEn = this.filtroSolicitadoEn
				? (item.userLocalUbic === 1 && this.filtroSolicitadoEn === 'Perú - Lima') ||
				  (item.userLocalUbic === 2 && this.filtroSolicitadoEn === 'Provincia') ||
				  (item.userLocalUbic === 3 && this.filtroSolicitadoEn === 'Extranjero')
				: true;

			const statusOk = this.filtroStatus
				? (item.status === 2 && this.filtroStatus === 'Validado') ||
				  (item.status === 3 && this.filtroStatus === 'Rechazado')
				: true;

			return fechaOk && legalizacion && solicitadoEn && statusOk;
		});

		this.cdr.detectChanges();
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

	/* applyFilter(): void {
		const term = this.searchTerm.toLowerCase();

		//agregar paginacion a esto

		this.filteredData = this.fullData.filter(
			(item) =>
				item.solicitante.toLowerCase().includes(term) &&
				(this.filtroFecha ? item.fechaSolicitud === this.filtroFecha : true) &&
				(this.filtroLegalizacion ? item.legalizacion === this.filtroLegalizacion : true) &&
				(this.filtroSolicitadoEn ? item.nuevoLugarRecojo === this.filtroSolicitadoEn : true) &&
				(this.filtroStatusFinal ? item.statusFinal === this.filtroStatusFinal : true)
		);

		this.table.data = [...this.filteredData];
		this.cdr.detectChanges();
	} */

	/** Resetear filtro */
	refreshData(): void {
		this.loadSubTabDataReal();
	}

	//para abrir la imagen opc1
	openImagePreview(url?: string): void {
		if (!url) return;
		this.selectedImageUrl = url;
		this.modalService.open(this.imageModalRef, { size: 'lg', centered: true });
	}

	onFiltersChange() {
		this.filteredData = this.fullData.filter((states) => {
			const search = this.searchTerm.toLowerCase();
			return this.searchTerm
				? //states.userId.toLowerCase().includes(search) ||
				  states.userRealName.toLowerCase().includes(search) ||
						states.userDni.toLowerCase().includes(search) ||
						//states.documentVoucherKey.toLowerCase().includes(search) ||
						states.portfolioName.toLowerCase().includes(search) ||
						states.id.toString().includes(search)
				: true;
		});
		this.table.data = [...this.filteredData];
		this.cdr.detectChanges();
	}
	clearFilters() {
		this.searchTerm = '';
		this.filteredData = [...this.fullData];
		this.table.data = [...this.fullData];
		this.cdr.detectChanges();
	}
}
