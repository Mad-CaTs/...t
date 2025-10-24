import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
	selector: 'successful-payment-detail-modal',
	templateUrl: './successful-payment-detail-modal.component.html',
	standalone: true,
	imports: [CommonModule, ModalComponent],
	styleUrls: []
})
export class SuccessfulPaymentDetailModal {
	@Output() entendido = new EventEmitter<void>();
	title: string = '';
	modalData: any;
	buttonText: string = 'Aceptar';
	returnValue: string = 'confirmar';
	vouchers: any;

	constructor(private ref: DynamicDialogRef, private config: DynamicDialogConfig) {
		this.title = config.data?.title || '';
		this.modalData = this.config.data?.data;
		this.vouchers = this.modalData.vouchers[0];
		this.buttonText = config.data?.buttonText || 'Aceptar';
		this.returnValue = config.data?.returnValue || 'confirmar';
	}

	ngOnInit(): void {
		// Aquí recuperas la data que enviaste al abrir el modal

		// Log para ver todos los datos
		console.log('Datos recibidos en el modal:', this.modalData);

		// Si quieres ver solo los vouchers
		console.log('Vouchers dentro del modal:', this.modalData.data);
	}

	onClick(): void {
		this.ref.close(this.returnValue);
	}

	close() {
		this.ref.close();
	}
}
