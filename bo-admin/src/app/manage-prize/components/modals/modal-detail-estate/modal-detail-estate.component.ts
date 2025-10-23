import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';

/* === Modules === */
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfirmationComponent } from '@shared/components/modal-confirmation/modal-confirmation.component';
import { ModalRejectCarComponent } from '../modal-reject-car/modal-reject-car.component';
import { ModalRejectEstateComponent } from '../modal-reject-estate/modal-reject-estate.component';

@Component({
	selector: 'app-modal-detail-estate',
	standalone: true,
	imports: [CommonModule, ModalComponent, ReactiveFormsModule, FormControlModule],
	templateUrl: './modal-detail-estate.component.html',
	styleUrls: ['./modal-detail-estate.component.scss']
})
export class ModalDetailEstateComponent {
	@Input() data: any;
	public form: FormGroup;

	@Output() estateConfirmed = new EventEmitter<void>();

	constructor(
		private builder: FormBuilder,
		public instanceModal: NgbActiveModal,
		private modalManager: NgbModal
	) {
        this.form = this.builder.group({
            selectedProforma: ['proforma1']
          });
    }

	/* === Events === */
	public onReject() {
		this.estateConfirmed.emit();
		this.instanceModal.close();
		const modalRef = this.modalManager.open(ModalRejectEstateComponent, { centered: true, size: 'md' });
		const modal = modalRef.componentInstance as ModalRejectEstateComponent;
	}

	public onSubmit() {
		this.instanceModal.close();
		this.estateConfirmed.emit();
		const ref = this.modalManager.open(ModalConfirmationComponent, { centered: true, size: 'md' });
		const modal = ref.componentInstance as ModalConfirmationComponent;

		modal.title = 'Solicitud exitosa';
		modal.icon = 'bi bi-check-circle-fill text-success fa-2x';
		modal.body = 'La solicitud de participación ha sido aprobada exitosamente.';
	}

	/* === Getters === */
	get title() {
		return 'Detalle de la Solicitud';
	}
}
