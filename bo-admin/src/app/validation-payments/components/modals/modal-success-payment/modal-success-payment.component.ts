import { Component } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

/* === Modules  === */
import { CommonModule, CurrencyPipe } from '@angular/common';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { FormControlModule } from '@shared/components/form-control/form-control.module';

@Component({
	selector: 'app-modal-success-payment',
	standalone: true,
	imports: [CommonModule, InlineSVGModule, ModalComponent, FormControlModule],
	templateUrl: './modal-success-payment.component.html',
	styleUrls: ['./modal-success-payment.component.scss'],
	providers: [CurrencyPipe]
})
export class ModalSuccessPaymentComponent {
	constructor(private instanceModal: NgbActiveModal) {}
}
