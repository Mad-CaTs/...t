import { CurrencyPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import type { AbstractControl, FormGroup } from '@angular/forms';

@Component({
	selector: 'app-input',
	templateUrl: './input.component.html',
	styleUrls: ['./input.component.scss']
})
export class InputComponent {
	@Input() type: HTMLInputElement['type'] = 'text';
	@Input() placeholder: string = '';
	@Input() label: string = '';
	@Input() tooltipContent: string = '';
	@Input() controlName: string = '';
	@Input() formGroup: FormGroup;
	@Input() pattern: RegExp | null = null;

	/* === Decoration === */
	@Input() iconLeft: string | null = null;
	@Input() textLeft: string | null = null;
	@Input() iconRigth: string | null = null;
	@Input() textRigth: string | null = null;
	@Input() helper: string | null = null;
	@Input() classInput: string = '';
	@Input() minLength?: number;

	/* === Currency Formatting === */
	@Input() isCurrency: boolean = false;

	constructor(private currencyPipe: CurrencyPipe) {}

	/* === Events === */
	public onKeyPress(event: KeyboardEvent) {
		if (this.isCurrency) {
			const charCode = event.charCode;
			const current: string = (event.target as HTMLInputElement).value;

			if (
				((charCode < 48 || charCode > 57) && charCode !== 46) ||
				(charCode === 46 && current.includes('.'))
			) {
				event.preventDefault();
			}
		}
	}

	public onBlur(e: Event) {
		const target = e.target as HTMLInputElement;
		let value = target.value;

		if (this.isCurrency) {
			value = this.formatCurrency(value);
		}

		this.formValue.setValue(value);
	}

	formatCurrency(value: string): string {
		const numericValue = value.replace(/[^0-9.]/g, '');
		return this.currencyPipe.transform(numericValue, 'USD', 'symbol', '1.2-2') || '';
	}

	/* === Getters === */
	get formValue() {
		return this.formGroup.get(this.controlName) as AbstractControl;
	}

	get existErrors() {
		return this.formValue.touched && this.formValue.errors;
	}
}
