import { Component, EventEmitter, Input, Output } from '@angular/core';

import type { AbstractControl, FormGroup } from '@angular/forms';
import type { ISelectOpt } from '@interfaces/form-control.interface';

@Component({
	selector: 'app-select',
	templateUrl: './select.component.html',
	styleUrls: ['./select.component.scss']
})
export class SelectComponent {
	@Input() iconLeft: string | null = null;
	@Input() iconRigth: string | null = null;
	@Input() placeholder: string = '';
	@Input() label: string = '';
	@Input() options: ISelectOpt[] = [];
	@Input() controlName: string = '';
	@Input() formGroup: FormGroup;
	@Input() disabled: boolean = false;
	@Output() selectionChange = new EventEmitter<any>();
	@Input() customClass: string = 'form-select-solid';

	ngOnInit() {
		const control = this.formGroup.get(this.controlName);
		if (control && this.disabled) {
			control.disable();
		}
	}

	onSelectionChange(event: Event) {
  const selectElement = event.target as HTMLSelectElement;
  this.selectionChange.emit(selectElement.value); // siempre será el id
}


/* 	onSelectionChange(event: Event) {
		const selectElement = event.target as HTMLSelectElement;
		const value = selectElement.value;
		const actualValue = value.includes(':') ? value.split(':')[1].trim() : value;

		this.selectionChange.emit(actualValue);
	} */

	get formValue(): AbstractControl {
		return this.formGroup.get(this.controlName) as AbstractControl;
	}

	get existErrors() {
		return this.formValue.touched && this.formValue.errors;
	}
}
