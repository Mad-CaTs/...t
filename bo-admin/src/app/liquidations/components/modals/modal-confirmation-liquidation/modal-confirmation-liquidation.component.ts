import { Component, Input } from '@angular/core';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

/* === Modules === */
import { CommonModule } from '@angular/common';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { ModalConfirmationComponent } from '@shared/components/modal-confirmation/modal-confirmation.component';

@Component({
	selector: 'app-modal-confirmation-liquidation',
	templateUrl: './modal-confirmation-liquidation.component.html',
	styleUrls: ['./modal-confirmation-liquidation.component.scss'],
	standalone: true,
	imports: [ModalComponent, CommonModule]
})
export class ModalConfirmationLiquidationComponent {
	@Input() title: string;
	@Input() fullname!: string;
	@Input() dateRequest!: string;
	@Input() briefcase!: string;
	@Input() membershiptype!: string;
	@Input() reason!: string;

	constructor(public instanceModal: NgbActiveModal, private modalManager: NgbModal) {}

	public onSubmit() {
		this.instanceModal.close();
		const ref = this.modalManager.open(ModalConfirmationComponent, { centered: true, size: 'md' });
		const modal = ref.componentInstance as ModalConfirmationComponent;

		modal.title = 'Solicitud exitosa';
		modal.icon = 'bi bi-check-circle-fill text-success fa-2x';
		modal.body = 'La solicitud ha sido aprobada exitosamente.';
	}
}
