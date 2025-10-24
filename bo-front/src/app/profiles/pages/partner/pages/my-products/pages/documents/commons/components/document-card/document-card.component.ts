import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { DocumentService } from '../../services/documents-service';
import { finalize, map, Observable, Subject, takeUntil } from 'rxjs';
import { LegalDocument } from '@shared/interfaces/legal-document-package';
import { AppModalComponent } from '../../../pages/validate-documents/commons/components/confirm-shipping-address/commons/modals/app-modal/app-modal.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

interface DocumentLinkResult {
	valid: boolean;
	link?: string;
	message?: string;
}

@Component({
	selector: 'app-document-card',
	standalone: true,
	imports: [CommonModule, MatDialogModule],
	templateUrl: './document-card.component.html',
	styleUrl: './document-card.component.scss'
})
export class DocumentCardComponent implements OnInit, OnDestroy {
	@Input() document!: LegalDocument;
	@Input() date!: string;
	@Input() isDisabled = false;
	@Input() idSubscription!: number;
	@Input() idFamily!: number;
	@Output() dataGenerada = new EventEmitter<any>();
	public isLoading = false;
	public link: string | null = null;
	private destroy$ = new Subject<void>();
	constructor(private documentService: DocumentService, private dialog: MatDialog) {}

	ngOnInit() {
		this.cargarLink();
	}

	ngOnDestroy() {
		this.destroy$.next();
		this.destroy$.complete();
	}

	private cargarLink() {
		this.isLoading = true;

		this.documentService
			.getDocumentsLink(this.idSubscription, this.document.idLegalDocument, this.idFamily, true)
			.pipe(
				map((response: any): DocumentLinkResult => {
					console.log('responsegenera', response);
					if (response?.data) {
						this.dataGenerada.emit(response.data);
						localStorage.setItem('documentsData', JSON.stringify(response.data));
						// o si prefieres sessionStorage:
						// sessionStorage.setItem('documentsData', JSON.stringify(response.data));
					}
					const raw = response?.data?.[0]?.documento;

					if (typeof raw === 'string' && raw.startsWith('http')) {
						return { valid: true, link: raw.replace(/\s/g, '%20') };
					}

					return {
						valid: false,
						message: typeof raw === 'string' ? raw : 'Error al generar documento.'
					};
				}),
				finalize(() => (this.isLoading = false)),
				takeUntil(this.destroy$)
			)
			.subscribe((result) => {
				if (result.valid && result.link) {
					this.link = result.link;
				} else {
					this.link = null;
					this.mostrarErrorModal(result.message || 'Documento no disponible');
				}
			});
	}

	private mostrarErrorModal(message: string) {
		this.dialog.open(AppModalComponent, {
			data: {
				icon: 'assets/icons/alert-circle.svg',
				title: 'Documento no disponible',
				messageHtml: message,
				primaryBtnText: 'Aceptar',
				primaryBtnColor: 'orange',
				showPrimaryBtn: true,
				showSecondaryBtn: false
			}
		});
	}
}
