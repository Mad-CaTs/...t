import { CommonModule, DecimalPipe } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { FileComponent } from '@shared/components/form-control/file/file.component';
import { InputComponent } from '@shared/components/form-control/input/input.component';
import RadiosComponent from '@shared/components/form-control/radios/radios.component';
import { SelectComponent } from '@shared/components/form-control/select/select.component';
import { TextAreaComponent } from '@shared/components/form-control/text-area/text-area.component';
import { DialogModule } from 'primeng/dialog';
import { PaymentLegalPresenter } from './modal-payment-legal.presenter';
import { ISelect } from '@shared/interfaces/forms-control';
import { ModalPartnerPaymentService } from 'src/app/profiles/pages/ambassador/pages/new-partner/pages/new-partner-payment/servicio/new-partner-payment.service';
import { CurrencyType } from 'src/app/profiles/commons/enums';
import { numberFormat } from '@shared/utils';

@Component({
	selector: 'app-modal-payment-legal-component',
	standalone: true,
	imports: [
		SelectComponent,
		InputComponent,
		FileComponent,
		CommonModule,
		ReactiveFormsModule,
		MatIconModule,
		DialogModule,
		RadiosComponent
	],
	providers: [PaymentLegalPresenter, DecimalPipe],
	templateUrl: './modal-payment-legal.component.html',
	styleUrl: './modal-payment-legal.component.scss'
})
export class ModalPaymentLegalComponent {
	@Input() data;
	@Input() pkgDetail;
	@Input() bussinesAccounts;
	@Input() companyName;
	@Input() methodSelected: ISelect[];
	/* 	@Input() methodSelected: ISelect;
	 */ /* 	@Input() methodSelected: ISelect[];
	 */ @Output() onAddVouchers = new EventEmitter<any>();
	@Output() onCloseModal = new EventEmitter<any>();
	totalAmountPaid: string;
	public optBanks: ISelect[] /* = optBanks */;
	documentShippingCost: string;
	baseAmount: number;
	public topBanksToShow = [];
	@Output() bancoCambiado = new EventEmitter<number>();
	onChangeNationality: any;
	selectedCurrency: any;
	voucherAdded: boolean = false;
	constructor(
		public paymentLegalPresenter: PaymentLegalPresenter,
		private modalPartnerPaymentService: ModalPartnerPaymentService,
		private fb: FormBuilder,
		private cdr: ChangeDetectorRef
	) {
		this.paymentLegalPresenter.bankSelected.subscribe((bankId) => {
			if (this.data.fromLegalization) {
				this.onBankChange(bankId);
			}
		});
	}

	get paymentForm() {
		return this.paymentLegalPresenter.paymentForm;
	}

	ngOnInit(): void {
		console.log('initmethodSelected', this.methodSelected);
				console.log('this.data.vouchers', this.data);

		this.initCurrencySelection();

		if (this.data?.listaVouchersDesdeApi?.vouchers) {
			console.log("this.data?.listaVouchersDesdeApi?.vouchers",this.data?.listaVouchersDesdeApi?.vouchers)
			this.paymentForm.patchValue(this.data?.listaVouchersDesdeApi?.vouchers);
			const form = (this.paymentForm.get('listaVouches') as FormArray).at(0);
			form.patchValue({

 				...this.data.voucherToEdit,
 				viewMode: false
			});
		}
		if (this.data?.vouchers) {
			this.precargarVoucherDesdeStep();

			const form = (this.paymentForm.get('listaVouches') as FormArray).at(0);
			if (form) {
				const methodControl = form.get('methodSubTipoPagoId');
				console.log('ValorinicialdemethodSubTipoPagoId:', methodControl?.value);

				// 👇 Nos suscribimos a los cambios
				methodControl?.valueChanges.subscribe((value) => {
					console.log('🔄 methodSubTipoPagoId actualizado a:', value);
				});
			}

			return;
		}

		/* if (this.data?.isFromStepTimeline) {
			this.precargarVoucherDesdeStep();
			return;
		} */
	}

