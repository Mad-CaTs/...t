import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { SelectComponent } from '@shared/components/form-control/select/select.component';
import { DynamicDialogConfig, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DialogModule } from 'primeng/dialog';
import { PayFeePresenter } from './modal-pay-fee.presenter';
import { InputComponent } from '@shared/components/form-control/input/input.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { finalize, tap } from 'rxjs';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';
import { ModalPaymentService } from 'src/app/profiles/pages/ambassador/pages/new-partner/pages/new-partner-payment/commons/sevices/modal-payment.service';
import { WalletService } from 'src/app/profiles/pages/ambassador/pages/wallet/commons/services/wallet.service';

@Component({
	selector: 'modal-prodts-detail',
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		MatIconModule,
		SelectComponent,
		DialogModule,
		DynamicDialogModule,
		InputComponent,
		InputNumberModule
	],
	templateUrl: './modal-pay-fee.html',
	styleUrls: ['./modal-pay-fee.css'],

	providers: [PayFeePresenter]
})
export class ModalPayFeeComponent implements OnInit {
	@Input() data: any;
	@Output() onCloseModal = new EventEmitter<any>();
	totalAmountPaid: string;
	walletData: any;
	selectedCurrency: any;
	paymentForm: FormGroup;
	@Input() quoteDetail: any;
	totalAmount: string;
	amountToPay: number;
	public exchangeType: number;
	@Output() formSubmitted = new EventEmitter<any>();
	isLoading: boolean = false;
	operationCurrency: any;
	payMultiple: boolean;
	defaultCurrency: any;
  public isPagarLater: boolean;
  public userIdisPagarLater: string;

	constructor(
		public ref: DynamicDialogRef,
		public config: DynamicDialogConfig,
		private payFeePresenter: PayFeePresenter,
		private walletService: WalletService,
		private userInfoService: UserInfoService,
		private modalPaymentService: ModalPaymentService
	) {
		this.paymentForm = this.payFeePresenter.paymentForm;
		this.data = this.config.data;
	}

	ngOnInit(): void {
		this.initData();
	}

	initData() {
		this.operationCurrency = /* this.config. */this.data.operationCurrency;
		this.totalAmountPaid = /* this.config. */this.data.totalAmountPaid || 0;
		this.payMultiple = this.data.payMultiple || true;
    this.isPagarLater = this.data.isPagarLater;  
    
    this.userIdisPagarLater = this.data.userId;
		this.getTC(), this.setDefaultCurrency();
		this.getWalletData();
		if (this.data.voucherToEdit) {
			this.paymentForm.patchValue(this.data.voucherToEdit);
		}
	}

	private getTC() {
		this.modalPaymentService.getTipoCambio().subscribe((exchangeType) => {
			this.exchangeType = exchangeType.sale;
		});
	}

	/* private getWalletData(): void {
		this.isLoading = true;
		const userInfo = this.userInfoService.userInfo;
		const userId = this.isPagarLater? this.userIdisPagarLater: userInfo.id;
    
		this.walletService
			.getWalletById(userId)
			.pipe(
				tap((data) => {
					this.walletData = data;
				}),

				finalize(() => (this.isLoading = false))
			)
			.subscribe();
	} */

	private getWalletData(): void {
		this.isLoading = true;
		const userInfo = this.userInfoService.userInfo;
		const userId = this.isPagarLater ? this.userIdisPagarLater : userInfo.id;
	
		const walletObservable = this.isPagarLater
			? this.walletService.getWalletPayLaterById(userId) 
			: this.walletService.getWalletById(userId); 
	
		walletObservable
			.pipe(
				tap((data) => {
					this.walletData = data;
				}),
				finalize(() => (this.isLoading = false))
			)
			.subscribe();
	}
	

	setDefaultCurrency(): void {
		if (this.data && this.data.operationCurrency) {
			this.defaultCurrency = this.data.operationCurrency.find(
				(operation) => operation.value === this.payFeePresenter.defaultCurrencyId
			);

			if (this.defaultCurrency) {
				this.changeSelectionCurrency(this.defaultCurrency);
			}
		}
	}

	closeModal() {
		this.ref.close();
	}

	changeSelectionCurrency(data: any): void {
		if (data) {
			this.paymentForm.get('currencyDescription')?.setValue(data.content);
		}
	}

	onAmountChange(event: any): void {
		this.amountToPay = event.value;
		if (this.walletData && this.amountToPay > this.walletData.availableBalance) {
			alert(
				`El monto ingresado ($${this.amountToPay}) excede el saldo disponible ($${this.walletData.availableBalance}).`
			);
		}
	}

	onSubmit(): void {
		if (this.paymentForm.valid) {
			const formValue = this.paymentForm.value;
			const submitData = {
				...formValue,
				operationCurrency: this.paymentForm.get('currency')?.value,
				currencyDescription: this.operationCurrency[0]?.content,
				totalAmount: this.paymentForm.get('totalAmount')?.value,
				paymentMethod: 'wallet'
			};
			this.ref.close({ listaVouches: [submitData] });
		}
	}
}
