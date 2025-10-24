import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
	selector: 'app-modal-error',
	templateUrl: './modal-error.component.html',
	styleUrls: ['./modal-error.component.scss'],
	standalone: true,
	imports: [CommonModule, CommonModule]
})
export class ModalErrorComponent {
	constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig) {}

    closeModal() {
		this.ref.close();
	}

    get data() {
		return this.config.data;
	}
}
