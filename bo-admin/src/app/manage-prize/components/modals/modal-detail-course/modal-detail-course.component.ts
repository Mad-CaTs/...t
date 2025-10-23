import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';

/* === Modules === */
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfirmationComponent } from '@shared/components/modal-confirmation/modal-confirmation.component';
import { ModalRejectCourseComponent } from '../modal-reject-course/modal-reject-course.component';

@Component({
	selector: 'app-modal-detail-course',
	standalone: true,
	imports: [CommonModule, ModalComponent, ReactiveFormsModule, FormControlModule],
	templateUrl: './modal-detail-course.component.html',
	styleUrls: ['./modal-detail-course.component.scss']
})
export class ModalDetailCourseComponent {
	@Input() data: any;
	public form: FormGroup;

	@Output() courseConfirmed = new EventEmitter<void>();

	constructor(
		private builder: FormBuilder,
		public instanceModal: NgbActiveModal,
		private modalManager: NgbModal
	) {}

	/* === Events === */
	public onReject() {
		this.courseConfirmed.emit();
		this.instanceModal.close();
		const modalRef = this.modalManager.open(ModalRejectCourseComponent, { centered: true, size: 'md' });
		const modal = modalRef.componentInstance as ModalRejectCourseComponent;
	}

	public onSubmit() {
		this.instanceModal.close();
		this.courseConfirmed.emit();
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
