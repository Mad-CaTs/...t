import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable()
export class PaypalBankPresenter {
	public paypalForm: FormGroup;

	constructor(private fb: FormBuilder) {
		this.paypalForm = this.fb.group({
			typeCurrency: [null, Validators.required],
			paymentSubTypeId: [9, Validators.required]
		});
	}
}
