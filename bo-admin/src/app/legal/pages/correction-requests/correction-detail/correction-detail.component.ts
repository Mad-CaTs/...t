import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { getCokkie } from 'src/app/utils/cokkies';
import { SafePipe } from '../pipes/safe.pipe';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { ActivatedRoute, Router } from '@angular/router';
import { PageInfoService, PageLink } from 'src/app/_metronic/layout/core/page-info.service';
import { LegalService } from 'src/app/legal/services/LegalService';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CertificateGenerationService } from '../services/certificate-generation.service';

enum ProjectType {
	JOYA = 'JOYA',
	RIBERA = 'RIBERA'
}

interface ICorrectionRequestHistory {
	id: number;
	username: string;
	userType: string;
	date: string;
	message: string;
	status: string;
	documentUrl: string;
	documentName: string;
	projectType: ProjectType;
	notifications?: {
		date: string;
		message: string;
		status: string;
	}[];
}

interface IChangeDocumentStatusRequest {
	userPanelId: number;
	status: number;
	reasonType: number;
	reasonText: string;
	projectType: ProjectType;
}

import { CorrectionHistoryData } from '../services/certificate-generation.service';
import { CorrectionFile } from '../models/correction.interface';
import { getStatusText, getStatusClass } from '../models/status.enum';

@Component({
	selector: 'app-correction-detail',
	standalone: true,
	imports: [CommonModule, FormsModule, InlineSVGModule, SafePipe],
	templateUrl: './correction-detail.component.html',
	styleUrls: ['./correction-detail.component.scss'],


})
export class CorrectionDetailComponent implements OnInit, AfterViewInit, OnDestroy {
	public ngOnInit(): void {
		this.initializeComponent();
	}

	public ngAfterViewInit(): void {
		this.initializeView();
	}

	public ngOnDestroy(): void {
		this.cleanup();
	}

	@ViewChild('documentModal') private documentModal: any;
	@ViewChild('observationModal') private observationModal: any;
	@ViewChild('successModal') private successModal: any;
	@ViewChild('errorModal') private errorModal: any;

	protected isFromHistory = false;
	protected observationText = '';

