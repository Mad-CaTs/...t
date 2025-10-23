import { Component, Input } from '@angular/core';

import type { AbstractControl, FormGroup } from '@angular/forms';

@Component({
	selector: 'app-password-field',
	templateUrl: './password-field.component.html',
	styleUrls: ['./password-field.component.scss']
})
export class PasswordFieldComponent {
	@Input() controlName: string = '';
	@Input() formGroup: FormGroup;
	@Input() label: string = '';

	showPassword: boolean = false;

	get formValue(): AbstractControl {
		return this.formGroup.get(this.controlName) as AbstractControl;
	}

	get existErrors() {
		return this.formValue.touched && this.formValue.errors;
	}
}
