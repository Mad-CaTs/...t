import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { TableModel } from '@app/core/models/table.model';
import { IAuthorizedPerson, IPendingRequestOne, OptionDTO } from '@interfaces/legal-module.interface';
import { TableService } from '@app/core/services/table.service';
import { NgbModal, NgbModalRef, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { TablesModule } from '@shared/components/tables/tables.module';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { FormsModule } from '@angular/forms';

import { LegalService } from '@app/legal/services/LegalService';
import { ModalAcceptPaymentComponent } from '@shared/components/modal-accept-payment/modal-accept-payment.component';
import { ModalSuccessComponent } from '@shared/components/modal-success/modal-success.component';
import { UserAddressPipe } from '../commons/pipes/user-address.pipe';
import { ModalDetailComponent } from '@app/legal/pages/legalization-requests/commons/modals/modal-detail/modal-detail.component';
import { downloadExcelFile, generateFileName } from '@utils/utils';

@Component({
	selector: 'app-pending-requests',
	standalone: true,
	templateUrl: './pending-requests.component.html',
	styleUrls: ['./pending-requests.component.scss'],
	imports: [CommonModule, TablesModule, InlineSVGModule, FormsModule, NgbNavModule, UserAddressPipe]
})
export class PendingRequestsComponent implements OnInit {
	@ViewChild('imageModal') imageModalRef!: TemplateRef<any>;
	selectedImageUrl: string | null = null;
	//Filtros adicionales
	filtroFecha = '';
	filtroLegalizacion = '';
	filtroSolicitadoEn = '';
	isDateAsc = true;

	//Filtro motivos
	selectedItem?: IPendingRequestOne;
	mensajeAdicional = '';
	getDocuments: any[] = [];

	motivos: { text: string; type: number }[] = [];

	motivoSeleccionado: any = null;

	modalRef?: NgbModalRef;
	@ViewChild('rechazoConfirmadoModal') rechazoConfirmadoModalRef!: TemplateRef<any>;

	/**Por defecto en la pestaña “certificados” */
	activeSubTab: 'certificados' | 'contratos' = 'certificados';
	searchTerm = '';
	readonly table: TableModel<IPendingRequestOne> = new TableModel();
	fullData: IPendingRequestOne[] = []; // datos reales
	filteredData: IPendingRequestOne[] = [];

	contracts: any[] = [];
	isLoading = true;
	userPanelId: number = 5;

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
		private modalService: NgbModal, //agregado
		private legalService: LegalService //nuevo servicio
	) {
		this.table = this.tableService.generateTable<IPendingRequestOne>({
			headers: [
				'N°',
				'Username Socio',
				'Solicitante',
				'Doc. de Identidad',
				'Fec. de Solicitud',
				'Cód. Operación',
				'Método de Pago',
				'Solicitado en',
				'Dirección',
				'Familia',
				'Paquete',
				'Legalización',
				//'Serpost',
				'Persona Autorizada',
				'Firma en notaria',
				'Doc. de Identidad Adjunto', //documento de identidad adjunto
				'Monto Total',
				'Voucher', // imagen del voucher subido
				'Validar'
			]
		});
	}

	ngOnInit(): void {
		console.log('Datos zzzque llegan a table.data:', this.table.data);

		// this.loadSubTabData();
		this.loadSubTabDataReal();
		this.motivoSeleccionado = null;
		this.cargarMotivosRechazo();
		this.loadDisponibilidadOpciones();
		this.loadLegalizationMethodOpciones();

		//this.motivoSeleccionado = this.motivos.length > 0 ? this.motivos[0] : null;
		console.log('Motivo seleccionado al inicio:', this.motivoSeleccionado);
		console.log('Lista de motivos:', this.motivos);
		console.log('Lista de disponibilidad(FirmaNotaria):', this.disponibilidadMapTo);
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
		const tipoDocumento = documentTypeId === 1 ? 'Certificados' : 'Contratos';
		this.searchTerm = '';
		this.filtroFecha = '';
		this.filtroLegalizacion = '';
		this.filtroSolicitadoEn = '';
		this.legalService.getAllDocuments().subscribe({
			next: (response) => {
				console.log('Vouchers', response);
				this.getDocuments = response.data;
				this.fullData = (response.data as IPendingRequestOne[]).filter(
					(item) => item.status === 1 && item.documentTypeId === documentTypeId
				);
				// Ordenar por fecha de solicitud descendente
				this.fullData.sort((a, b) => new Date(b.userDate).getTime() - new Date(a.userDate).getTime());
				console.log(`Vouchers Pendientes (${tipoDocumento})`, this.fullData);
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

	applyFilterX(): void {
		const term = this.searchTerm.toLowerCase();

		this.filteredData = this.fullData.filter(
			(item) =>
				item.userRealName.toLowerCase().includes(term) &&
				(this.filtroFecha ? item.userDate === this.filtroFecha : true)
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

			const solicitadoEn = this.filtroSolicitadoEn
				? (item.userLocalUbic === 1 && this.filtroSolicitadoEn === 'Perú - Lima') ||
				  (item.userLocalUbic === 2 && this.filtroSolicitadoEn === 'Provincia') ||
				  (item.userLocalUbic === 3 && this.filtroSolicitadoEn === 'Extranjero')
				: true;

			return fechaOk && legalizacion && solicitadoEn;
		});

		this.cdr.detectChanges();
	}

	/** Resetear filtro */
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

	confirmAprobadoModal(documentKey: string): void {
		const modalRef = this.modalService.open(ModalAcceptPaymentComponent, {
			centered: true,
			backdrop: 'static',
			keyboard: false
		});
		const modal = modalRef.componentInstance;
		modal.title = '¿Desea aceptar la solicitud?';
		modal.description = 'La solicitud de legalizacion sera confirmada.';
		modal.onConfirm.subscribe(() => {
			modalRef.close();
			this.approveDocument(documentKey);
		});
	}

	approveDocument(documentKey: string): void {
		const payload = {
			userPanelId: this.userPanelId,
			documentKey
		};

		this.legalService.approveDocument(payload).subscribe({
			next: () => {
				const modalRef = this.modalService.open(ModalSuccessComponent, {
					centered: true,
					size: 'md'
				});

				const modal = modalRef.componentInstance;
				modal.title = 'Registro exitoso';
				modal.body = 'La solicitud de legalización ha sido aprobada.';

				this.refreshData();
			},
			error: (error) => {
				console.error('Error al aprobar el documento:', error);
			}
		});
	}

	//Open modal rechazadp
	openRechazoModal(content: TemplateRef<any>, item: IPendingRequestOne): void {
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

	onFiltersChange() {
		this.filteredData = this.fullData.filter((states) => {
			const search = this.searchTerm.toLowerCase();
			return this.searchTerm
				? (states.username || '').toLowerCase().includes(search) ||
						(states.userRealName || '').toLowerCase().includes(search) ||
						(states.userDni || '').toLowerCase().includes(search) ||
						(states.documentVoucherKey || '').toLowerCase().includes(search) ||
						(states.id?.toString() || '').includes(search)
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
	hasPaymentMethod(item: IPendingRequestOne): boolean {
		return item.listaVouches?.some((v) => !!v.paymentMethod);
	}

	hasOperationNumber(item: IPendingRequestOne): boolean {
		return item.listaVouches?.some((v) => !!v.operationNumber);
	}

	ordenarPorFecha(): void {
		this.table.data.sort((a, b) => {
			const fechaA = new Date(a.userDate).getTime();
			const fechaB = new Date(b.userDate).getTime();
			return this.isDateAsc ? fechaA - fechaB : fechaB - fechaA;
		});

		this.isDateAsc = !this.isDateAsc;
	}

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

	openDetailModal(item: any) {
		const ref = this.modalService.open(ModalDetailComponent, {
			size: 'lg',
			centered: true
		});

		const modal = ref.componentInstance as ModalDetailComponent;
		modal.title = 'Detalle de dirección consignada';
		modal.data = item;
  }

  downloadConformity(): void {
    this.legalService.downloadConformity().subscribe({
      next: (data: Blob) => {
        const reportName = generateFileName('REPORTE_CONFORMIDAD', 'xlsx');
        downloadExcelFile(data, reportName);
      },
      error: (err) => {
        console.error('Error descargando el reporte de conformidad:', err);
      }
    });
  }

  // Verifica si la URL termina en .pdf (ignorando mayúsculas)
  isPdf(url: string): boolean {
    return url?.toLowerCase().endsWith('.pdf');
  }

  // Si hay error al cargar imagen, usa imagen por defecto
  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = 'assets/images/no-image.png';
  }
}
