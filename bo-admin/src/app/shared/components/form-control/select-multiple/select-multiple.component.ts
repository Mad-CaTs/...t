import { Component, Input } from '@angular/core';

import type { AbstractControl, FormGroup } from '@angular/forms';
import type { ISelectOpt } from '@interfaces/form-control.interface';

@Component({
	selector: 'app-select-multiple',
	templateUrl: './select-multiple.component.html',
	styleUrls: ['./select-multiple.component.scss']
})
export class SelectMultipleComponent {
	@Input() label: string = 'Label';
	@Input() controlName: string;
	@Input() placeholder: string = 'Selecciona algun valor';
	@Input() formGroup: FormGroup;
	@Input() options: ISelectOpt[] = [];
	@Input() tooltipContent: string = '';

	openMenu: boolean = false;

	/* === Events === */

	stopPropagation(e: Event) {
		e.stopPropagation();
	}

	onRemoveOption(id: string, e: Event) {
		const list = [...this.values];
		const newList = list.filter((opt) => opt.id !== id);

		this.formValue.setValue(newList);

		this.stopPropagation(e);
	}

	/* === Getters === */

	get values() {
		return this.formValue.value;
	}

	get formValue() {
		return this.formGroup.get(this.controlName) as AbstractControl<ISelectOpt[]>;
	}

	get existErrors() {
		return this.formValue.touched && this.formValue.errors;
	}
}
