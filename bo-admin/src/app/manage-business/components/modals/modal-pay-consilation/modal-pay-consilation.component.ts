import { Component } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

/* === Modules === */
import { CommonModule } from '@angular/common';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { InlineSVGModule } from 'ng-inline-svg-2';

@Component({
	selector: 'app-modal-pay-consilation',
	standalone: true,
	imports: [CommonModule, ModalComponent, InlineSVGModule],
	templateUrl: './modal-pay-consilation.component.html',
	styleUrls: ['./modal-pay-consilation.component.scss']
})
export class ModalPayConsilationComponent {
	constructor(public instanceModal: NgbActiveModal) {}
}
