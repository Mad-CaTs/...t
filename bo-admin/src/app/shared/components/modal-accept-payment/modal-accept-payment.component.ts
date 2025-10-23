import { Component, Input, Output, EventEmitter } from '@angular/core';

/* === Modules === */
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../modal/modal.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-modal-accept-payment',
	standalone: true,
	imports: [CommonModule, ModalComponent],
	templateUrl: './modal-accept-payment.component.html',
	styleUrls: ['./modal-accept-payment.component.scss']
})
export class ModalAcceptPaymentComponent {
	@Input() title: string = '';
	@Input() voucherUrl: string = '';
	@Input() description: string = '¿Desea confirmar el pago?';
    @Input() showImage: boolean = true;
	@Output() onConfirm = new EventEmitter();

	constructor(public modal: NgbActiveModal) {}

}
