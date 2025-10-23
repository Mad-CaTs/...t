import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TableModel } from '@app/core/models/table.model';
import { TableService } from '@app/core/services/table.service';
import { IAuthorizedPerson, IValidatedRequestOne, OptionDTO } from '@interfaces/legal-module.interface';
import { NgbModal, NgbModalRef, NgbNavModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { TablesModule } from '@shared/components/tables/tables.module';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { LegalService } from '@app/legal/services/LegalService';

@Component({
	selector: 'app-validated-requests',
	standalone: true,
	templateUrl: './validated-requests.component.html',
	styleUrls: ['./validated-requests.component.scss'],
	imports: [CommonModule, TablesModule, InlineSVGModule, FormsModule, NgbNavModule, NgbPaginationModule]
})
export class ValidatedRequestsComponent implements OnInit {
	//tabla
	readonly table: TableModel<IValidatedRequestOne> = new TableModel();
	//por defecto en la pestaña “certificados”
	activeSubTab: 'certificados' | 'contratos' = 'certificados';

	searchTerm = '';
	fullData: IValidatedRequestOne[] = [];
	filteredData: IValidatedRequestOne[] = [];

	//paginación
	page = 1;
	pageSize = 5;
	paginatedData: IValidatedRequestOne[] = [];

	@ViewChild('imageModal') imageModalRef!: TemplateRef<any>;
	selectedImageUrl: string | null = null;
	// Filtros adicionales
	filtroFecha = '';
	filtroLegalizacion = '';
	filtroSolicitadoEn = '';

	isLoading = true;

	//Firma en notaria
	textoSeleccionado: string = '';
	disponibilidadOpciones: OptionDTO[] = [];
	disponibilidadLegalizarOpciones: OptionDTO[] = [];
	disponibilidadMapTo: { [key: number]: string } = {};
	disponibilidaLegalizardMapTo: { [key: number]: string } = {};

	selectedAuthorizedPerson?: IAuthorizedPerson;
	selectedSerpost: any;

	constructor(
		private cdr: ChangeDetectorRef,
		private tableService: TableService,
		private modalService: NgbModal, // agregado
		private legalService: LegalService //nuevo servicio
	) {
		this.table = this.tableService.generateTable<IValidatedRequestOne>({
			headers: [
				'N°',
				'Username Socio',
				'Solicitante',
				'Doc. de Identidad',
				'Fec. de Solicitud',
				'Cód. Operación',
				'Solicitado en',
				'Familia',
				'Paquete',
				'Método de Pago',
				'Legalización',
				'Serpost',
				'Persona Autorizada',
				'Firma en notaria',
				'Status'
			]
		});
	}

	ngOnInit(): void {
		this.loadSubTabDataReal();
		this.loadDisponibilidadOpciones();
		console.log('Lista de disponibilidad(FirmaNotaria):', this.disponibilidadMapTo);
		this.loadLegalizationMethodOpciones();
		console.log('Lista de disponibilidad Lima(FirmaNotaria):', this.disponibilidadMapTo);
	}

	private loadDisponibilidadOpciones(): void {
		this.legalService.getOptions('DISPONIBILIDAD_TRAMITE').subscribe({
			next: (data) => {
				this.disponibilidadOpciones = data;
				this.disponibilidadMapTo = data.reduce((acc, opt) => {
					acc[opt.code] = opt.description;
					return acc;
				}, {} as { [key: number]: string });
			},
			error: (err) => console.error('Error cargando opciones:', err)
		});
	}

	private loadLegalizationMethodOpciones(): void {
		this.legalService.getOptions('DISPONIBILIDAD_LEGALIZAR').subscribe({
			next: (data) => {
				this.disponibilidadLegalizarOpciones = data;
				this.disponibilidaLegalizardMapTo = data.reduce((acc, opt) => {
					acc[opt.code] = opt.description;
					return acc;
				}, {} as { [key: number]: string });
			},
			error: (err) => console.error('Error cargando opciones:', err)
		});
	}

	/** carga datos según la sub-pestaña activa */
	loadSubTabDataReal(): void {
		const documentTypeId = this.activeSubTab === 'certificados' ? 1 : 2;
		const tipoDocumento = documentTypeId === 1 ? 'Certificados' : 'Contratos';
		this.searchTerm = '';
		this.filtroFecha = '';
		this.filtroLegalizacion = '';
		this.filtroSolicitadoEn = '';
		this.legalService.getAllDocuments().subscribe({
			next: (response) => {
				console.log('Vouchers', response);
				this.fullData = (response.data as IValidatedRequestOne[]).filter(
					(item) => item.status === 2 && item.documentTypeId === documentTypeId
				);
				// Ordenar por fecha de solicitud descendente
				this.fullData.sort((a, b) => new Date(b.userDate).getTime() - new Date(a.userDate).getTime());
				console.log(`Vouchers Validados (${tipoDocumento})`, this.fullData);
				this.table.data = [...this.fullData];
				this.cdr.detectChanges();
				this.isLoading = false;
			},
			error: (error) => {
				console.error('Error cargando documentos:', error);
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

			const solicitadoEn = this.filtroSolicitadoEn
				? (item.userLocalUbic === 1 && this.filtroSolicitadoEn === 'Perú - Lima') ||
				  (item.userLocalUbic === 2 && this.filtroSolicitadoEn === 'Provincia') ||
				  (item.userLocalUbic === 3 && this.filtroSolicitadoEn === 'Extranjero')
				: true;

			return fechaOk && legalizacion && solicitadoEn;
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

	/** Resetear filtro */
	refreshData(): void {
		this.loadSubTabDataReal();
	}

	//filtro paginacion
	applyPagination(): void {
		const data = this.filteredData.length ? this.filteredData : this.fullData;
		const start = (this.page - 1) * this.pageSize;
		const end = start + this.pageSize;
		this.paginatedData = data.slice(start, end);
		this.table.data = [...this.paginatedData];
		this.cdr.detectChanges();
	}

	onPageChange(newPage: number): void {
		this.page = newPage;
		this.applyPagination();
	}

	onFiltersChange() {
		this.filteredData = this.fullData.filter((states) => {
			const search = this.searchTerm.toLowerCase();
			return this.searchTerm
				? (states.username || '').toLowerCase().includes(search) ||
						(states.userRealName || '').toLowerCase().includes(search) ||
						(states.userDni || '').toLowerCase().includes(search) ||
						(states.documentVoucherKey || '').toLowerCase().includes(search) ||
						states.id?.toString().includes(search)
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

	hasPaymentMethod(item: IValidatedRequestOne): boolean {
		return item.listaVouches?.some((v) => !!v.paymentMethod);
	}

	/* openDisponibilidad(content: TemplateRef<any>, disponibilidadId: number | null) {
		this.textoSeleccionado = this.disponibilidadMapTo[disponibilidadId!] ?? '—';
		this.modalService.open(content, { size: 'lg' });
	} */

	openDisponibilidad(content: TemplateRef<any>, id: number | null, userLocalUbic: number) {
		if (userLocalUbic === 1) {
			// Para Lima -> legalizationMethodId
			this.textoSeleccionado = this.disponibilidaLegalizardMapTo[id!] ?? '—';
		} else {
			// Para provincia -> disponibilidadTramiteId
			this.textoSeleccionado = this.disponibilidadMapTo[id!] ?? '—';
		}

		this.modalService.open(content, { size: 'lg' });
	}

	openAuthorizedPerson(content: any, authorizedPerson: IAuthorizedPerson) {
		this.selectedAuthorizedPerson = authorizedPerson;
		this.modalService.open(content, { size: 'lg' });
	}

	openSerpost(content: any, item: any) {
		this.selectedSerpost = item;
		this.modalService.open(content, { size: 'lg' });
	}
}
