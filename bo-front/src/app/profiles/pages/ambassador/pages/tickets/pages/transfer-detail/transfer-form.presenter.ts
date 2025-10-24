import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class TransferFormPresenter {
	public form: FormGroup;

	private readonly base = [
		'name',
		'lastname',
		'nroDocument',
		'civilState',
		'idDocument',
		'residenceCountryId',
		'birthDate',
		'country',
		'province',
		'districtAddress',
		'address',
		'email',
		'gender',
		'phone'
	];

	private readonly config: Record<number, string[]> = {
		1: this.base,
		2: [...this.base, 'transferProfileId'],
		3: [...this.base, 'membership', 'searchBy'],
		4: ['name', 'lastname', 'nroDocument', 'idDocument', 'membership', 'searchBy']
	};

	constructor(private fb: FormBuilder) {
		this.form = this.fb.group({
			name: [''],
			lastname: [''],
			nroDocument: [null, [Validators.required]],
			civilState: [''],
			idDocument: [null],
			residenceCountryId: [''],
			birthDate: [''],
			country: [''],
			province: [''],
			districtAddress: [''],
			address: [''],
			email: [
				'',

				[
					Validators.required,
					Validators.email,
					Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|org|net)$/)
				]
			],

			gender: [''],
			phone: [''],
			stepTwoOption: [''],
			transferProfileId: [''],
			membership: [''],
			searchBy: ['']
		});

		this.form.get('stepTwoOption')?.valueChanges.subscribe((v) => this.applyValidators(v));
		this.applyValidators(this.form.get('stepTwoOption')?.value);
	}

	private applyValidators(value: number) {
		Object.keys(this.form.controls).forEach((c) => {
			if (c !== 'stepTwoOption' && c !== 'nroDocument') {
				const control = this.form.get(c);
				if (control) {
					control.clearValidators(); // limpiamos todos los validators
					if ((this.config[value] || []).includes(c)) {
						control.setValidators([Validators.required]); // solo para los que aplican
					}
					control.updateValueAndValidity({ emitEvent: false });
				}
			}
		});
	}

	/* 	private applyValidators(value: number) {
		Object.keys(this.form.controls).forEach((c) => {
			if (c !== 'stepTwoOption' && c !== 'nroDocument') {
				const control = this.form.get(c);
				if (control) {
					const existingValidators = control.validator ? [control.validator] : [];
					control.clearValidators();
					control.updateValueAndValidity({ emitEvent: false });
					if ((this.config[value] || []).includes(c)) {
						control.setValidators([...existingValidators, Validators.required]);
					} else {
						control.setValidators(existingValidators);
					}
					control.updateValueAndValidity({ emitEvent: false });
				}
			}
		});
	} */

	/*  private applyValidators(value: number) {
		Object.keys(this.form.controls).forEach((c) => {
			if (c !== 'stepTwoOption' && c !== 'nroDocument') {
				this.form.get(c)?.clearValidators();
				this.form.get(c)?.updateValueAndValidity({ emitEvent: false });
			}
		});

		(this.config[value] || []).forEach((c) => {
			if (c !== 'nroDocument') {
				this.form.get(c)?.setValidators([Validators.required]);
			}
			this.form.get(c)?.updateValueAndValidity({ emitEvent: false });
		});
	}   */
	
	resetForm() {
		this.form.reset();
	} 



}
