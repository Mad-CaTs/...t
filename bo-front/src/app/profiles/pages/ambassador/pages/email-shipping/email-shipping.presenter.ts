import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable()
export class EmailShippingTablePresenter {
	public form: FormGroup;

	constructor(private fb: FormBuilder) {
		this.form = this.buildForm();
	}

	public buildForm(): FormGroup {
		return this.fb.group({
			searchBy: ['']
		});
	}

	public initAdditionalFormLogic(): FormGroup {
		this.form.addControl('checked1', this.fb.control(false));
		this.form.addControl(
			'email1',
			this.fb.control({ value: '', disabled: true }, [Validators.required, Validators.email])
		);

		this.form.addControl('checked2', this.fb.control(false));
		this.form.addControl(
			'email2',
			this.fb.control({ value: '', disabled: true }, [
				Validators.required,
				Validators.email,
				Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|org|net)$/) // Para el segundo correo
			])
		);
		this.form.addControl('checked3', this.fb.control(false));
		this.form.addControl(
			'email3',
			this.fb.control({ value: '', disabled: true }, [
				Validators.required,
				Validators.email,
				Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|org|net)$/) // Para el segundo correo
			])
		);

		this.form.get('checked2')!.valueChanges.subscribe((checked) => {
			const ctrl = this.form.get('email2')!;
			if (checked) {
				ctrl.enable();
			} else {
				ctrl.disable();
				ctrl.setValue('');
			}
			this.updateEnviarButtonState();
		});

		this.form.get('checked3')!.valueChanges.subscribe((checked) => {
			const ctrl = this.form.get('email3')!;
			if (checked) {
				ctrl.enable();
			} else {
				ctrl.disable();
				ctrl.setValue('');
			}
			this.updateEnviarButtonState();
		});

		this.form.get('email2')!.valueChanges.subscribe(() => this.updateEnviarButtonState());
		this.form.get('email3')!.valueChanges.subscribe(() => this.updateEnviarButtonState());

		this.updateEnviarButtonState();

		return this.form;
	}

	public updateEnviarButtonState() {
		const checked2 = this.form.get('checked2')?.value;
		const checked3 = this.form.get('checked3')?.value;

		const email2Valid = this.form.get('email2')?.valid;
		const email3Valid = this.form.get('email3')?.valid;
	}

	public resetFormState(): void {
		this.form.reset();
		this.form.patchValue({
			checked1: false,
			checked2: false,
			email2: '',
			checked3: false,
			email3: ''
		});

		this.form.get('checked1')?.setValue(false, { emitEvent: false });
		this.form.get('email2')?.disable();
		this.form.get('email3')?.disable();

		this.updateEnviarButtonState();
	}

	public isEnviarDisabled(selectedCardIndex: number | null, isLoading: boolean): boolean {
		const checked2 = this.form?.get('checked2')?.value;
		const checked3 = this.form?.get('checked3')?.value;

		const email2Valid = this.form?.get('email2')?.valid;
		const email3Valid = this.form?.get('email3')?.valid;

		if (selectedCardIndex === null || isLoading) return true;
		if ((checked2 && !email2Valid) || (checked3 && !email3Valid)) return true;

		return false;
	}
}
