import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import type { AbstractControl, FormGroup } from '@angular/forms';

@Component({
	selector: 'app-input-date',
	templateUrl: './input-date.component.html',
	styleUrls: ['./input-date.component.scss']
})
export class InputDateComponent {
	@Input() label: string = 'Label';
	@Input() controlName: string = '';
	@Input() formGroup: FormGroup;
	@Input() hasTime: boolean = false;

	openMenu: boolean = false;
	openTime: boolean = false;

	get date() {
		if (!this.formValue.value) {
			return null;
		  }
		return new Date(this.formValue.value);
	}

	get formValue() {
		return this.formGroup.get(this.controlName) as AbstractControl;
	}

	get existErrors() {
		return this.formValue.touched && this.formValue.errors;
	}
}
