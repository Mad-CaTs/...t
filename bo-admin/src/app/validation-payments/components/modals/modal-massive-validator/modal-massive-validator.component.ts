import { Component } from '@angular/core';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

/* === Modules === */
import { CommonModule } from '@angular/common';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { ModalConfirmationComponent } from '@shared/components/modal-confirmation/modal-confirmation.component';

@Component({
	selector: 'app-modal-massive-validator',
	standalone: true,
	imports: [CommonModule, ModalComponent],
	templateUrl: './modal-massive-validator.component.html',
	styleUrls: ['./modal-massive-validator.component.scss']
})
export class ModalMassiveValidatorComponent {
	constructor(public instanceModal: NgbActiveModal, private modal: NgbModal) {}

	/* === Events === */
	public onValidate() {
		this.instanceModal.close();
		const ref = this.modal.open(ModalConfirmationComponent, { centered: true });
		const modal = ref.componentInstance as ModalConfirmationComponent;

		modal.title = 'Éxito';
		modal.icon = 'bi bi-check-circle fa-2x text-success';
		modal.body = 'Registros Validados';
	}

	/* === Getters === */
	get title() {
		return 'Validador Masivo';
	}
}
