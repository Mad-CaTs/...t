import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-modal-confirmation',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './modal-confirmation-commission.component.html',
	styleUrls: ['./modal-confirmation-commission.component.scss']
})
export class ModalConfirmationCommissionComponent {
	@Input() title: string = '¿Estás seguro?';
	@Input() message: string = '';
	@Input() confirmButtonText: string = 'Sí, guardar';
	@Output() confirmAction = new EventEmitter<void>();

	constructor(public activeModal: NgbActiveModal) {}

	closeModal() {
		this.activeModal.dismiss();
	}

	onConfirm() {
		this.confirmAction.emit();
		this.activeModal.close();
	}
}
