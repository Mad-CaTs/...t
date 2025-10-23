import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TableModel } from '@app/core/models/table.model';
import { TableService } from '@app/core/services/table.service';
import { IPickupPendingRequestOne } from '@interfaces/legal-module.interface';
import { NgbModal, NgbModalRef, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { TablesModule } from '@shared/components/tables/tables.module';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { formatDate } from '@angular/common';
import { LegalService } from '@app/legal/services/LegalService';

@Component({
	selector: 'app-pending-pickup',
	standalone: true,
	templateUrl: './pending-pickup.component.html',
	styleUrls: ['./pending-pickup.component.scss'],
	imports: [CommonModule, TablesModule, InlineSVGModule, FormsModule, NgbNavModule]
})
export class PendingPickupComponent implements OnInit {
	@ViewChild('imageModal') imageModalRef!: TemplateRef<any>;
	selectedImageUrl: string | null = null;

	// Filtros adicionales de fechas
	filtroFecha = '';
	filtroLegalizacion = '';
	filtroSolicitadoEn = '';

	//filtroFecha: string = ''; // sigue en formato dd/MM/yyyy
	fechaInput: string = ''; // se usa solo para el input type="date"

	//motivos
	//selectedItem?: IPendingRequest;
	selectedItem?: IPickupPendingRequestOne;
	//motivoSeleccionado = '';

	motivos: { text: string; type: number }[] = [];
	motivoSeleccionado: any = null;
	mensajeAdicional = '';
	motivosNew = [
		{ text: 'No cuenta con el importe correcto', type: 6 },
		{ text: 'Documento ilegible', type: 7 },
		{ text: 'No corresponde al trámite solicitado', type: 8 }
		//Agregar mas motivos
	];
	//motivos = ['Falta de información', 'Datos incorrectos', 'Otro'];
	modalRef?: NgbModalRef;
	@ViewChild('rechazoConfirmadoModal') rechazoConfirmadoModalRef!: TemplateRef<any>;

	readonly table: TableModel<IPickupPendingRequestOne>;
	/** Por defecto en la pestaña “certificados” */
	activeSubTab: 'certificados' | 'contratos' = 'certificados';
	searchTerm = '';
	fullData: IPickupPendingRequestOne[] = [];
	filteredData: IPickupPendingRequestOne[] = [];

	isLoading = true;

	mostrarContratos = false; //desactiva la pestaña de contratos
	userPanelId: number = 5;

	//certificadosPickupData: IPickupPendingRequest[] = certificadosPickupData;
	//contratosPickupData: IPickupPendingRequest[] = contratosPickupData;

	constructor(
		private cdr: ChangeDetectorRef,
		private tableService: TableService,
		private modalService: NgbModal, //agregado
		private legalService: LegalService //nuevo servicio
	) {
		this.table = this.tableService.generateTable<IPickupPendingRequestOne>({
			headers: [
				'N°',
				'Fec. de Solicitud',
				'Solicitante',
				'Documento',
				//'Tipo de documento', //Contrato o Certificado
				'Legalización',
				//'Portafolio',
				'Modificar el lugar de recojo a',
				'Estado de legalización',
				'Pago por penalidad',
				'Voucher',
				'Validar'
			]
		});
	}

	ngOnInit(): void {
		this.loadSubTabDataReal();
		this.motivoSeleccionado = null;
		this.cargarMotivosRechazo();
		console.log('Motivo seleccionado al inicio:', this.motivoSeleccionado);
		console.log('Lista de motivos:', this.motivos);
	}

	cargarMotivosRechazo(): void {
		this.legalService.getRejectReasons().subscribe({
			next: (response) => {
				this.motivos = response.data.map((item: any) => ({
					text: item.categorieItemName,
					type: item.categorieItemId,
					categorie: item.categorieName
				}));
				console.log('Motivos cargados:', this.motivos);
			},
			error: (error) => {
				console.error('Error al cargar motivos de rechazo:', error);
			}
		});
	}

	/** carga datos según la sub-pestaña activa */
	loadSubTabDataReal(): void {
		const documentTypeId = this.activeSubTab === 'certificados' ? 1 : 2;
		this.searchTerm = '';
		this.filtroFecha = '';
		this.filtroLegalizacion = '';
		this.filtroSolicitadoEn = '';
		this.legalService.getAllRectifications().subscribe({
			next: (response) => {
				this.fullData = (response.data as IPickupPendingRequestOne[]).filter(
					(item) => item.status === 1
				);
				console.log('Rectificaciones Pendientes', this.fullData);
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

	/** carga datos según la sub-pestaña activa */
	/* loadSubTabData(): void {
    this.searchTerm = '';
    this.filtroFecha = '';
    this.filtroLegalizacion = '';
    this.filtroSolicitadoEn = '';
    this.fullData = this.activeSubTab === 'certificados' ? this.certificadosPickupData : this.contratosPickupData;

    this.table.data = [...this.fullData];
    this.cdr.detectChanges();
  } */

	/** Cambio de sub-pestaña */
	onSubTabChange(tab: 'certificados' | 'contratos'): void {
		this.activeSubTab = tab;
		this.loadSubTabDataReal();
	}

	applyFilterXX(): void {
		const term = this.searchTerm.toLowerCase();

		// Convierte las fechas a formato dd-MM-yyyy para comparación
		const formatFecha = (fecha: string) => {
			const dateParts = fecha.split('/');
			return `${dateParts[0]}-${dateParts[1]}-${dateParts[2]}`; // dd-MM-yyyy
		};

		this.filteredData = this.fullData.filter(
			(item) =>
				item.userRealName.toLowerCase().includes(term) &&
				(this.filtroFecha ? formatFecha(item.userDate) === this.filtroFecha : true)
			//&& (this.filtroLegalizacion ? item.legalizacion === this.filtroLegalizacion : true) &&
			//(this.filtroSolicitadoEn ? item.nuevoLugarRecojo === this.filtroSolicitadoEn : true)
		);

		this.table.data = [...this.filteredData];
		this.cdr.detectChanges();
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

	//resetear filtro
	refreshData(): void {
		this.loadSubTabDataReal();
		this.motivoSeleccionado = null;
		console.log('Motivo seleccionado al inicio:', this.motivoSeleccionado);
		console.log('Lista de motivos:', this.motivos);
	}

	//para abrir la imagen opc1
	openImagePreview(url?: string): void {
		if (!url) return;
		this.selectedImageUrl = url;
		this.modalService.open(this.imageModalRef, { size: 'lg', centered: true });
	}

	//para abrir la imagen opc2
	abrirImagen(url?: string): void {
		if (!url) return;
		window.open(url, '_blank');
	}

	openAprobadoModalNew(documentKey: string, content: TemplateRef<any>): void {
		const payload = {
			userPanelId: this.userPanelId,
			documentKey
		};

		this.legalService.approveDocument(payload).subscribe({
			next: (message: any) => {
				this.modalRef = this.modalService.open(content, { centered: true });
				this.refreshData();
				console.log('Respuesta del backend:', message);
			},
			error: (error) => {
				console.error('Error al aprobar el documento:', error);
				//opcional: mostrar modal de error
			}
		});
	}

	//open modal aprobado rectificacion
	openAprobadoModal(content: TemplateRef<any>): void {
		this.modalRef = this.modalService.open(content, { centered: true });
	}

	openRechazoModal(content: TemplateRef<any>, item: IPickupPendingRequestOne): void {
		this.selectedItem = item;
		this.mensajeAdicional = '';
		this.motivoSeleccionado = null;
		this.modalRef = this.modalService.open(content, { centered: true });
		console.log(this.motivoSeleccionado);
	}

	confirmarRechazo(): void {
		console.log(this.motivoSeleccionado, 'motivo');
		console.log(this.mensajeAdicional, 'mensaje adicional');
		if (!this.selectedItem || !this.motivoSeleccionado) return;
		const payload = {
			userPanelId: 10,
			reasonText: this.mensajeAdicional,
			reasonType: this.motivoSeleccionado.type
		};

		console.log('Payload enviado al backend:', payload);

		this.legalService.rejectDocument(this.selectedItem.documentKey, payload).subscribe({
			next: (response: string) => {
				console.log('Documento rechazado exitosamente:', response);
				this.modalRef?.close();
				this.refreshData();
			},
			error: (error) => {
				console.error('Error al rechazar el documento:', error);
			}
		});
	}

	convertToDateInputFormat(fecha: string): string {
		// Acepta tanto dd/MM/yyyy como dd-MM-yyyy
		const [day, month, year] = fecha.includes('/') ? fecha.split('/') : fecha.split('-');
		return `${year}-${month}-${day}`;
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
