import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

/* === Modules === */
import { CommonModule } from '@angular/common';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { ModalComponent } from '@shared/components/modal/modal.component';

@Component({
	selector: 'app-modal-loading',
	standalone: true,
	imports: [CommonModule, LoadingComponent, ModalComponent],
	templateUrl: './modal-loading.component.html',
	styleUrls: ['./modal-loading.component.scss']
})
export class ModalLoadingComponent implements OnInit {
	@Output() finishLoad = new EventEmitter();
	hideCloseButtonValue = true;

	constructor(public instanceModal: NgbActiveModal) {}

	ngOnInit(): void {
		setTimeout(() => {
			this.instanceModal.close();
			this.finishLoad.emit();
		}, 5000);
	}
}
