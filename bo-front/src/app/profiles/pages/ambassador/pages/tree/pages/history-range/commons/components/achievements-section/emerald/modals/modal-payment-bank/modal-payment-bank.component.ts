import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { FileComponent } from '@shared/components/form-control/file/file.component';
import { InputComponent } from '@shared/components/form-control/input/input.component';
import { SelectComponent } from '@shared/components/form-control/select/select.component';
import { DialogModule } from 'primeng/dialog';
import { PaymentBankPresenter } from '../../../../../../../../../../pages/new-partner/pages/new-partner-payment/commons/modals/modal-payment-bank/modal-payment-bank.presenter';
import { CurrencyType } from 'src/app/profiles/commons/enums';
import { numberFormat } from '@shared/utils';
import { ISelect } from '@shared/interfaces/forms-control';
import { DecimalPipe } from '@angular/common';
import { TextAreaComponent } from '@shared/components/form-control/text-area/text-area.component';
import RadiosComponent from '@shared/components/form-control/radios/radios.component';
import { ModalPartnerPaymentService } from '../../../../../../../../../../pages/new-partner/pages/new-partner-payment/servicio/new-partner-payment.service';

@Component({
	selector: 'app-modal-payment-bank-component',
	templateUrl: './modal-payment-bank.component.html',
	standalone: true,
	imports: [
		SelectComponent,
		InputComponent,
		FileComponent,
		CommonModule,
		ReactiveFormsModule,
		MatIconModule,
		DialogModule,
		TextAreaComponent,
		RadiosComponent
	],
	providers: [PaymentBankPresenter, DecimalPipe],
	styleUrls: ['./modal-payment-bank.component.scss']
})
export class ModalPaymentBankComponent implements OnInit {
	@Input() data;
	@Input() pkgDetail;
	@Input() bussinesAccounts;
	@Input() companyName;
	@Input() methodSelected: ISelect;
	@Output() onAddVouchers = new EventEmitter<any>();
	@Output() onCloseModal = new EventEmitter<any>();
	totalAmountPaid: string;
	public optBanks: ISelect[];
	documentShippingCost: string;
	baseAmount: number;
	public topBanksToShow = [];
	@Output() bancoCambiado = new EventEmitter<number>();
	onChangeNationality: any;
	selectedCurrency: any;
	voucherAdded: boolean = false;
	apostillaConvertida: number = 0;
	rawTotalAmountPaid: number = 0;

	constructor(
		public paymentBankPresenter: PaymentBankPresenter,
		private modalPartnerPaymentService: ModalPartnerPaymentService,
		private fb: FormBuilder,
		private cdr: ChangeDetectorRef
	) {
		this.paymentBankPresenter.bankSelected.subscribe((bankId) => {
			if (this.data.fromLegalization) {
				this.onBankChange(bankId);
			}
		});
	}

	ngOnInit(): void {
		this.initCurrencySelection();

		if (this.data.voucherToEdit) {
			this.paymentForm.patchValue(this.data.voucherToEdit);
			const form = (this.paymentForm.get('listaVouches') as FormArray).at(0);
			form.patchValue({
				...this.data.voucherToEdit,
				viewMode: false
			});
		}

		if (this.data?.isFromStepTimeline) {
			this.precargarVoucherDesdeStep();
			return;
		}
	}

	onRadioChange(idSeleccionado: number) {
		const metodo = this.optBanks.find((b) => b.value === idSeleccionado);
		this.methodSelected = metodo;
	}

	onBankChange(bankId: number) {
		this.modalPartnerPaymentService.getBankAccountsForPaymentType(bankId).subscribe((accounts) => {
			this.bussinesAccounts = accounts;
		});
	}

	private initCurrencySelection(): void {
		this.baseAmount = this.data.totalAmountPaid;
		const currencyIdToUse =
			this.data?.voucherToEdit?.currency ??
			this.data?.idCurrency ??
			this.paymentBankPresenter.defaultCurrencyId;
		const selectedCurrency =
			this.data.operationCurrency.find((c) => c.value === currencyIdToUse) ||
			this.data.operationCurrency[0];

		this.changeSelectionCurrency(selectedCurrency);
	}

