import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';

/* === Modules === */
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfirmationComponent } from '@shared/components/modal-confirmation/modal-confirmation.component';
import { ModalRejectCourseComponent } from '../modal-reject-course/modal-reject-course.component';
import { ModalRejectTravelComponent } from '../modal-reject-travel/modal-reject-travel.component';

@Component({
	selector: 'app-modal-detail-travel',
	standalone: true,
	imports: [CommonModule, ModalComponent, ReactiveFormsModule, FormControlModule],
	templateUrl: './modal-detail-travel.component.html',
	styleUrls: ['./modal-detail-travel.component.scss']
})
export class ModalDetailTravelComponent {
	@Input() data: any;
	public form: FormGroup;

	@Output() travelConfirmed = new EventEmitter<void>();

	constructor(
		private builder: FormBuilder,
		public instanceModal: NgbActiveModal,
		private modalManager: NgbModal
	) {}

	/* === Events === */
	public onReject() {
		this.travelConfirmed.emit();
		this.instanceModal.close();
		const modalRef = this.modalManager.open(ModalRejectTravelComponent, { centered: true, size: 'md' });
		const modal = modalRef.componentInstance as ModalRejectTravelComponent;
	}

	public onSubmit() {
		this.instanceModal.close();
		this.travelConfirmed.emit();
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