	protected requestData: CorrectionHistoryData = {
		id: 0,
		customerId: 0,
		username: '',
		partnerName: '',
		portfolio: '',
		documentType: '',
		identityDocument: '',
		documentNumber: '',
		requestMessage: '',
		status: '',
		requestDate: '',
		files: [],
		history: [],
		id_suscription: 0
	};
	protected mainDocumentUrl: string | null = null;
	protected errorMessage = '';
	private selectedFile: {
		id?: number;
		id_correction_request_file?: number;
		url?: string;
		s3_url?: string;
		fileName?: string;
		file_name?: string;
		fileType?: string;
		file_type?: string;
		uploadedAt?: string;
		uploaded_at?: string;
		documentId?: string;
	} | null = null;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private pageInfo: PageInfoService,
		private legalService: LegalService,
		private modalService: NgbModal,
		private certificateService: CertificateGenerationService
	) { }

	private initializeComponent(): void {
		const savedData = this.certificateService.getCurrentCorrectionData();
		if (savedData) {
			this.requestData = savedData;
			this.isFromHistory = true;
		} else {
			const state = window.history.state;
			console.log('Estado recibido en detail:', state);
			if (state) {
				console.log('Estado detallado:', state);
				this.requestData = {
					...this.requestData,
					...state,
					id: state.id,
					customerId: state.customerId,
					username: state.username,
					partnerName: state.partnerName,
					portfolio: state.portfolio,
					documentType: state.documentType,
					identityDocument: state.identityDocument,
					documentNumber: state.documentNumber,
					requestMessage: state.requestMessage,
					status: state.status,
					requestDate: state.requestDate,
					files: state.files || [],
					history: state.history || [],
					id_suscription: state.suscriptionId || state.id_suscription,
					documentFileUrl: state.documentFileUrl
				};
				console.log('RequestData después de mapeo:', this.requestData);
				this.certificateService.setCorrectionData(this.requestData);
			}
			console.log('Datos de la solicitud procesados:', this.requestData);

			if (this.requestData.id_suscription && this.requestData.customerId) {
				this.certificateService
					.getPartnerData(this.requestData.customerId, this.requestData.id_suscription)
					.subscribe({
						next: (partnerData) => {
							console.log('Datos del socio obtenidos:', partnerData);
							this.requestData = {
								...this.requestData,
								portfolio: partnerData.familyPackageName || '',
								documentType: partnerData.documentType || '',
								id_suscription: partnerData.idSuscription || 0,
								status: this.requestData.status
							};
							console.log('Estado actualizado:', this.requestData.status);
						},
						error: (error: Error) => {
							console.error('Error al obtener datos del socio:', error);
							this.showError(
								'Error al obtener los datos del socio. Por favor, intente nuevamente.'
							);
						}
					});
			}

			this.mainDocumentUrl = this.requestData.documentFileUrl || null;
			console.log('URL del documento principal:', this.mainDocumentUrl);
		}

		this.pageInfo.setTitle('Solicitud de corrección');
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
				title: 'Historial de cambios',
				path: '/dashboard/legal/correction-requests/history',
				isActive: false,
				isSeparator: false
			},
			{ title: '', path: '', isActive: false, isSeparator: true },
			{ title: 'Solicitud de corrección', path: '', isActive: true, isSeparator: false }
		];
		this.pageInfo.setBreadcrumbs(breadcrumbs);
	}

	private initializeView(): void {
		// No initialization needed
	}

	protected getCorrectionFile(): CorrectionFile | undefined {
		return this.requestData.files?.find(f => f.fileType === 'DOCUMENT_CORRECTION');
	}

	protected getAdditionalFiles(): CorrectionFile[] {
		return this.requestData.files?.filter(f => f.fileType === 'ADDITIONAL_DOCUMENT_CORRECTION') || [];
	}

	protected viewDocument = (): void => {
		const correctionFile = this.requestData.files?.find(f => f.fileType === 'DOCUMENT_CORRECTION');
		if (correctionFile?.url || correctionFile?.s3Url) {
			window.open(correctionFile.url || correctionFile.s3Url, '_blank');
		} else {
			console.error('No se encontró documento de corrección');
		}
	};

	protected viewFile = (file: CorrectionFile): void => {
		const fileUrl = file?.s3Url || file?.url;
		if (fileUrl) {
			window.open(fileUrl, '_blank');
		} else {
			console.error('No se encontró URL para el archivo:', file);
		}
	};

	protected openDocumentModal = (file: unknown): void => {
		this.selectedFile = file as typeof this.selectedFile;
		const modalRef = this.modalService.open(this.documentModal, {
			size: 'lg',
			centered: true,
			backdrop: 'static'
		});

		modalRef.result.then(
			(result) => {
				if (result === 'Observar') {
					this.showObservationModal();
				}
			},
			() => { }
		);
	};

	private showObservationModal = (): void => {
		const modalRef = this.modalService.open(this.observationModal, {
			size: 'lg',
			centered: true,
			backdrop: 'static'
		});

		modalRef.result.then(
			(result) => {
				if (result === 'Confirmar') {
					this.showSuccessModal();
				}
			},
			() => { }
		);
	};

	private showSuccessModal = (message: string = 'El documento ha sido observado exitosamente.'): void => {
		const modalRef = this.modalService.open(this.successModal, {
			centered: true,
			backdrop: 'static'
		});

		modalRef.componentInstance.message = message;

		modalRef.result.then(
			() => {
				this.goBack();
			},
			() => { }
		);
	};

	protected showError = (message: string): void => {
		this.errorMessage = message;
		this.modalService.open(this.errorModal, {
			centered: true,
			backdrop: 'static'
		});
	};

	protected getFileIcon = (fileName: string): string => {
		const extension = fileName.split('.').pop()?.toLowerCase();
		switch (extension) {
			case 'pdf':
				return 'fas fa-file-pdf';
			case 'jpg':
			case 'jpeg':
			case 'png':
				return 'fas fa-file-image';
			default:
				return 'fas fa-file';
		}
	};

	protected correctDocument = (): void => {
		const type = this.router.url.includes('/contracts/') ? 'contracts' : 'certificates';

		if (!this.requestData.id) {
			this.showError('No se encontró el ID de la solicitud.');
			return;
		}

		const token = getCokkie('TOKEN');
		if (!token) {
			this.showError('No se encontró el token de autorización. Por favor, inicie sesión nuevamente.');
			return;
		}

		this.certificateService
			.getPartnerData(this.requestData.customerId, this.requestData.id_suscription)
			.subscribe({
				next: (partnerData) => {
					console.log('Datos del socio obtenidos:', partnerData);
					if (!this.mainDocumentUrl) {
						this.showError('No se encontró el documento a corregir.');
						return;
					}

					const route = `/dashboard/legal/correction-requests/${type}/history/${this.requestData.username}/edit`;
					void this.router.navigate([route], {
						state: {
							detail: {
								...this.requestData,
								partnerData,
								pdfUrl: this.mainDocumentUrl,
								id: this.requestData.id
							}
						}
					});
				},
				error: (error: Error) => {
					console.error('Error al obtener datos del socio:', error);
					this.showError('Error al obtener los datos del socio. Por favor, intente nuevamente.');
				}
			});
	};

	protected acceptCorrection = (): void => {
		const modalRef = this.modalService.open(this.observationModal, {
			size: 'lg',
			centered: true,
			backdrop: 'static'
		});

		modalRef.componentInstance.title = 'Aceptar Corrección';
		modalRef.componentInstance.message = '¿Está seguro que desea aceptar esta corrección?';
		modalRef.componentInstance.observationLabel = 'Comentarios (opcional)';
		modalRef.componentInstance.confirmButtonText = 'Aceptar';
		modalRef.componentInstance.confirmButtonClass = 'btn-success';

		modalRef.result.then(
			(result) => {
				if (result === 'Confirmar') {
					this.showSuccessModal('La corrección ha sido aceptada exitosamente.');
				}
			},
			() => { }
		);
	};

	protected rejectCorrection = (): void => {
		const modalRef = this.modalService.open(this.observationModal, {
			size: 'lg',
			centered: true,
			backdrop: 'static'
		});

		modalRef.componentInstance.title = 'Rechazar Corrección';
		modalRef.componentInstance.message = '¿Está seguro que desea rechazar esta corrección?';
		modalRef.componentInstance.observationLabel = 'Motivo del rechazo';
		modalRef.componentInstance.confirmButtonText = 'Rechazar';
		modalRef.componentInstance.confirmButtonClass = 'btn-danger';

		modalRef.result.then(
			(result) => {
				if (result === 'Confirmar') {
					this.showSuccessModal('La corrección ha sido rechazada.');
				}
			},
			() => { }
		);
	};

	private cleanup(): void {
		if (!this.isFromHistory) {
			this.certificateService.clearCorrectionData();
		}
	}

	protected getStatusText = (status: string): string => {
		return getStatusText(status);
	};

	protected getStatusBadgeClass = (status: string): string => {
		return getStatusClass(status);
	};

	protected goBack = (): void => {
		const path = this.router.url.includes('/contracts/') ? 'contracts' : 'certificates';
		void this.router.navigate([
			'/dashboard/legal/correction-requests',
			path,
			'history',
			this.requestData.username
		]);
	};
}
