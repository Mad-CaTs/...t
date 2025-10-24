import { Injectable } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Injectable()
export class ProspectPresenter {
	public prospectForm: FormGroup;
	public isPromotionalGuest: boolean = false;

	constructor(private fb: FormBuilder) {
		this.prospectForm = this.fb.group({
			userId: [''],
			name: ['', Validators.required],
			lastName: ['', Validators.required],
			gender: ['', Validators.required],
			email: ['', [Validators.required, Validators.email]],
			documentId: ['', Validators.required],
			nroDocument: ['', Validators.required],
			nroPhone: ['', Validators.required],
			prospectType: ['', Validators.required],
			residenceCountryId: ['', Validators.required],
			description: [''],
			file: [''],
			birthdate: [''],
			civilState: [''],
			specialType: ['']
		});

		this.prospectForm.get('prospectType')?.valueChanges.subscribe((value) => {
			this.updateSpecialTypeValidation();
		});
		this.togglePromotionalGuestFields(this.isPromotionalGuest);
	}

	private togglePromotionalGuestFields(isPromotionalGuest: boolean) {
		if (isPromotionalGuest) {
			this.prospectForm.removeControl('birthdate');
			this.prospectForm.removeControl('civilState');
			this.prospectForm.removeControl('file');
		} else {
			this.prospectForm.addControl('birthdate', this.fb.control('', Validators.required));
			this.prospectForm.addControl('civilState', this.fb.control('', Validators.required));
			this.prospectForm.addControl('file', this.fb.control('', Validators.required));
		}
		this.prospectForm.updateValueAndValidity();
	}

	private updateSpecialTypeValidation() {
		const prospectType = this.prospectForm.get('prospectType')?.value;
		if (this.isPromotionalGuest && prospectType === '2') {
			this.prospectForm.get('specialType')?.setValidators(Validators.required);
		} else {
			this.prospectForm.get('specialType')?.clearValidators();
		}
		this.prospectForm.get('specialType')?.updateValueAndValidity();
	}

	updatePromotionalGuestStatus(value: boolean): void {
		this.isPromotionalGuest = value;
		this.togglePromotionalGuestFields(value);
		this.updateSpecialTypeValidation();
	}

	getPromotionalGuestStatus(): boolean {
		return this.isPromotionalGuest;
	}
}
