import { AbstractControl, ValidatorFn } from '@angular/forms';

export function minLengthValidator(minLength: number): ValidatorFn {
	return (control: AbstractControl): { [key: string]: any } | null => {
		const value = control.value;
    console.log("value.length", value);
    
		if (value && value.toString().length < minLength) {
			return { minLength: { requiredLength: minLength, actualLength: value.length } };
		}

		return null;
	};
}

export function maxLengthValidator(maxLength: number): ValidatorFn {
	return (control: AbstractControl): { [key: string]: any } | null => {
		const value = control.value;

		if (value && value.toString().length > maxLength) {
			return { maxLength: { requiredLength: maxLength, actualLength: value.length } };
		}

		return null;
	};
}
