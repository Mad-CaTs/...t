import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ControlErrorComponent } from '@shared/components/control-error/control-error.component';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { PasswordModule } from 'primeng/password';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
	selector: 'app-input',
	templateUrl: './input.component.html',
	styleUrls: ['./input.component.scss'],
	standalone: true,
	imports: [
		MatIconModule,
		CommonModule,
		ReactiveFormsModule,
		InputTextModule,
		ControlErrorComponent,
		ProgressSpinnerModule,
		InputNumberModule,
		PasswordModule
	]
})
export class InputComponent {
	@Input() type: string = 'text';
	@Input() controlName: string;
	@Input() label: string;
	@Input() form: FormGroup;
	@Input() placeholder: string;
	@Input() iconName: string;
	@Input() phonecodeCountry: string;
	@Input() isIconLeft: boolean;
	@Input() isIconRight: boolean;
	@Input() buttons: boolean = false;
	@Input() maxValue: number;
	@Input() isLoading: boolean = false;
	@Input() showIcon: boolean = false;
	@Input() isRed: boolean = false;
	@Output() clickIconRight = new EventEmitter<void>();

	@Output() focusOut = new EventEmitter<void>();
	public showPassword: boolean = false;

	@Input() set disabled(disabled: boolean) {
		if (disabled) {
			this.control?.disable();
		} else {
			this.control?.enable();
		}
	}

	public get getImage() {
		return `${this.iconName}`;
	}

	public get getCode(): string {
		return this.phonecodeCountry;
	}

	private get control() {
		return this.form.get(this.controlName);
	}

	handleFocusOut(event: FocusEvent): void {
		this.focusOut.emit();
	}

	handleClickIconRight(event: MouseEvent): void {
		this.clickIconRight.emit();
	}

	togglePasswordVisibility(): void {
		this.showPassword = !this.showPassword;
	  }
	

	
}
