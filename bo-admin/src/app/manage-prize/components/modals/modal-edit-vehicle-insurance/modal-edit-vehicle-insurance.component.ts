import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { SharedModule } from '@shared/shared.module';
import { ModalConfirmationComponent } from '@shared/components/modal-confirmation/modal-confirmation.component';

@Component({
	selector: 'app-modal-edit-vehicle-insurance',
	templateUrl: './modal-edit-vehicle-insurance.component.html',
	styleUrls: ['./modal-edit-vehicle-insurance.component.scss'],
	standalone: true,
	imports: [
		CommonModule,
		ModalComponent,
		FormControlModule,
		ReactiveFormsModule,
		InlineSVGModule,
		SharedModule
	]
})
export class ModalEditVehicleInsuranceComponent {
	@Input() title: string = 'Editar Seguro de Vehículo';

	form: FormGroup;

	constructor(
		public instanceModal: NgbActiveModal,
		private fb: FormBuilder,
		private cdr: ChangeDetectorRef,
		private modalService: NgbModal
	) {
		this.form = this.fb.group({
			vehicleInsurance: [''],
			currentInsurance: ['']
		});
	}

	ngOnInit(): void {}

	public setData(data: any) {
		if (data) {
			this.form.patchValue({
				vehicleInsurance: data.vehicleInsurance || '',
				currentInsurance: data.currentInsurance || ''
			});
		}
	}

	public onSubmit() {
		this.instanceModal.close();
		const ref = this.modalService.open(ModalConfirmationComponent, { centered: true, size: 'md' });
		const modal = ref.componentInstance as ModalConfirmationComponent;

		modal.title = 'Seguro editado';
		modal.icon = 'bi bi-check-circle-fill text-success fa-2x';
		modal.body = 'El seguro del vehículo ha sido editado con éxito.';
	}
}
