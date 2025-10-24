import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
	selector: 'app-legalization-pre-notice-modal',
	templateUrl: './app-legalization-notice-pre-modal.component.html',
	standalone: true,
	imports: [CommonModule],
	styleUrls: []
})
export class LegalizationPreNoticeModal {
	@Output() entendido = new EventEmitter<void>();
	buttonText: string = 'Aceptar';
	returnValue: string = 'confirmar';
	data: any;

	constructor(private ref: DynamicDialogRef, private config: DynamicDialogConfig) {
		this.data = config.data || '';
		this.buttonText = config.data?.buttonText || 'Aceptar';
		this.returnValue = config.data?.returnValue || 'confirmar';
	}

	onClick(): void {
		this.ref.close(this.returnValue);
	}

	close() {
		this.ref.close();
	}
	onSecondaryClick() {}
}
