import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { FileComponent } from '@shared/components/form-control/file/file.component';
import { InputComponent } from '@shared/components/form-control/input/input.component';
import { SelectComponent } from '@shared/components/form-control/select/select.component';
import { DialogModule } from 'primeng/dialog';
import { PaymentBankPresenter } from './modal-payment-bank.presenter';
import { CurrencyType } from 'src/app/profiles/commons/enums';
import { numberFormat } from '@shared/utils';
import { ISelect } from '@shared/interfaces/forms-control';
import { DecimalPipe } from '@angular/common';
import { TextAreaComponent } from '@shared/components/form-control/text-area/text-area.component';
import RadiosComponent from '@shared/components/form-control/radios/radios.component';
import { ModalPartnerPaymentService } from '../../../servicio/new-partner-payment.service';

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
	styleUrls: ['./modal-payment-bank.component.css']
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
	private isInitialLoad: boolean = true;

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
		console.log("methodSelectedmodal",this.methodSelected)
				console.log("datavauchermodal",this.data)

		this.initCurrencySelection();
		if (this.data.voucherToEdit) {
			this.paymentForm.patchValue(this.data.voucherToEdit);
			const form = (this.paymentForm.get('listaVouches') as FormArray).at(0);
			form.patchValue({
				...this.data.voucherToEdit,
				viewMode: false
			});
		}

		if (this.data?.isFromStepTimelineobs) {
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
		let currencyIdToUse: number;
		if (this.data?.isFromStepTimelineobs && this.data?.voucherToEdit?.idPaymentCoinCurrency) {
			currencyIdToUse = this.data.voucherToEdit.idPaymentCoinCurrency;
		} else if (this.data.payTypeSelected === 3) {
			currencyIdToUse = this.paymentBankPresenter.defaultCurrencyId;
		} else {
			currencyIdToUse =
				this.data?.voucherToEdit?.currency ??
				this.data?.idCurrency ??
				this.paymentBankPresenter.defaultCurrencyId;
		}
		const selectedCurrency =
			this.data.operationCurrency.find((c) => c.value === currencyIdToUse) ||
			this.data.operationCurrency[0];
		this.changeSelectionCurrency(selectedCurrency);
	}

	/* 
	 	private initCurrencySelection(): void {
 		this.baseAmount = this.data.totalAmountPaid;
 
		const currencyIdToUse =
			this.data.payTypeSelected === 3
				? this.paymentBankPresenter.defaultCurrencyId
				: this.data?.voucherToEdit?.currency ??
				  this.data?.idCurrency ??
				  this.paymentBankPresenter.defaultCurrencyId;

		const selectedCurrency =
			this.data.operationCurrency.find((c) => c.value === currencyIdToUse) ||
			this.data.operationCurrency[0];

		this.changeSelectionCurrency(selectedCurrency);
	}  */

	precargarListVoucherDesdeStep(): void {
		const formArray = this.paymentBankPresenter.paymentForm.get('listaVouches') as FormArray;
		formArray.clear();

		const voucherPrellenado = this.fb.group({
			viewMode: [false],
			showDetail: [false],
			methodSubTipoPagoId:  [this.data?.voucherToEdit?.idMethodPaymentSubType] ,
			operationNumber: [this.data?.voucherToEdit?.operationNumber],
			note: [this.data?.voucherToEdit?.note],
			totalAmount: [this.data.totalAmountPaid || 0],
			imagen: [null],
			comision: [this.data?.voucherToEdit?.commissionPaymentSubType],
			currency: [this.data.operationCurrency[0].value],
			currencyDescription: [this.data.operationCurrency[0].content]
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
		if (this.data?.isFromStepTimelineobs) {
			this.onAddVouchers.emit({
				...this.paymentForm.value,
				montoTotalEsperado: this.montoTotalEsperado
			});
			return;
		}
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
				montoTotalEsperado: this.montoTotalEsperado,
				amountLegalization:
					Number(this.rawTotalAmountPaid) +
					Number(this.apostillaConvertida) +
					Number(this.documentShippingCost)
			};

			this.onAddVouchers.emit(voucherData);
			this.paymentBankPresenter.addForm();
		} else {
			alert('Debe guardar todos los Váuchers antes de Agregar');
		}
	}

	changeSelectionCurrency(data) {
		this.paymentForm.get('currency').setValue(data.value);
		this.changeCurrency(data.value, !this.isInitialLoad);
		this.paymentForm.get('currencyDescription').setValue(data.content);
		this.isInitialLoad = false;
	}

	public changeCurrency(value: CurrencyType, applyConversion: boolean = true) {
		this.selectedCurrency = this.getCurrencySymbol(value);

		if (applyConversion) {
			this.rawTotalAmountPaid = this.calculateRawTotal(value);
			this.totalAmountPaid = numberFormat(this.rawTotalAmountPaid);
			this.documentShippingCost = this.calculateShipping(value);
			this.apostillaConvertida = this.calculateApostillado(value);
			this.updateCommissionFields(value);
		} else {
			this.rawTotalAmountPaid = this.baseAmount;
			this.totalAmountPaid = numberFormat(this.baseAmount);
			this.documentShippingCost = this.calculateShipping(value);
			this.apostillaConvertida = this.calculateApostillado(value);
			this.updateCommissionFields(value);
		}
	}

	/* 	changeSelectionCurrency(data) {
		this.paymentForm.get('currency').setValue(data.value);
		this.changeCurrency(data.value);
		this.paymentForm.get('currencyDescription').setValue(data.content);
	}

	public changeCurrency(value: CurrencyType) {
		this.selectedCurrency = this.getCurrencySymbol(value);
		this.rawTotalAmountPaid = this.calculateRawTotal(value);
		this.totalAmountPaid = numberFormat(this.rawTotalAmountPaid);
		this.documentShippingCost = this.calculateShipping(value);
		this.apostillaConvertida = this.calculateApostillado(value);
		this.updateCommissionFields(value);
	} */

	private getCurrencySymbol(value: CurrencyType): string {
		return value === CurrencyType.SOLES ? 'S/' : value === CurrencyType.DOLARES ? '$' : 'COL';
	}

	private calculateRawTotal(value: CurrencyType): number {
		if (!this.data.fromLegalization || this.data.payTypeSelected === 3) {
			return value === CurrencyType.PESOSCOLOMBIANOS
				? this.baseAmount * 4802.97
				: value === CurrencyType.SOLES
				? this.baseAmount * this.data.exchangeType
				: this.baseAmount;
		}

		if (value === CurrencyType.PESOSCOLOMBIANOS) {
			return (this.baseAmount / this.data.exchangeType) * 4802.97;
		}
		if (value === CurrencyType.DOLARES) {
			return this.baseAmount / this.data.exchangeType;
		}
		return this.baseAmount;
	}

	private calculateShipping(value: CurrencyType): string | null {
		const cost = Number(this.data?.shippingCost || 0);
		if (!this.data.fromLegalization || this.data.payTypeSelected === 1) return null;

		if (value === CurrencyType.PESOSCOLOMBIANOS) {
			return numberFormat((cost * 4802.97) / this.data.exchangeType);
		}
		if (value === CurrencyType.SOLES && this.data.payTypeSelected === 3) {
			return numberFormat(cost * this.data.exchangeType);
		}
		if (value === CurrencyType.DOLARES && this.data.payTypeSelected !== 3) {
			return numberFormat(cost / this.data.exchangeType);
		}
		return numberFormat(cost);
	}
	private calculateApostillado(value: CurrencyType): number {
		const monto = Number(this.data?.apostilladoMontoUSD || 0);
		if (value === CurrencyType.PESOSCOLOMBIANOS) {
			return Number(
				(this.data.fromLegalization && this.data.payTypeSelected !== 3
					? (monto / this.data.exchangeType) * 4802.97
					: monto * 4802.97
				).toFixed(2)
			);
		}
		if (value === CurrencyType.SOLES && this.data.fromLegalization && this.data.payTypeSelected === 3) {
			return Number((monto * this.data.exchangeType).toFixed(2));
		}
		return Number(monto.toFixed(2));
	}

	private updateCommissionFields(value: CurrencyType) {
		const field = value === CurrencyType.SOLES ? 'comisionSoles' : 'comisionDolares';
		this.getListVouchersForm.controls.forEach((f) => f.get('comision')?.setValue(f.get(field)?.value));
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

		return Number((monto + envio + apostilla + comision).toFixed(2));
	}
}
