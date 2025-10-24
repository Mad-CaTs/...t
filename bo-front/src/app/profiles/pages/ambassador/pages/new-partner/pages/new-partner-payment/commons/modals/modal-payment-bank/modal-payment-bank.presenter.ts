import { EventEmitter, Injectable, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable()
export class PaymentBankPresenter {
	@Output() bankSelected = new EventEmitter<number>();
	public paymentForm: FormGroup;
	public defaultCurrencyId = 1;

	constructor(private fb: FormBuilder) {
		this.paymentForm = this.fb.group({
			currency: [this.defaultCurrencyId, Validators.required],
			currencyDescription: ['', Validators.required],
			listaVouches: this.fb.array([]),
			bancoSeleccionado: [null]
		});

		this.addForm();
		this.handleBankSelectionChange();
	}
	handleBankSelectionChange() {
		this.paymentForm.get('bancoSeleccionado')?.valueChanges.subscribe((bankId) => {
			this.bankSelected.emit(bankId);
		});
	}


	addForm() {
		const formGroup = this.fb.group({
			operationDescription: ['', Validators.required],
			viewMode: [false],
			showDetail: [false],
			methodSubTipoPagoId: [null, Validators.required],
			operationNumber: [null, Validators.required],
			note: [''],
			totalAmount: [null, Validators.required],
			imagen: [null, Validators.required],
			comision: [0, Validators.required],
			comisionSoles: [0, Validators.required],
			comisionDolares: [0, Validators.required],
			currency: [this.defaultCurrencyId],
			currencyDescription: [''],
			methodSelected: [null],
			subTipoOptions: [null]
		});

		console.log('Agregando nuevo voucher a listaVouches...');
		console.log(
			'Estado de listaVouches antes de agregar:',
			(this.paymentForm.get('listaVouches') as FormArray).controls.length
		);

		(this.paymentForm.get('listaVouches') as FormArray).push(formGroup);
		console.log(
			'Estado de listaVouches después de agregar:',
			(this.paymentForm.get('listaVouches') as FormArray).controls.length
		);
	}

	removeForm(index: number) {
		(this.paymentForm.get('listaVouches') as FormArray).removeAt(index);
	}

	/* 	public get isThereEditing() {
		return this.paymentForm.get('listaVouches').value.some((voucher) => !voucher.viewMode);
	} */
	public get isThereEditing() {
		return this.paymentForm.get('listaVouches').value.some((voucher) => !voucher.viewMode);
	}
}
