import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export interface PasswordValidationResult {
	hasLowercase: boolean;
	hasUppercase: boolean;
	hasNumber: boolean;
	hasMinLength: boolean;
}

export function validatePasswordRules(password: string): PasswordValidationResult {
	return {
		hasLowercase: /[a-z]/.test(password),
		hasUppercase: /[A-Z]/.test(password),
		hasNumber: /\d/.test(password),
		hasMinLength: password.length >= 8
	};
}

export function strongPasswordValidator(): ValidatorFn {
	return (control: AbstractControl): ValidationErrors | null => {
		const value = control.value || '';
		const rules = validatePasswordRules(value);

		const isValid = rules.hasLowercase && rules.hasUppercase && rules.hasNumber && rules.hasMinLength;

		return !isValid ? { strongPassword: true } : null;
	};
}
