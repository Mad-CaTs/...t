import { Component, Input } from '@angular/core';

/* === Modules === */
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfirmationComponent } from '@shared/components/modal-confirmation/modal-confirmation.component';

@Component({
	selector: 'app-modal-edit-landing',
	standalone: true,
	imports: [CommonModule, ModalComponent, ReactiveFormsModule, FormControlModule],
	templateUrl: './modal-edit-landing.component.html',
	styleUrls: ['./modal-edit-landing.component.scss']
})
export class ModalEditLandingComponent {
	@Input() data: any;
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
	ngOnInit() {
		if (this.data) {
			this.form.patchValue({
				nameLanding: this.data.nameLanding,
				landingUrl: this.data.landingUrl,
				imagenLanding: this.data.landingImage
			});
		}
	}

	public onSubmit() {
		this.instanceModal.close();
		const ref = this.modalManager.open(ModalConfirmationComponent, { centered: true, size: 'md' });
		const modal = ref.componentInstance as ModalConfirmationComponent;

		modal.title = 'Registro exitoso';
		modal.icon = 'bi bi-check-circle-fill text-success fa-2x';
		modal.body = 'El Landing ha sido editado con éxito.';
	}

	/* === Getters === */
	get title() {
		return 'Editar Landing';
	}
}
