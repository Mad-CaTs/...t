import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
	selector: 'app-checkbox',
	templateUrl: './checkbox.component.html',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule, CheckboxModule, FormsModule],
	styleUrls: []
})
export class CheckboxComponent {
	@Input() controlName: any;
	@Input() checked: boolean = false;

	@Input() form: any = new FormGroup({});
	@Input() label: string = 'Label';
	@Output() change = new EventEmitter<boolean>();
	
	@Input() set disabled(disabled: boolean) {
		if (disabled) {
			this.control?.disable();
		} else {
			this.control?.enable();
		}
	}

	private get control() {
		return this.form.get(this.controlName);
	}
	changeCheckbox({ checked }) {
		this.change.emit(checked);
	}
}
