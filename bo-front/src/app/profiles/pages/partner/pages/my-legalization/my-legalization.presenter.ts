import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Injectable({
	providedIn: 'root' 
})
export class ModalLegalizationPresenter {
	public form: FormGroup;

	constructor(private fb: FormBuilder) {
		this.form = this.createForm();
	}

	private createForm(): FormGroup {
		return this.fb.group({
			payType: [null, Validators.required]
		});
	}

	
}
