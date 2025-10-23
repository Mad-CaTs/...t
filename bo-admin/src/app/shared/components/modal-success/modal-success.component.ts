import { Component, Input } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

/* === Modules === */
import { ModalComponent } from '../modal/modal.component';
import { CommonModule } from '@angular/common';

interface IModalBtn {
	text: string;
	className: string;
	loading?: boolean;
	onClick: () => void;
}

@Component({
	selector: 'app-modal-success',
	templateUrl: './modal-success.component.html',
	styleUrls: ['./modal-success.component.scss'],
	standalone: true,
	imports: [ CommonModule]
})
export class ModalSuccessComponent {
	@Input() title: string = '';
	@Input() body: string = '';

	constructor(public instanceModal: NgbActiveModal, public modal: NgbActiveModal) {}
}
