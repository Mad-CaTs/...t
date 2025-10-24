import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable()
export class ModalCoRequesterPresenter {
	public coRequesterForm: FormGroup;

	constructor(private fb: FormBuilder) {
		this.coRequesterForm = this.fb.group({
			name: ['', [Validators.required, Validators.minLength(3)]],
			lastName: ['', [Validators.required, Validators.minLength(3)]],
			idDocument: [null],
			nroDocument: ['', [Validators.required, Validators.minLength(7)]],
			birthDate: [new Date().toUTCString(), Validators.required]
		});
	}
}
