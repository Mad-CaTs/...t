import { Component } from '@angular/core';

/* === Modules === */
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfirmationComponent } from '@shared/components/modal-confirmation/modal-confirmation.component';

@Component({
	selector: 'app-modal-add-landing',
	standalone: true,
	imports: [CommonModule, ModalComponent, ReactiveFormsModule, FormControlModule],
	templateUrl: './modal-add-landing.component.html',
	styleUrls: ['./modal-add-landing.component.scss']
})
export class ModalAddLandingComponent {
	public form: FormGroup;

	constructor(
		private builder: FormBuilder,
		public instanceModal: NgbActiveModal,
		private modalManager: NgbModal
	) {
		this.form = builder.group({
			nameLanding: [''],
			landingUrl: [''],
			imagenLanding: ['']
		});
	}

	/* === Events === */
	public onAddNew() {
		const newGroup = this.builder.group({
			nameLanding: [''],
			landingUrl: [''],
			imagenLanding: ['']
		});
	}

	public onSubmit() {
		this.instanceModal.close();
		const ref = this.modalManager.open(ModalConfirmationComponent, { centered: true, size: 'md' });
		const modal = ref.componentInstance as ModalConfirmationComponent;

		modal.title = 'Registro exitoso';
		modal.icon = 'bi bi-check-circle-fill text-success fa-2x';
		modal.body = 'El Landing ha sido creado con éxito.';
	}

	/* === Getters === */
	get title() {
		return 'Agregar Landing';
	}
}