	onRadioChange(idSeleccionado: number) {
		console.log('idSeleccionado', idSeleccionado);
		const metodo = this.optBanks.find((b) => b.value === idSeleccionado);
		console.log('metodo', metodo);
		this.data.methodSelected = metodo;
	}

	onBankChange(bankId: number) {
		this.modalPartnerPaymentService.getBankAccountsForPaymentType(bankId).subscribe((accounts) => {
			this.bussinesAccounts = accounts;
		});
	}

	private initCurrencySelection(): void {
		this.baseAmount = this.data.totalAmountPaid;
		const currencyIdToUse = this.data?.idCurrency ?? this.paymentLegalPresenter.defaultCurrencyId;
		const selectedCurrency =
			this.data.operationCurrency.find((c) => c.value === currencyIdToUse) ||
			this.data.operationCurrency[0];
		this.changeSelectionCurrency(selectedCurrency);
	}


	precargarListVoucherDesdeStep(): void {
		const formArray = this.paymentLegalPresenter.paymentForm.get('listaVouches') as FormArray;
		formArray.clear();
	  
		const vouchersApi = this.data.vouchers || [];
	  console.log("vouchersApi",vouchersApi)
		vouchersApi.forEach((voucherData: any) => {
		  const voucherForm = this.fb.group({
			operationDescription: [voucherData.operationDescription || 'Transferencia desde step'],
			viewMode: [false],
			showDetail: [false],
			methodSubTipoPagoId: [voucherData.methodSubTipoPagoId || null],
			operationNumber: [voucherData.operationNumber || ''],
			note: [voucherData.note || ''],
			totalAmount: [voucherData.totalAmount || 0],
			imagen: [null],
			comision: [0],
			comisionSoles: [0],
			comisionDolares: [0],
			currency: [voucherData.currency],
			currencyDescription: [voucherData.currencyDescription],
			methodSelected: [this.methodSelected]
		  });
	  
		  formArray.push(voucherForm);
		});
	  }
	  

 /* 	precargarListVoucherDesdeStep(): void {
		const formArray = this.paymentLegalPresenter.paymentForm.get('listaVouches') as FormArray;
		formArray.clear();
		const tipo = this.data.methodSelected?.paymentSubTypeList;
		console.log('tipo', tipo);

		const primerTipoOperacion = this.data.methodSubTipoPagoId;

		const voucherPrellenado = this.fb.group({
			operationDescription: ['Transferencia desde step'],
			viewMode: [false],
			showDetail: [false],
			methodSubTipoPagoId: [primerTipoOperacion],
			operationNumber: ['000-STEP-API'],
			note: ['Pago generado desde paso seleccionado'],
			totalAmount: [this.data.totalAmountPaid || 100],
			imagen: [null],
			comision: [0],
			comisionSoles: [0],
			comisionDolares: [0],
			currency: [this.data.operationCurrency[0].value],
			currencyDescription: [this.data.operationCurrency[0].content],
			methodSelected: [this.methodSelected]
		});

		formArray.push(voucherPrellenado);
	}  */

	precargarVoucherDesdeStep(): void {
		this.filtrarTopBancos();
/* tirene que ser metodo select this.data?.methodSelected?.idPaymentType */
		if (		this.data?.methodSelected
) {
			// Aseguramos que el radio ya se haya renderizado
			setTimeout(() => {
				console.log(
					'🔁 Asignando bancoSeleccionado desde methodSelected.idPaymentType:',
					this.data?.methodSelected
					/* this.data.methodSelected.idPaymentType */
				);
				this.paymentForm.get('bancoSeleccionado')?.setValue(this.data?.methodSelected);
				this.cdr.detectChanges(); // Refresca la vista por si acaso
			}, 0);
		}
		this.precargarListVoucherDesdeStep();
	}

