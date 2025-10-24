import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, SimpleChanges, Output, OnInit } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckboxComponent } from '@shared/components/form-control/checkbox/checkbox.component';
import { InputComponent } from '@shared/components/form-control/input/input.component';

@Component({
	selector: 'app-card-correo',
	standalone: true,
	imports: [CommonModule, FormsModule, ReactiveFormsModule, InputComponent, CheckboxComponent],
	templateUrl: './card-correo.component.html',
	styleUrl: './card-correo.component.scss'
})
export class CardCorreoComponent implements OnInit {
	@Input() title: string = '';
	@Input() checked: boolean = false;
	@Input() nombre?: string;
	@Input() apellido?: string;
	@Input() email?: string;
	@Input() showAvatar: boolean = false;
	@Input() isDisabled: boolean = false;
	@Input() placeholder: string = 'Contenido';
	@Input() showInputEmail: boolean = true;

	@Input() form!: FormGroup;
	@Input() controlName!: string;

	@Output() emailChange = new EventEmitter<string>();
	@Output() checkedChange = new EventEmitter<boolean>();
	@Output() emailAndCheckChange = new EventEmitter<{ email: string; checked: boolean }>();

	@Input() controlNameCheckbox!: string;
	@Input() controlNameEmail!: string;
	@Output() checkboxStatusChange = new EventEmitter<number>();

	ngOnInit() {
		this.form.patchValue({ [this.controlNameCheckbox]: this.checked });
	}

	onEmailBlur() {
		const val = this.form.get(this.controlNameEmail)!.value;
		this.emailChange.emit(val);
	}

	onCheckboxChange(isChecked: boolean) {
		this.checkedChange.emit(isChecked);
		this.checkboxStatusChange.emit(isChecked ? 1 : 0);
		const emailCtrl = this.form.get(this.controlNameEmail)!;
		if (isChecked) {
			emailCtrl.enable();
		} else {
			emailCtrl.disable();
		}
	}

	preventSpaces(event: KeyboardEvent): void {
		if (event.key === ' ') {
			event.preventDefault();
		}
	}

	trimSpaces(field: string): void {
		const control = this.form.get(field);
		if (control) {
			const noSpacesValue = control.value?.replace(/\s+/g, '') || '';
			control.setValue(noSpacesValue);
		}
	}
}
