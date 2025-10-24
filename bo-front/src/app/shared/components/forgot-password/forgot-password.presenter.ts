import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';

export class ForgotPasswordPresenter {
	emailForm: FormGroup;

	constructor(private fb: FormBuilder) {
		this.emailForm = this.createEmailForm();
	}
	createEmailForm(): FormGroup {
		return this.fb.group(
			{
				email: [
					'',
					[
						Validators.required,
						Validators.email,
						Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|org|net)$/)
					]
				],
				newPassword: ['', [Validators.required, Validators.minLength(8)]],
				currentPassword: ['', [Validators.required, Validators.minLength(8)]]
			},
			{ validators: this.passwordsMatchValidator }
		);
	}

	private passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
		const newPassword = group.get('newPassword')?.value;
		const currentPassword = group.get('currentPassword')?.value;

		if (!currentPassword) {
			return null;
		}
		return newPassword === currentPassword ? null : { passwordsMismatch: true };
	}

	clearEmailForm(): void {
		this.emailForm.reset();
	}

	removeField(fieldName: string): void {
		if (this.emailForm.contains(fieldName)) {
			this.emailForm.removeControl(fieldName);
		}
	}
}
