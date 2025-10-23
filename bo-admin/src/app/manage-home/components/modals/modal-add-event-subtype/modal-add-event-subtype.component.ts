import { Component } from '@angular/core';

/* === Modules === */
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfirmationComponent } from '@shared/components/modal-confirmation/modal-confirmation.component';
import { ISelectOpt } from '@interfaces/form-control.interface';

@Component({
	selector: 'app-modal-add-event-subtype',
	standalone: true,
	imports: [CommonModule, ModalComponent, ReactiveFormsModule, FormControlModule],
	templateUrl: './modal-add-event-subtype.component.html',
	styleUrls: ['./modal-add-event-subtype.component.scss']
})
export class ModalAddEventSubtypeComponent {
	public form: FormGroup;
	public showGenderSelect: boolean = false;
	public showRangeSelect: boolean = false;

	eventTypeOpt: ISelectOpt[] = [];
	landingOpt: ISelectOpt[] = [];
	additionalFilterOpt: ISelectOpt[] = [];
	genderOpt: ISelectOpt[] = [];
	rangeOpt: ISelectOpt[] = [];

	public showAdditionalSelect: boolean = false;
	constructor(
		private builder: FormBuilder,
		public instanceModal: NgbActiveModal,
		private modalManager: NgbModal
	) {
		this.form = builder.group({
			nameSubtype: [''],
			eventType: [''],
			landing: [''],
			filterSwitch: false,
			additionalFilter: [[]],
			gender: [''],
			range: [[]]
		});

		this.eventTypeOpt = [
			{ id: 'A1', text: 'A1' },
			{ id: 'B2', text: 'B2' },
			{ id: 'C3', text: 'C3' }
		];

		this.landingOpt = [
			{ id: '1', text: 'Keola' },
			{ id: '2', text: 'InResort' }
		];

		this.additionalFilterOpt = [
			{ id: '1', text: 'Género' },
			{ id: '2', text: 'Rango' }
		];

		this.genderOpt = [
			{ id: '1', text: 'Masculino' },
			{ id: '2', text: 'Femenino' }
		];

		this.rangeOpt = [
			{ id: '1', text: 'Oro' },
			{ id: '2', text: 'Platino' },
			{ id: '3', text: 'Diamante' },
			{ id: '4', text: 'Bronce' },
			{ id: '5', text: 'Plata' }
		];

		this.form.get('filterSwitch')?.valueChanges.subscribe((value) => {
			this.showAdditionalSelect = value;
		});

		this.form.get('filterSwitch')?.valueChanges.subscribe((value) => {
			if (!value) {
				this.form.get('additionalFilter')?.setValue('');
			}
		});

		this.form.get('additionalFilter')?.valueChanges.subscribe((values) => {
			if (Array.isArray(values)) {
				const selectedIds = values.map((item: any) => item.id);
				this.showGenderSelect = selectedIds.includes('1');
				this.showRangeSelect = selectedIds.includes('2');
			} else {
				this.showGenderSelect = false;
				this.showRangeSelect = false;
			}
		});
	}

	/* === Events === */
	public onAddNew() {
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
		modal.body = 'El subtipo de evento ha sido creado con éxito.';
	}

	/* === Getters === */
	get title() {
		return 'Agregar Subtipo de Evento';
	}
}
