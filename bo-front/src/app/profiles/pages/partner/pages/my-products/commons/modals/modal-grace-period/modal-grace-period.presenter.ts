import { Injectable } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Injectable()
export class ModalGracePeriodPresenter {
	public gracePeriodForm: FormGroup;

	constructor(private fb: FormBuilder) {
		this.gracePeriodForm = this.fb.group({
			daysUsed: ['', Validators.required],
			flagSchedule: [true],
			gracePeriodTypeId: [1]
		});
	}
}
