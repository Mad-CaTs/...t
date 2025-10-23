import { Pipe, PipeTransform } from '@angular/core';

import { AbstractControl } from '@angular/forms';

@Pipe({
	name: 'inputError',
	standalone: true
})
export class InputErrorPipe implements PipeTransform {
	transform(value: AbstractControl, ...args: unknown[]): string {
		const errors = value.errors;

		if (!errors) return '';

		if (errors.required) return 'El campo es requerido';
		if (errors.minlength) {
			return `El campo debe tener un minimo de ${errors.minlength.requiredLength} caracteres.`;
		}
		if (errors.email) return 'El correo electrónico no es válido';

		if (errors.min) return `El valor ingresado debe ser igual o mayor a ${errors.min.min}'`;

		if (errors.message) return errors.message; // for custom errors

		return 'Este campo no es valido';
	}
}
