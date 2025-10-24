import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
	selector: 'app-modal-loading',
	templateUrl: './modal-loading.component.html',
	styleUrls: [],
	standalone: true,
	imports: [CommonModule, ProgressSpinnerModule]
})

export class ModalLoadingComponent {
	constructor(public ref: DynamicDialogRef) {}

}
