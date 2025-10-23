import { AbstractControl } from '@angular/forms';

export class PasswordValidator {
	public static passwordValidator(confirmField: string) {
		return (field: AbstractControl) => {
			const capsRegex = /[A-Z]/;
			const numberRegex = /\d/;

			const value = field.value as string;
			const valueConfirm = field.parent?.get(confirmField)?.value;

			const errors = {
				length: true,
				caps: true,
				number: true
			};

			if (value.length >= 8) errors.length = false;
			if (capsRegex.test(value)) errors.caps = false;
			if (numberRegex.test(value)) errors.number = false;

			if (errors.caps || errors.length || errors.number) {
				return errors;
			}

			return null;
		};
	}

	public static confirmPassword(fieldName: string) {
		return (field: AbstractControl): { [key: string]: any } | null => {
			const password = field.parent?.get(fieldName)?.value;
			const confirmPassword = field.value;

			if (password === confirmPassword) return null;

			return { passwordsMismatch: true };
		};
	}
}
