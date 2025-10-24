import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { finalize, map, Observable } from 'rxjs';
import { DocumentService } from 'src/app/profiles/pages/partner/pages/my-products/pages/documents/commons/services/documents-service';
import { ActionItemsListComponent } from '../action-items-list/action-items-list.component';
import { DialogService } from 'primeng/dynamicdialog';
import { ModalLegalizationSource } from '../../../../../../commons/modals/modal-legalization-source/modal-legalization-source';
import { ModalGenerateDocumentComponent } from '../../modals/modal-generate-document/modal-generate-document';
import { LegalDocument, LegalDocumentPackage } from '@shared/interfaces/legal-document-package';
import { ArrayDatePipe } from '../../../../../../../../../../../shared/pipe/array-date.pipe';
import { LegalizationService } from '../../../../../../commons/services/legalization.service';
import { LegalizationNoticeModal } from 'src/app/profiles/pages/partner/pages/my-products/pages/documents/pages/validate-documents/commons/components/confirm-shipping-address/commons/modals/app-legalization-notice-modal/app-legalization-notice-modal.component';
import { GenerateNoticeModal } from 'src/app/profiles/pages/partner/pages/my-products/pages/documents/pages/validate-documents/commons/components/confirm-shipping-address/commons/modals/app-generate-noticeModal/app-generate-notice-modal.component';
import { Router } from '@angular/router';
import { LegalizationRequestService } from '../../../../document-status/commons/services/legalization-request-service';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';