	filtrarTopBancos(): void {
		if (this.data?.optBanksAll?.length) {
			this.optBanks = this.data.optBanksAll
				.filter((bank) => bank.description.toUpperCase() !== 'PAYPAL') // ❌ Excluye PAYPAL
				.slice(0, 3)
				.map((bank) => {
					const bancoMapeado = {
						content: bank.description,
						value: Number(bank.idPaymentType), // 👈 Aseguramos tipo number
						...bank
					};
					console.log('📌 Banco mapeado:', bancoMapeado);
					return bancoMapeado;
				});
			if (this.data?.methodSelected?.idPaymentType) {
				console.log(
					'🔁 Asignando bancoSeleccionado desde methodSelected.idPaymentType:',
					this.data.methodSelected.idPaymentType
				);
				this.paymentForm.get('bancoSeleccionado')?.setValue(this.data.methodSelected.idPaymentType);
			}

			console.log('✅ Bancos finales mapeados sin PAYPAL:', this.optBanks);
			console.log('🔎 Tipo del value en radios (debería ser number):', typeof this.optBanks[0]?.value);
		}
	}

	get voucherButtonText(): string {
		if (this.data.voucherToEdit) {
			return 'Actualizar';
		}

		if (this.voucherAdded) {
			return 'Agregar';
		}

		return 'Guardar';
	}

	onClickAddMoreVouchers() {
		this.voucherAdded = false;
		this.paymentLegalPresenter.addForm();
	}

	handleVoucherAction() {
		const formArrayItem = (this.paymentForm.get('listaVouches') as FormArray).at(0) as FormGroup;

		if (this.paymentForm.invalid) {
			alert('Tienes campos requeridos por completar');
			this.paymentForm.markAllAsTouched();
			return;
		}

		if (this.data.voucherToEdit) {
			this.updateVoucher(formArrayItem);
		} else if (this.voucherAdded) {
			this.addVouchers();
		} else {
			this.saveVoucher();
			this.voucherAdded = true;
		}
	}

	updateVoucher(formArrayItem: FormGroup) {
		if (formArrayItem.valid) {
			formArrayItem.get('currency').setValue(this.paymentForm.get('currency').value);
			formArrayItem
				.get('currencyDescription')
				.setValue(this.paymentForm.get('currencyDescription').value);
			formArrayItem.get('methodSelected').setValue(this.methodSelected);
			formArrayItem.get('viewMode').setValue(true);
			this.onAddVouchers.emit(this.paymentForm.value);
		} else {
			formArrayItem.markAllAsTouched();
		}
	}

	onChangCurrency({ value: { name } }) {
		this.onChangeNationality.emit(name);
	}

	getAmount(form, amount) {
		return form.value.currency === 2 ? `S/ ${amount * this.data.exchangeType}` : `$ ${amount}`;
	}

	closeModal() {
		this.onCloseModal.emit();
	}

	addVouchers() {
		if (this.paymentForm.invalid) {
			alert('Tienes campos requeridos por completar');
			this.paymentForm.markAllAsTouched();
			return;
		}

		if (!this.paymentLegalPresenter.isThereEditing) {
			const voucherData = {
				...this.paymentForm.value,
				exchangeType: this.data?.exchangeType,
				documentShippingCost: this.documentShippingCost
			};
			this.onAddVouchers.emit(voucherData);
			this.paymentLegalPresenter.addForm();
		} else {
			alert('Debe guardar todos los Váuchers antes de Agregar');
		}
	}

	changeSelectionCurrency(data) {
		this.paymentForm.get('currency').setValue(data.value);
		this.changeCurrency(data.value);
		this.paymentForm.get('currencyDescription').setValue(data.content);
	}

