import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { ActivatedRoute, Router } from '@angular/router';
import { PageInfoService, PageLink } from 'src/app/_metronic/layout/core/page-info.service';
import { CorrectionService } from '../services/correction.service';
import { CorrectionDetail, StatusHistory } from '../models/correction.interface';

@Component({
	selector: 'app-history',
	standalone: true,
	imports: [CommonModule, FormsModule, InlineSVGModule],
	providers: [CorrectionService],
	templateUrl: './history.component.html',
	styleUrls: ['./history.component.scss'],


})
export class HistoryComponent implements OnInit {
	username = '';
	partnerName = '';
	searchTerm = '';
	pageSize = 4;
	currentPage = 1;
	type: 'contracts' | 'certificates' = 'contracts';
	correctionId: number | null = null;
	customerId: number | null = null;

	history: StatusHistory[] = [];

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private pageInfo: PageInfoService,
		private correctionService: CorrectionService,
		private cdr: ChangeDetectorRef
	) { }

	ngOnInit() {
		const state = window.history.state;
		console.log('Estado inicial:', state);

		this.type = this.router.url.includes('/contracts/') ? 'contracts' : 'certificates';
		const documentId = state?.documentId || (this.type === 'certificates' ? 1 : 2);
		console.log('Tipo detectado:', this.type, 'DocumentId:', documentId);

		this.pageInfo.setTitle('Historial de cambios');
		const breadcrumbs: PageLink[] = [
			{ title: 'Legal', path: '/dashboard/legal', isActive: false, isSeparator: false },
			{ title: '', path: '', isActive: false, isSeparator: true },
			{
				title: 'Administrador Legal',
				path: '/dashboard/legal/legal-administrator',
				isActive: false,
				isSeparator: false
			},
			{ title: '', path: '', isActive: false, isSeparator: true },
			{
				title: this.type === 'contracts' ? 'Contratos' : 'Certificados',
				path: `/dashboard/legal/correction-requests/${this.type}`,
				isActive: true,
				isSeparator: false
			}
		];
		this.pageInfo.setBreadcrumbs(breadcrumbs);

		this.route.params.subscribe((params) => {
			if (params['username']) {
				console.log('Parámetros de ruta:', params);
				this.username = params['username'];

				if (state) {
					console.log('Estado encontrado:', state);
					this.customerId = state.customerId;
					this.correctionId = state.id;
					this.processDetail(state);
				} else if (state?.id) {
					this.correctionId = Number(state.id);
					console.log('ID de corrección encontrado:', this.correctionId);
					this.loadDetailFromService();
				} else {
					console.error('No se encontró información necesaria en el state');
				}
			}
		});
	}

	loadHistory() {
		if (!this.customerId) {
			console.error('No se encontró el ID del usuario');
			return;
		}

		console.log('Cargando historial para customerId:', this.customerId);
		this.correctionService.getHistory(this.customerId).subscribe({
			next: (response) => {
				console.log('Historial recibido:', response);
				if (Array.isArray(response)) {
					this.history = response.map(item => ({
						...item,
						status: item.status?.toString(),
						partnerName: item.partnerName || this.partnerName
					}));
					this.history.sort((a, b) =>
						new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
					);
				} else {
					console.warn('La respuesta no es un array:', response);
					this.history = [];
				}
				this.cdr.detectChanges();
			},
			error: (error) => {
				console.error('Error al cargar historial:', error);
				this.history = [];
				this.cdr.detectChanges();
			}
		});
	}

	private processDetail(detail: CorrectionDetail) {
		console.log('Procesando detalle completo:', detail);

		const processedDetail = {
			id: detail.id,
			username: detail.username,
			partnerName: detail.partnerName,
			status: detail.status,
			requestDate: detail.requestDate,
			requestMessage: detail.requestMessage || '',
			history: Array.isArray(detail.history) ? detail.history : [],
			documentId: detail.documentId,
			customerId: detail.customerId,
			suscriptionId: detail.suscriptionId,
			nombreSocio: detail.nombreSocio,
			nacionalidad: detail.nacionalidad,
			tipoDocumento: detail.tipoDocumento,
			numeroDocumento: detail.nrodocument,
			paisResidencia: detail.paisResidencia,
			departamento: detail.departamento,
			nombrePaquete: detail.nombrePaquete,
			nombreFamilypackage: detail.nombreFamilypackage,
			numeroAcciones: detail.acciones,
			escalaTotalidad: detail.escalaTotalidad
		};

		console.log('Detalle procesado:', processedDetail);

		this.username = processedDetail.username;
		this.partnerName = processedDetail.partnerName;

		const initialEntry = {
			id: processedDetail.id,
			status: processedDetail.status?.toString(),
			profileType: 'USER',
			partnerName: processedDetail.partnerName,
			message: processedDetail.requestMessage,
			createdAt: processedDetail.requestDate,
			username: processedDetail.username
		};

		if (!processedDetail.history || processedDetail.history.length === 0) {
			console.log('No hay historial, usando entrada inicial:', initialEntry);
			this.history = [initialEntry];
		} else {
			console.log('Procesando historial existente:', processedDetail.history);
			this.history = processedDetail.history.map(h => ({
				...h,
				status: h.status?.toString(),
				partnerName: h.partnerName || this.partnerName
			}));
		}

		this.history.sort((a, b) =>
			new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
		);

		console.log('Historial final:', this.history);
		this.cdr.detectChanges();
	}

	private loadDetailFromService() {
		if (!this.correctionId) return;

		console.log('Cargando detalle del servicio para ID:', this.correctionId);
		this.correctionService.getCorrectionDetail(this.correctionId).subscribe({
			next: (detail) => {
				console.log('Detalle recibido:', detail);

				if (detail.customerId && detail.id_suscription) {
					this.correctionService.getPartnerData(detail.customerId, detail.id_suscription).subscribe({
						next: (partnerData) => {
							console.log('Datos del socio:', partnerData);
							const enrichedDetail = {
								...detail,
								nombreSocio: partnerData.nombreCompleto,
								nacionalidad: partnerData.nacionalidad,
								tipoDocumento: partnerData.tipoDocumento,
								numeroDocumento: partnerData.nrodocument,
								paisResidencia: partnerData.pais,
								departamento: partnerData.distrito,
								nombrePaquete: partnerData.nombrePaquete,
								nombreFamilypackage: partnerData.nombreFamilypackage,
								numeroAcciones: partnerData.acciones,
								escalaTotalidad: partnerData.escalaPago
							};
							this.processDetail(enrichedDetail);
						},
						error: (error) => {
							console.error('Error al obtener datos del socio:', error);
							this.processDetail(detail);
						}
					});
				} else {
					this.processDetail(detail);
				}
			},
			error: (error) => {
				console.error('Error al cargar historial:', error);
			}
		});
	}

	onSearch() {
		this.loadHistory();
	}

	onPageSizeChange() {
		this.currentPage = 1;
		// TODO: Recargar datos con nuevo tamaño de página
	}

	previousPage() {
		if (this.currentPage > 1) {
			this.currentPage--;
			// TODO: Cargar página anterior
		}
	}

	nextPage() {
		this.currentPage++;
		// TODO: Cargar siguiente página
	}

	goToPage(page: number) {
		this.currentPage = page;
		// TODO: Cargar página específica
	}

	viewDetail(item: StatusHistory) {
		if (!this.correctionId) return;

		console.log('Viendo detalle del item:', item);
		this.correctionService.getCorrectionDetail(this.correctionId).subscribe({
			next: (detail) => {
				console.log('Detalle recibido para mostrar:', detail);

				const processedDetail = {
					id: detail.id,
					username: detail.username,
					partnerName: detail.partnerName,
					status: detail.status,
					requestDate: detail.requestDate,
					requestMessage: detail.requestMessage || '',
					history: Array.isArray(detail.history) ? detail.history.map(h => ({
						...h,
						status: h.status?.toString() || '1'
					})) : [],
					documentId: detail.documentId,
					customerId: detail.customerId,
					suscriptionId: detail.suscriptionId,
					nombreSocio: detail.nombreSocio,
					nacionalidad: detail.nacionalidad,
					tipoDocumento: detail.tipoDocumento,
					numeroDocumento: detail.nrodocument,
					paisResidencia: detail.paisResidencia,
					departamento: detail.departamento,
					nombrePaquete: detail.nombrePaquete,
					nombreFamilypackage: detail.nombreFamilypackage,
					numeroAcciones: detail.acciones,
					escalaTotalidad: detail.escalaTotalidad,
					documentFileUrl: detail.documentFileUrl,
					files: detail.files || []
				};

				const navigationState = {
					...processedDetail,
					id: detail.id,
					documentId: detail.documentId,
					nombreCompleto: detail.nombreSocio,
					nacionalidad: detail.nacionalidad,
					tipoDocumento: detail.tipoDocumento,
					nrodocument: detail.nrodocument,
					pais: detail.paisResidencia,
					distrito: detail.departamento,
					nombrePaquete: detail.nombrePaquete,
					nombreFamilypackage: detail.nombreFamilypackage,
					acciones: detail.acciones,
					escalaPago: detail.escalaTotalidad,
					documentFileUrl: detail.documentFileUrl,
					files: detail.files || []
				};

				this.router.navigate(['/dashboard/legal/correction-requests', this.type, 'history', this.username, 'detail'], {
					state: navigationState
				});
			},
			error: (error) => {
				console.error('Error al obtener detalle:', error);
			}
		});
	}

	getStatusClass(status: string | undefined | null): string {
		if (!status) return 'badge-pending';

		const statusClasses: { [key: string]: string } = {
			'1': 'badge-pending',
			'2': 'badge-in-progress',
			'3': 'badge-warning',
			'4': 'badge-completed',
			'SOL_CORRECCION': 'badge-pending',
			'EN_PROCESO': 'badge-in-progress',
			'OBSERVADO': 'badge-warning',
			'CORREGIDO': 'badge-completed'
		};
		return statusClasses[status] || 'badge-pending';
	}

	getStatusText(status: string | undefined | null): string {
		if (!status) return 'Solicitud';

		const statusTexts: { [key: string]: string } = {
			'1': 'Solicitud',
			'2': 'En proceso',
			'3': 'Observado',
			'4': 'Corregido',
			'SOL_CORRECCION': 'Solicitud',
			'EN_PROCESO': 'En proceso',
			'OBSERVADO': 'Observado',
			'CORREGIDO': 'Corregido'
		};
		return statusTexts[status] || 'Solicitud';
	}

	showNotifications(item: StatusHistory) {
		// TODO: Implementar vista de notificaciones
		console.log('Ver notificaciones:', item);
	}
}
