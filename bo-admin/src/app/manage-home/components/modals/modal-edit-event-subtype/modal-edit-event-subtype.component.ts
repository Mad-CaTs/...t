import { Component, OnInit } from '@angular/core';

/* === Modules === */
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfirmationComponent } from '@shared/components/modal-confirmation/modal-confirmation.component';
import { ISelectOpt } from '@interfaces/form-control.interface';

@Component({
	selector: 'app-modal-edit-event-subtype',
	standalone: true,
	imports: [CommonModule, ModalComponent, ReactiveFormsModule, FormControlModule],
	templateUrl: './modal-edit-event-subtype.component.html',
	styleUrls: ['./modal-edit-event-subtype.component.scss']
})
export class ModalEditEventSubtypeComponent {
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
			{ id: '1', text: 'KeOla' },
			{ id: '2', text: 'Todos' },
			{ id: '3', text: 'InResorts' },
			{ id: '4', text: 'Sistema Educativo' }
		];

		this.landingOpt = [
			{ id: '1', text: 'KeOla' },
			{ id: '2', text: 'InResorts' },
			{ id: '3', text: 'Sistema Educativo 2' }
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

	public setData(selectedItem: any) {
		let genderValue;
		if (selectedItem.gender === 'M') {
			genderValue = '1';
		} else if (selectedItem.gender === 'F') {
			genderValue = '2';
		} else {
			genderValue = '';
		}
		const additionalFilters = [];
		if (genderValue) {
			additionalFilters.push({ id: '1', text: 'Género' });
		}
		if (selectedItem.range.length > 0) {
			additionalFilters.push({ id: '2', text: 'Rango' });
		}

		const rangeValues = selectedItem.range.map((r: any) => {
			return {
				id: r.idRange,
				text: r.name
			};
		});
		this.form.patchValue({
			nameSubtype: selectedItem.nameSubtype,
			eventType: this.getOptionById(this.eventTypeOpt, selectedItem.nameEventType),
			landing: this.getOptionById(this.landingOpt, selectedItem.nameLanding),
			gender: genderValue,
			range: rangeValues,
			additionalFilter: additionalFilters
		});

		this.showGenderSelect = genderValue !== '';
		this.showRangeSelect = selectedItem.range.length > 0;
		this.showAdditionalSelect = this.showGenderSelect || this.showRangeSelect;

		this.form.patchValue({
			filterSwitch: this.showAdditionalSelect
		});
	}

	private getOptionById(options: ISelectOpt[], id: string): string | undefined {
		const option = options.find((opt) => opt.text === id || opt.id === id);
		return option?.id;
	}

	private getAdditionalFilters(item: any): { id: string; text: string }[] {
		const filters: { id: string; text: string }[] = [];

		if (item.gender !== '-') {
			filters.push({ id: '1', text: 'Género' });
		}

		if (item.range.length > 0) {
			filters.push({ id: '2', text: 'Rango' });
		}

		return filters;
	}

	public onSubmit() {
		this.instanceModal.close();
		const ref = this.modalManager.open(ModalConfirmationComponent, { centered: true, size: 'md' });
		const modal = ref.componentInstance as ModalConfirmationComponent;

		modal.title = 'Registro exitoso';
		modal.icon = 'bi bi-check-circle-fill text-success fa-2x';
		modal.body = 'El subtipo de evento ha sido editado con éxito.';
	}

	get title() {
		return 'Editar Subtipo de Evento';
	}
}