	public changeCurrency(value: CurrencyType) {
		const fixedSoles = 20;

		switch (value) {
			case CurrencyType.DOLARES:
				this.selectedCurrency = '$';
				this.totalAmountPaid = this.data.fromLegalization
					? numberFormat(this.baseAmount / this.data.exchangeType)
					: numberFormat(this.baseAmount);

				this.documentShippingCost =
					this.data.fromLegalization && this.data.payTypeSelected !== 1
						? numberFormat(fixedSoles / this.data.exchangeType)
						: null;

				this.getListVouchersForm.controls.forEach((form) => {
					form.get('comision').setValue(form.get('comisionDolares').value);
				});
				break;

			case CurrencyType.SOLES:
				this.selectedCurrency = 'S/';
				this.totalAmountPaid = this.data.fromLegalization
					? numberFormat(this.baseAmount)
					: numberFormat(this.baseAmount * this.data.exchangeType);

				this.documentShippingCost =
					this.data.fromLegalization && this.data.payTypeSelected !== 1
						? numberFormat(fixedSoles)
						: null;

				this.getListVouchersForm.controls.forEach((form) => {
					form.get('comision').setValue(form.get('comisionSoles').value);
				});
				break;

			case CurrencyType.PESOSCOLOMBIANOS:
				const tasaPesos = 4802.97;
				this.selectedCurrency = 'COL';
				this.totalAmountPaid = this.data.fromLegalization
					? numberFormat((this.baseAmount / this.data.exchangeType) * tasaPesos)
					: numberFormat(this.baseAmount * tasaPesos);

				this.documentShippingCost =
					this.data.fromLegalization && this.data.payTypeSelected !== 1
						? numberFormat((fixedSoles * tasaPesos) / this.data.exchangeType)
						: null;

				this.getListVouchersForm.controls.forEach((form) => {
					form.get('comision').setValue(form.get('comisionDolares').value);
				});
				break;

			default:
				break;
		}
	}

	private get getListVouchersForm(): FormArray {
		return this.paymentForm.get('listaVouches') as FormArray;
	}

	changeSelectionOperation(formArrayItem: FormGroup, item) {
		const commissionSoles = item.commissionSoles;
		const commissionDollars = item.commissionDollars;
		const selectedCurrency = this.paymentForm.get('currency').value;
		formArrayItem.get('comisionSoles').setValue(commissionSoles);
		formArrayItem.get('comisionDolares').setValue(commissionDollars);

		switch (selectedCurrency) {
			case CurrencyType.DOLARES:
				formArrayItem.get('comision').setValue(commissionDollars);
				break;

			case CurrencyType.SOLES:
				formArrayItem.get('comision').setValue(commissionSoles);
				break;

			default:
				formArrayItem.get('comision').setValue(commissionDollars);
				break;
		}

		formArrayItem.get('operationDescription').setValue(item.content);
	}
	saveVoucher() {
		const vouchers = (this.paymentForm.get('listaVouches') as FormArray).controls;
		let allValid = true;

		vouchers.forEach((voucher, index) => {
			if (voucher.valid) {
				voucher.get('currency').setValue(this.paymentForm.get('currency').value);
				voucher
					.get('currencyDescription')
					.setValue(this.paymentForm.get('currencyDescription').value);
				voucher.get('methodSelected').setValue(this.methodSelected);
				voucher.get('viewMode').setValue(true);
			} else {
				voucher.markAllAsTouched();
				allValid = false;
			}
		});
		if (!allValid) {
			alert('Hay errores en algunos vouchers');
		} else {
			console.log('Todos los vouchers se guardaron correctamente');
		}
	}

	editForm(formArrayItem: FormGroup) {
		this.voucherAdded = false;
		formArrayItem.get('viewMode').setValue(false);
	}

	showVoucherDetail(formArrayItem: FormGroup) {
		formArrayItem.get('showDetail').setValue(!formArrayItem.get('showDetail').value);
	}

	get montoTotalEsperado(): number {
		const monto = Number(this.totalAmountPaid) || 0;
		const envio = Number(this.documentShippingCost) || 0;
		return monto + envio;
	}
}
