import { Component, Input, SimpleChanges } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { CommonModule } from '@angular/common';

@Component({
	selector: 'app-modal',
	templateUrl: './modal.component.html',
	standalone: true,
	imports: [CommonModule],
	styleUrls: ['./modal.component.scss']
})
export class ModalComponent {
	@Input() title: string = 'Title Modal';
	@Input() hideCloseButton: boolean = false;
	@Input() description?: string;
	@Input() showIcon: boolean = false;
	@Input() icon?: string;
	constructor(public activeModal: NgbActiveModal) {}
}