	precargarListVoucherDesdeStep(): void {
		const formArray = this.paymentBankPresenter.paymentForm.get('listaVouches') as FormArray;
		formArray.clear();

		const voucherPrellenado = this.fb.group({
			operationDescription: ['Transferencia desde step'],
			viewMode: [false],
			showDetail: [false],
			methodSubTipoPagoId: [1],
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
	}

	precargarVoucherDesdeStep(): void {
		this.filtrarTopBancos();

		if (this.data?.methodSelected?.idPaymentType) {
			setTimeout(() => {
				this.paymentForm.get('bancoSeleccionado')?.setValue(this.data.methodSelected.idPaymentType);
				this.cdr.detectChanges();
			}, 0);
		}
		this.precargarListVoucherDesdeStep();
	}

	filtrarTopBancos(): void {
		if (this.data?.optBanksAll?.length) {
			this.optBanks = this.data.optBanksAll
				.filter((bank) => bank.description.toUpperCase() !== 'PAYPAL')
				.slice(0, 3)
				.map((bank) => {
					const bancoMapeado = {
						content: bank.description,
						value: Number(bank.idPaymentType),
						...bank
					};
					return bancoMapeado;
				});
			if (this.data?.methodSelected?.idPaymentType) {
				this.paymentForm.get('bancoSeleccionado')?.setValue(this.data.methodSelected.idPaymentType);
			}
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
		this.paymentBankPresenter.addForm();
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
		if (!this.paymentBankPresenter.isThereEditing) {
			const voucherData = {
				...this.paymentForm.value,
				exchangeType: this.data?.exchangeType,
				documentShippingCost: this.documentShippingCost,
				apostilla: this.apostillaConvertida,
				montoTotalEsperado: this.montoTotalEsperado
			};

			this.onAddVouchers.emit(voucherData);
			this.paymentBankPresenter.addForm();
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
		const fixedSoles = Number(this.data?.shippingCost) || 0;
		const apostillaOriginal = Number(this.data?.apostilladoMontoPEN) || 0;
		switch (value) {
			case CurrencyType.DOLARES:
				this.selectedCurrency = '$';

				this.rawTotalAmountPaid = this.data.fromLegalization
					? this.baseAmount / this.data.exchangeType
					: this.baseAmount;
				this.totalAmountPaid = numberFormat(this.rawTotalAmountPaid);

				this.documentShippingCost =
					this.data.fromLegalization && this.data.payTypeSelected !== 1
						? numberFormat(fixedSoles / this.data.exchangeType)
						: null;

				this.getListVouchersForm.controls.forEach((form) => {
					form.get('comision').setValue(form.get('comisionDolares').value);
				});

				this.apostillaConvertida = this.data.fromLegalization
					? apostillaOriginal / this.data.exchangeType
					: apostillaOriginal;

				break;

			case CurrencyType.SOLES:
				this.selectedCurrency = 'S/';

				this.rawTotalAmountPaid = this.data.fromLegalization
					? this.baseAmount
					: this.baseAmount * this.data.exchangeType;
				this.totalAmountPaid = numberFormat(this.rawTotalAmountPaid);

				this.documentShippingCost =
					this.data.fromLegalization && this.data.payTypeSelected !== 1
						? numberFormat(fixedSoles)
						: null;

				this.getListVouchersForm.controls.forEach((form) => {
					form.get('comision').setValue(form.get('comisionSoles').value);
				});

				this.apostillaConvertida = apostillaOriginal;
				break;

			case CurrencyType.PESOSCOLOMBIANOS:
				const tasaPesos = 4802.97;
				this.selectedCurrency = 'COL';

				this.rawTotalAmountPaid = this.data.fromLegalization
					? (this.baseAmount / this.data.exchangeType) * tasaPesos
					: this.baseAmount * tasaPesos;
				this.totalAmountPaid = numberFormat(this.rawTotalAmountPaid);

				this.documentShippingCost =
					this.data.fromLegalization && this.data.payTypeSelected !== 1
						? numberFormat((fixedSoles * tasaPesos) / this.data.exchangeType)
						: null;

				this.getListVouchersForm.controls.forEach((form) => {
					form.get('comision').setValue(form.get('comisionDolares').value);
				});

				this.apostillaConvertida = this.data.fromLegalization
					? (apostillaOriginal / this.data.exchangeType) * tasaPesos
					: apostillaOriginal * tasaPesos;
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

	get paymentForm() {
		return this.paymentBankPresenter.paymentForm;
	}

	editForm(formArrayItem: FormGroup) {
		this.voucherAdded = false;
		formArrayItem.get('viewMode').setValue(false);
	}

	showVoucherDetail(formArrayItem: FormGroup) {
		formArrayItem.get('showDetail').setValue(!formArrayItem.get('showDetail').value);
	}

	get totalComision(): number {
		const lista = this.paymentForm.get('listaVouches') as FormArray;
		if (!lista) return 0;

		return lista.controls.reduce((acc, ctrl) => {
			const valor = Number(ctrl.get('comision')?.value);
			return acc + (isNaN(valor) ? 0 : valor);
		}, 0);
	}

	get montoTotalEsperado(): number {
		const monto = this.rawTotalAmountPaid || 0;
		const envio = Number(this.documentShippingCost) || 0;
		const apostilla = Number(this.apostillaConvertida) || 0;
		const comision = this.totalComision;

		return monto + envio + apostilla + comision;
	}
}
