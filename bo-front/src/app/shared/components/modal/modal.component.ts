import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-modal',
	templateUrl: './modal.component.html',
	styleUrls: [],
	standalone: true,
	imports: [CommonModule]
})
export class ModalComponent {
	@Input() title: string = 'Titulo del modal';

	constructor(public instanceModal: NgbActiveModal) {}
}
