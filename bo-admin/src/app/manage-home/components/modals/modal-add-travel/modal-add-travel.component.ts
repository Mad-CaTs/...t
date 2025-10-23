import { Component } from '@angular/core';

/* === Modules === */
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfirmationComponent } from '@shared/components/modal-confirmation/modal-confirmation.component';

@Component({
	selector: 'app-modal-add-travel',
	standalone: true,
	imports: [CommonModule, ModalComponent, ReactiveFormsModule, FormControlModule],
	templateUrl: './modal-add-travel.component.html',
	styleUrls: ['./modal-add-travel.component.scss']
})
export class ModalAddTravelComponent {
	public form: FormGroup;

	constructor(
		private builder: FormBuilder,
		public instanceModal: NgbActiveModal,
		private modalManager: NgbModal
	) {
		const today = new Date();
		this.form = builder.group({
			destiny: [''],
			dateTravel: [today],
			flyer: ['']
		});
	}

	/* === Events === */
	public onAddNew() {
		const newGroup = this.builder.group({
			destiny: [''],
			dateTravel: [''],
			flyer: ['']
		});
	}

	public onSubmit() {
		this.instanceModal.close();
		const ref = this.modalManager.open(ModalConfirmationComponent, { centered: true, size: 'md' });
		const modal = ref.componentInstance as ModalConfirmationComponent;

		modal.title = 'Registro exitoso';
		modal.icon = 'bi bi-check-circle-fill text-success fa-2x';
		modal.body = 'El viaje ha sido registrado con éxito.';
	}

	/* === Getters === */
	get title() {
		return 'Agregar Viaje';
	}
}
