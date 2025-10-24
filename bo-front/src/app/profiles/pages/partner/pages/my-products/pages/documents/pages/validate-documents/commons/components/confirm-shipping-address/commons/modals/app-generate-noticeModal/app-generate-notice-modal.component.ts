import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Router } from '@angular/router';

@Component({
	selector: 'app-generate-notice-modal',
	templateUrl: './app-generate-notice-modal.component.html',
	standalone: true,
	imports: [CommonModule],
	styleUrls: []
})
export class GenerateNoticeModal {
	@Output() entendido = new EventEmitter<void>();
	title: string = '';
	message: string = '';
	buttonText: string = 'Ver documento';
	returnValue: string = 'confirmar';
	documentId!: number;
	link$!: string;
	documentIdselect!: number;
	documentSerial!: number;
    idLegalDocument!: number; 

	constructor(private ref: DynamicDialogRef, private config: DynamicDialogConfig, private router: Router) {
		this.title = config.data?.title || '';
		this.message = config.data?.message || '';
		this.buttonText = config.data?.buttonText || 'Ver documento';
		this.returnValue = config.data?.returnValue || 'confirmar';
		this.documentId = config.data?.documentId;
		this.link$ = config.data?.link || '#';
		this.documentIdselect = config.data?.documentIdselect || 0;
		this.documentSerial = config.data?.documentSerial || 0;
        this.idLegalDocument = config.data?.idLegalDocument || 0;
	}

	onClick(): void {
		if (!this.documentId && this.documentId !== 0) {
			console.warn('documentId no definido, no se puede navegar');
			return;
		}
		this.ref.close(this.returnValue);

		const target = ['/profile', 'partner', 'my-legalization', 'document-validator', this.documentId];

		this.router.navigate(target, {
			queryParams: {
				link: this.link$,
				documentId: this.documentId,
				documentIdselect: this.documentIdselect,
				documentSerial: this.documentSerial,
				idLegalDocument: this.idLegalDocument
			}
		});
	}

	close() {
		this.ref.close();
	}
}