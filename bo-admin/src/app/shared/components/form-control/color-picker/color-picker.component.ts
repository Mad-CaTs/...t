import { Component, ElementRef, Input, ViewChild } from '@angular/core';

import type { AbstractControl, FormGroup } from '@angular/forms';

@Component({
	selector: 'app-color-picker',
	templateUrl: './color-picker.component.html',
	styleUrls: ['./color-picker.component.scss']
})
export class ColorPickerComponent {
	@Input() placeholder: string = '';
	@Input() label: string = '';
	@Input() controlName: string = '';
	@Input() formGroup: FormGroup;

	openPicker: boolean = false;

	/* === Events === */

	onBlurInput(e: Event) {
		const target = e.target as HTMLInputElement;
		const value = target.value;
		const hexRegex = /^#([A-Fa-f0-9]{6})$/;

		if (value === '') return this.formValue.setValue('#000000');
		if (value.match(hexRegex)) return this.formValue.setValue(value);

		return this.formValue.setValue('#000000');
	}

	/* === Getters === */

	get formValue() {
		return this.formGroup.get(this.controlName) as AbstractControl;
	}

	get existErrors() {
		return this.formValue.touched && this.formValue.errors;
	}
}
