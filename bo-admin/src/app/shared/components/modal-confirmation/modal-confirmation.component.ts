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
	selector: 'app-modal-confirmation',
	templateUrl: './modal-confirmation.component.html',
	styleUrls: ['./modal-confirmation.component.scss'],
	standalone: true,
	imports: [ModalComponent, CommonModule]
})
export class ModalConfirmationComponent {
	@Input() title: string;
	@Input() icon: string;
	@Input() body: string = '';
	@Input() buttons: IModalBtn[] = [];
	loading: boolean = false;

	constructor(public instanceModal: NgbActiveModal) { }

	handleButtonClick(btn: IModalBtn) {
		btn.loading = true;
		btn.onClick();
	}
}
