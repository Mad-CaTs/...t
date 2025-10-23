import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'app-modal-confirm-accepted',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './modal-confirm-accepted.component.html',
	styleUrls: ['./modal-confirm-accepted.component.scss']
})
export class ModalConfirmAcceptedComponent {
	@Input() title = 'Confirmar elemento';
	@Input() message: string = '';
	@Output() confirm = new EventEmitter<void>();
	@Output() cancel = new EventEmitter<void>();

	onConfirm() {
		this.confirm.emit();
	}

	onCancel() {
		this.cancel.emit();
	}
}
