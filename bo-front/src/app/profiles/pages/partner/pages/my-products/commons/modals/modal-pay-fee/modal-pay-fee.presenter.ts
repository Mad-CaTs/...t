import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable()
export class PayFeePresenter {
	public paymentForm: FormGroup;
	public defaultCurrencyId = 1;

  constructor(private fb: FormBuilder) {
    this.paymentForm = this.fb.group({
      currency: [this.defaultCurrencyId, Validators.required],
      note: [''],
      totalAmount: [null, Validators.required],
    });
  }
}


