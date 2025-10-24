import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable()
export class PaypalBankPresenter {
	public paypalForm: FormGroup;

	constructor(private fb: FormBuilder) {
		this.paypalForm = this.fb.group({
			totalMount: [null, Validators.required]
		});
	}
}
