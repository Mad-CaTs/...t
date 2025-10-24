import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
	selector: 'app-control-error',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './control-error.component.html',
	styleUrl: './control-error.component.scss'
})
export class ControlErrorComponent {
	@Input() controlName: string;
	@Input() form: FormGroup;

	public get getFieldError(): string | null {
		if (!this.form.controls[this.controlName] || !this.form.controls[this.controlName].touched)
			return null;

		const errors = this.form.controls[this.controlName].errors || {};
		

		const minLength = this.form.controls[this.controlName].getError('minLength')?.requiredLength;
		const maxLength = this.form.controls[this.controlName].getError('maxLength')?.requiredLength;
		const min = this.form.controls[this.controlName].getError('min')?.min;
		const max = this.form.controls[this.controlName].getError('max')?.max;

		for (const key of Object.keys(errors)) {
			switch (key) {
				case 'required':
					return 'Este campo es requerido.';
				case 'minLength':
					return `Debe tener mínimo ${minLength} caracteres.`;
				case 'maxLength':
					return `Debe tener máximo ${maxLength} caracteres.`;
				case 'email':
					return 'El formato del correo electrónico es inválido.';
				case 'pattern':
					return 'El formato del campo es inválido.';
				case 'min':
					return `El valor mínimo permitido es ${min}`;
				case 'max':
					return `El valor máximo permitido es ${max}`;
				case 'DNI_PERU':
					return 'El DNI debe tener 8 dígitos.';
				case 'onlyNumbers':
					return 'Este campo solo acepta números.';
				case 'documentExists':
					return 'Este número de documento ya está registrado.';
				case 'emailExists':
					return 'Este correo electrónico ya está registrado.';
				case 'userNotFound':
					return 'El usuario no se encuentra registrado.';
				case 'passwordInvalid':
					return 'La contraseña ingresada es incorrecta.';
				case 'prospectFound':
					return 'Este documento pertenece al prospecto de otro usuario.';
				case 'error':
					return 'Error en la validación, vuelva a ingresar su documento.';
				default:
					return null;
			}
		}

		return null;
	}
}