@Component({
	selector: 'app-document-summary-card',
	standalone: true,
	imports: [CommonModule, ActionItemsListComponent, ArrayDatePipe],
	templateUrl: './document-summary-card.component.html',
	styleUrl: './document-summary-card.component.scss'
})
export class DocumentSummaryCardComponent implements OnChanges {
	@Input() document: LegalDocument;
	@Input() date!: LegalDocument;
	@Input() isFirst: boolean = false;
	@Input() isDisabled: boolean = false;
	public documentAlreadyGenerated: boolean = false;
	public loadingMap: { [key: number]: boolean } = {};
	selectedProduct: any;
	public isLoading: boolean = false;
	link$!: Observable<string>;
	documentLink: string = '#';
	documentIdselect: any;
	documentSerial: any;
	idLegalDocument: any;
	userInfo: any;
	constructor(
		private documentService: DocumentService,
		private dialogService: DialogService,
		private legalizationService: LegalizationService,
		private router: Router,
		private legalizationRequestService: LegalizationRequestService,
		private userInfoService: UserInfoService
	) {
		this.userInfo = this.userInfoService.userInfo;
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['document']) {
			console.log('📄 Documento recibido:', this.document);
		}
	}
	ngOnInit(): void {
		this.selectedProduct = JSON.parse(sessionStorage.getItem('selectedProduct') || '{}');
		this.link$ = this.getDocumentLink$();
		this.link$.subscribe((link) => {
			this.documentAlreadyGenerated = link !== '#';
		});
	}

	getDocumentLink$(): Observable<string> {
		this.isLoading = true;
		return this.documentService
			.getDocumentsLink(
				this.document.id,
				this.date.idLegalDocument,
				this.document.idFamilyPackage,
				false
			)
			.pipe(
				map((response: any) => {
					const documentos = response?.data || [];
					if (documentos.length > 0 && this.selectedProduct) {
						const documentoCorrecto = documentos.find(
							(doc: any) => doc.idLegalDocument === this.selectedProduct.tipo
						);
						if (documentoCorrecto) {
							this.documentIdselect = documentoCorrecto;
							localStorage.setItem('documentData', JSON.stringify(documentoCorrecto));
							this.documentLink =
								typeof documentoCorrecto.documento === 'string' &&
								documentoCorrecto.documento.startsWith('http')
									? documentoCorrecto.documento.replace(/\s/g, '%20')
									: '#';
							this.documentIdselect = documentoCorrecto.idDocument;
							this.documentSerial = documentoCorrecto.numberSerial;
							this.idLegalDocument = documentoCorrecto.idLegalDocument;
						} else {
							console.warn(
								'No se encontró un documento que coincida con el tipo del producto.'
							);
						}
					}

					return this.documentLink;
				}),
				finalize(() => (this.isLoading = false))
			);
	}

	get actionItems() {
		return [
			{ label: 'Generar', isLink: !this.documentAlreadyGenerated },
			{ label: 'Legalizar', isLink: this.documentAlreadyGenerated },
			{ label: 'Ver detalles', isLink: true }
		];
	}

	onArrowClick(item: any): void {
		if (item.label === 'Generar') {
			if (this.documentAlreadyGenerated) {
				this.showLegalizationNoticev1('Este documento ya fue generado previamente.');
			} else {
				this.openLegalizationModal(item);
			}
		} else if (item.label === 'Legalizar') {
			if (!this.documentAlreadyGenerated) {
				this.showLegalizationNotice('Debes generar primero el documento antes de poder legalizarlo.');
				return;
			}
			this.checkConformityBeforeLegalization(item);
		} else if (item.label === 'Ver detalles') {
			this.goToDocumentDetails();
		} else {
			console.log(' Otra acción detectada:', item.label);
		}
	}

	private checkConformityBeforeLegalization(item: any): void {
		this.legalizationRequestService.getConformityStatus(this.document.id, this.userInfo?.id).subscribe({
			next: (res: any[]) => {
				const hasConformity = Array.isArray(res) && res.length > 0;

				if (!hasConformity) {
					this.showLegalizationNotice(
						'Debes dar conformidad a tu documento antes de proceder con la legalización.'
					);
				} else {
					this.verifyAndProceedLegalization();
				}
			},
			error: (err) => {
				console.error('Error al verificar conformidad:', err);
				this.showLegalizationNotice(
					'Ocurrió un error al verificar la conformidad. Intenta nuevamente.'
				);
			}
		});
	}

	private verifyAndProceedLegalization(): void {
		this.legalizationRequestService
			.validateSolicitudExiste(this.documentSerial, this.userInfo?.id)
			.subscribe({
				next: (res) => {
					if (res?.status === 200 && res?.data === false) {
						this.openLegalizationSourceModal(this.document, this.date);
					} else if (res?.status === 409 && res?.data === true) {
						this.showLegalizationNotice(
							res?.message || 'Ya cuentas con una solicitud de legalización.'
						);
					} else {
						this.showLegalizationNotice(
							'No se pudo verificar la solicitud de legalización. Intenta más tarde.'
						);
					}
				},
				error: (err) => {
					console.error('Error verificando solicitud:', err);
					if (err.status === 409 && err.error?.data === true) {
						this.showLegalizationNotice(
							err.error?.message || 'Ya cuentas con una solicitud de legalización.'
						);
					} else {
						this.showLegalizationNotice(
							'No se pudo verificar si ya cuentas con una solicitud de legalización. Por favor, intenta más tarde.'
						);
					}
				}
			});
	}

	openLegalizationModal(document: any): void {
		this.dialogService.open(ModalGenerateDocumentComponent, {
			width: '50vw',
			styleClass: 'custom-modal-header position-relative',
			closable: false,
			data: {
				payTypeList: 'opciones',
				selectedElement: 'element'
			}
		});
	}

	private showLegalizationNotice(message: string): void {
		const width = window.innerWidth < 768 ? '90vw' : '40vw';
		this.dialogService.open(LegalizationNoticeModal, {
			width: width,
			styleClass: 'custom-modal-header',
			data: {
				message
			}
		});
	}

	private showLegalizationNoticev1(message: string): void {
		const width = window.innerWidth < 768 ? '90vw' : '40vw';
		this.dialogService.open(GenerateNoticeModal, {
			width: width,
			styleClass: 'custom-modal-header',
			data: {
				message,
				documentId: this.document.id,
				link: this.documentLink,
				documentIdselect: this.documentIdselect,
				documentSerial: this.documentSerial,
				idLegalDocument: this.idLegalDocument
			}
		});
	}

	private goToDocumentDetails(): void {
		if (!this.document?.id && this.document?.id !== 0) {
			console.warn('documentId no definido, no se puede navegar');
			return;
		}

		const target = ['/profile', 'partner', 'my-legalization', 'corrections-panel', this.document.id];

		this.router.navigate(target, {
			queryParams: {
				link: this.documentLink,
				documentId: this.document.id,
				documentIdselect: this.documentIdselect,
				documentSerial: this.documentSerial,
				idLegalDocument: this.idLegalDocument
			}
		});
	}

	openLegalizationSourceModal(document: LegalDocument, date: any): void {
		const id = document.idLegalDocument;
		this.loadingMap[id] = true;
		this.legalizationService.getDocumentCategories().subscribe({
			next: (opciones) => {
				this.loadingMap[id] = false;
				const ref = this.dialogService.open(ModalLegalizationSource, {
					width: '50vw',
					styleClass: 'custom-modal-header position-relative',
					closable: false,
					data: {
						payTypeList: opciones,
						selectedElement: document,
						membershipData: date
					}
				});

				ref.onClose.subscribe(() => {});
			},
			error: (err) => {
				this.loadingMap[id] = false;
				console.error('Error al cargar opciones:', err);
			}
		});
	}

	openDocument(link: string | null): void {
		if (!link || link === '#') {
			this.showLegalizationNotice('El documento no está disponible.');
			return;
		}
		window.open(link, '_blank', 'noopener,noreferrer');
	}
}
