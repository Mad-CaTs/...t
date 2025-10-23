import { Component, Input } from '@angular/core';

import { FormControl, type FormGroup } from '@angular/forms';

@Component({
	selector: 'app-switch',
	templateUrl: './switch.component.html',
	styleUrls: ['./switch.component.scss']
})
export class SwitchComponent {
	@Input() label: string = '';
	@Input() controlName: string = '';
	@Input() formGroup: FormGroup;
	@Input() optionText: boolean = false;
	@Input() textFirst: string = '';
	@Input() textSecond: string = '';

	/* === Events === */
	public onChange(active: boolean) {
		this.control.setValue(active);
	}

	/* === Getters === */
	get control() {
		return this.formGroup.get(this.controlName) || new FormControl(false);
	}

	get transform() {
		const val = this.control.value;

		return val ? 'translateX(0)' : 'translateX(70px)';
	}
}
