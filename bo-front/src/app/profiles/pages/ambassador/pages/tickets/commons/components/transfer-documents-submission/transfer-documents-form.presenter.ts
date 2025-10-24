import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable()
export class TransferDocumentsFormPresenter {
	public form: FormGroup;

	constructor(private fb: FormBuilder) {
		this.form = this.createForm();
/* 		this.setupConciliationDependency();
 */	}

	private createForm(): FormGroup {
		return this.fb.group({
			documentoIdentidad: [null, Validators.required],
			declaracionJurada: [null, Validators.required],
			/* HASTA IMPLEMENTAR CONCILIACIONES  */
/* 			hasPendingConciliations: [null, Validators.required],
 		conciliationResponsible: [null],*/
			partnerDocument: [null, Validators.required]
		});
	}

private setupConciliationDependency(): void {
  this.form.get('hasPendingConciliations')?.valueChanges.subscribe((value) => {
    const conciliationCtrl = this.form.get('conciliationResponsible');

    if (value === 1) {
      conciliationCtrl?.setValidators([Validators.required]);
    } else {
      conciliationCtrl?.clearValidators();
    }

    // Actualizamos la validez sin disparar valueChanges
    conciliationCtrl?.updateValueAndValidity({ emitEvent: false });
  });
}





	resetForm() {
		this.form.reset();
	}
}
