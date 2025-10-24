import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable()
export class AccountAddCoRequesterPresenter {
	public coRequesterForm: FormGroup;

	constructor(private fb: FormBuilder) {
		this.coRequesterForm = this.fb.group({
			names: ['', [Validators.required, Validators.minLength(4)]],
			lastnames: ['', [Validators.required, Validators.minLength(4)]],
			docType: [0],
			docNumber: ['', [Validators.required, Validators.minLength(7)]],
			bornDate: [new Date().toUTCString(), Validators.required]
		});
	}
}
