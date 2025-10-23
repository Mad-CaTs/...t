import type { AbstractControl } from '@angular/forms';

export class ArrayValidator {
	public static minLength(min: number) {
		return (field: AbstractControl<unknown[]>) => {
			const value = field.value;

			if (value.length >= min) return null;

			return { message: `El campo debe tener almenos ${field} elementos` };
		};
	}
}
