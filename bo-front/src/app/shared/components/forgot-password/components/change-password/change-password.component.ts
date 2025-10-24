import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { DividerModule } from 'primeng/divider';
import { validatePasswordRules } from '../../commons/validators/password.validator';

@Component({
	selector: 'app-change-password',
	standalone: true,
	imports: [PasswordModule, FormsModule, ReactiveFormsModule, DividerModule],
	templateUrl: './change-password.component.html',
	styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent implements OnInit {
	@Input() form: FormGroup;

	isLowercaseValid: boolean = false;
	isUppercaseValid: boolean = false;
	isNumberValid: boolean = false;
	isLengthValid: boolean = false;

	ngOnInit(): void {
		const controlName = 'password';
		this.form.get(controlName)?.reset();
		this.form.get(controlName)?.valueChanges.subscribe(() => {
			this.onPasswordInput();
		});
	}

	onPasswordInput(): void {
		const password = this.form.get('password')?.value ?? '';
		const rules = validatePasswordRules(password);

		this.isLowercaseValid = rules.hasLowercase;
		this.isUppercaseValid = rules.hasUppercase;
		this.isNumberValid = rules.hasNumber;
		this.isLengthValid = rules.hasMinLength;
	}
}
