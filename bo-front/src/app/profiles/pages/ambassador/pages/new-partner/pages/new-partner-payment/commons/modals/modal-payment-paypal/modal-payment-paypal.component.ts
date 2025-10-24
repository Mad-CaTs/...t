import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { IPayPalConfig, NgxPayPalModule } from 'ngx-paypal';
import { environment } from '@environments/environment';
import { ISelect } from '@shared/interfaces/forms-control';
import { SelectComponent } from '@shared/components/form-control/select/select.component';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PaypalBankPresenter } from './modal-payment-paypal.presenter';
import { tap } from 'rxjs';
import { ModalComponent } from '@shared/components/modal/modal.component';

@Component({
	selector: 'app-modal-payment-paypal',
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		MatIconModule,
		ModalComponent,
		NgxPayPalModule,
		SelectComponent
	],
	templateUrl: './modal-payment-paypal.component.html',
	styleUrls: [],
	providers: [PaypalBankPresenter]
})
export class ModalPaymentPaypalComponent implements OnInit {
	optCurrency: ISelect[] = [{ value: 1, content: 'Dolares' }];

	payPalConfig: IPayPalConfig;
	showCancel: boolean;
	showError: boolean;
	amountToPay: number;
	currency: string;
	comision: number;
	tasa: number = 0;
	private defaultCurrencyId = 1;

	constructor(
		public ref: DynamicDialogRef,
		public paypalBankPresenter: PaypalBankPresenter,
		public config: DynamicDialogConfig
	) {
		this.initConfig();
		this.changeCurrency();
	}

	ngOnInit(): void {
		this.paypalBankPresenter.paypalForm.get('typeCurrency').setValue(this.defaultCurrencyId);
	}

	private initConfig(): void {
		this.paypalBankPresenter.paypalForm.get('paymentSubTypeId').setValue(this.inputData.idPaymentSubType);

		this.payPalConfig = {
			currency: this.currency,
			clientId: environment.TOKEN_PAYPAL,
			createOrderOnClient: () =>
				</* ICreateOrderRequest */ any>{
					intent: 'CAPTURE',
					purchase_units: [
						{
							description: this.inputData.description,
							amount: {
								currency_code: this.currency,
								value: this.amountToPay
							}
						}
					]
				},
			onClientAuthorization: (data) => {
				const value = this.paypalBankPresenter.paypalForm.value;

				this.ref.close({
					...value,
					operationNumber: data.id,
					montoLegalizacionUSD: this.inputData.montoLegalizacionUSD,
					apostillaUSD: this.inputData.montoApostilladoExtraUSD || 0,
					amount: this.inputData.amount
				});
			},
			onCancel: (data, actions) => {
				this.showCancel = true;
			},
			onError: (err) => {
				console.log('OnError', err);
				this.showError = true;
			},
			onClick: (data, actions) => {
				console.log('onClick', data, actions);
				this.resetStatus();
			}
		};
	}

	resetStatus() {
		console.log('resetStatus');
	}

	closeModal() {
		this.ref.close();
	}

	public get inputData() {
		return this.config.data;
	}

	private changeCurrency() {
		this.paypalBankPresenter.paypalForm
			.get('typeCurrency')
			.valueChanges.pipe(
				tap((currency) => {
					this.currency = 'USD';
					this.comision = this.inputData.commissionDollars;
					let temp =
						this.inputData.commissionDollars +
						this.inputData.amount +
						(this.inputData.fromLegalization && this.inputData.payTypeSelected !== 1
							? this.inputData.montoLegalizacionUSD || 0
							: 0) +
						(this.inputData.montoApostilladoExtraUSD || 0);

					let total = temp / (1 - this.inputData.ratePercentage / 100);
					total = Math.round((total + Number.EPSILON) * 100) / 100;
					this.amountToPay = total;
					let tasa = (total * this.inputData.ratePercentage) / 100;
					this.amountToPay = total;
					this.tasa = Math.round((tasa + Number.EPSILON) * 100) / 100;
				})
			)
			.subscribe();
	}
}
