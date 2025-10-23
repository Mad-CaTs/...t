import { Component, Input, OnInit } from '@angular/core';

/* === Modules === */
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfirmationComponent } from '@shared/components/modal-confirmation/modal-confirmation.component';

@Component({
	selector: 'app-modal-edit-event-type',
	standalone: true,
	imports: [CommonModule, ModalComponent, ReactiveFormsModule, FormControlModule],
	templateUrl: './modal-edit-event-type.component.html',
	styleUrls: ['./modal-edit-event-type.component.scss']
})
export class ModalEditEventTypeComponent implements OnInit {
	@Input() data: any;
	public form: FormGroup;

	constructor(
		private builder: FormBuilder,
		public instanceModal: NgbActiveModal,
		private modalManager: NgbModal
	) {
		this.form = builder.group({
			eventType: [''],
			statusSwitch: false
		});

	}

	ngOnInit() {
		if (this.data) {
			this.form.patchValue({
				eventType: this.data.description,
				statusSwitch: this.data.status === 1
			});
		}
	}

	/* === Events === */
	public onEdit() {
		const newGroup = this.builder.group({
			eventType: ['']
		});
	}

	public onSubmit() {
		this.instanceModal.close();
		const ref = this.modalManager.open(ModalConfirmationComponent, { centered: true, size: 'md' });
		const modal = ref.componentInstance as ModalConfirmationComponent;

		modal.title = 'Registro exitoso';
		modal.icon = 'bi bi-check-circle-fill text-success fa-2x';
		modal.body = 'El tipo de evento ha sido editado con éxito.';
	}

	/* === Getters === */
	get title() {
		return 'Editar Tipo de Evento';
	}
}
