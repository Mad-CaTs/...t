import { Component, Input } from '@angular/core';

/* === Modules === */
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfirmationComponent } from '@shared/components/modal-confirmation/modal-confirmation.component';

@Component({
	selector: 'app-modal-edit-travel',
	standalone: true,
	imports: [CommonModule, ModalComponent, ReactiveFormsModule, FormControlModule],
	templateUrl: './modal-edit-travel.component.html',
	styleUrls: ['./modal-edit-travel.component.scss']
})
export class ModalEditTravelComponent {
	@Input() data: any;
	public form: FormGroup;

	constructor(
		private builder: FormBuilder,
		public instanceModal: NgbActiveModal,
		private modalManager: NgbModal
	) {
		this.form = builder.group({
			destiny: [''],
			dateTravel: [''],
			flyer: [''],
            statusSwitch: false
		});
	}

	/* === Events === */
	ngOnInit() {
		if (this.data) {
			this.form.patchValue({
				destiny: this.data.destiny,
				dateTravel: this.parseDate(this.data.date),
				flyer: this.data.flyer,
                statusSwitch: this.data.status === 'Activo'
			});
		}
	}

	private parseDate(dateStr: string): Date | null {
		if (!dateStr) {
			return null;
		}
		const parts = dateStr.split('/');
		const day = parseInt(parts[0], 10);
		const month = parseInt(parts[1], 10) - 1;
		const year = parseInt(parts[2], 10);
		return new Date(year, month, day);
	}

	public onSubmit() {
		this.instanceModal.close();
		const ref = this.modalManager.open(ModalConfirmationComponent, { centered: true, size: 'md' });
		const modal = ref.componentInstance as ModalConfirmationComponent;

		modal.title = 'Registro exitoso';
		modal.icon = 'bi bi-check-circle-fill text-success fa-2x';
		modal.body = 'El viaje ha sido modificado con éxito.';
	}

	/* === Getters === */
	get title() {
		return 'Editar Viaje';
	}
}
