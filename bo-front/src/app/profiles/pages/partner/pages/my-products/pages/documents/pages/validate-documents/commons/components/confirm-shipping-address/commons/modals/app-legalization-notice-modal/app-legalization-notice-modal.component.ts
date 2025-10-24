import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
	selector: 'app-legalization-notice-modal',
	templateUrl: './app-legalization-notice-modal.component.html',
	standalone: true,
	imports: [CommonModule, ModalComponent],
	styleUrls: []
})
export class LegalizationNoticeModal {
	@Output() entendido = new EventEmitter<void>();
	title: string = '';
	message: string = '';
	buttonText: string = 'Aceptar';
	returnValue: string = 'confirmar';

	constructor(private ref: DynamicDialogRef, private config: DynamicDialogConfig) {
		this.title = config.data?.title || '';
		this.message = config.data?.message || '';
		this.buttonText = config.data?.buttonText || 'Aceptar';
		this.returnValue = config.data?.returnValue || 'confirmar';
	}

	onClick(): void {
		this.ref.close(this.returnValue);
	}

	close() {
		this.ref.close();
	}
}
