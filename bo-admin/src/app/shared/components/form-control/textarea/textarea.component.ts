import { Component, Input } from '@angular/core';

import type { AbstractControl, FormGroup } from '@angular/forms';

@Component({
	selector: 'app-textarea',
	templateUrl: './textarea.component.html'
})
export class TextAreaComponent {
	@Input() type: HTMLInputElement['type'] = 'text';
	@Input() placeholder: string = '';
	@Input() label: string = '';
	@Input() tooltipContent: string = '';
	@Input() controlName: string = '';
	@Input() formGroup: FormGroup;

	/* === Decoration === */
	@Input() iconLeft: string | null = null;
	@Input() textLeft: string | null = null;
	@Input() iconRigth: string | null = null;
	@Input() textRigth: string | null = null;
	@Input() helper: string | null = null;
	@Input() classInput: string = '';

	/* === Getters === */
	get formValue() {
		return this.formGroup.get(this.controlName) as AbstractControl;
	}

	get existErrors() {
		return this.formValue.touched && this.formValue.errors;
	}
}
