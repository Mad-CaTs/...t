import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable()
export class CertificateModalPresenter {
	public form: FormGroup;

	constructor(private fb: FormBuilder) {
		this.form = this.fb.group({
			name: [{ value: '', disabled: true }],
			userCode: [{ value: '', disabled: true }],
			portfolio: [{ value: '', disabled: true }]
		});
	}
}
