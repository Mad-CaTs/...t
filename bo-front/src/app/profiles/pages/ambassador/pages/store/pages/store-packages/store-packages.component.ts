import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SelectComponent } from '@shared/components/form-control/select/select.component';
import { CommonModule } from '@angular/common';
import { Section } from './commons/enums/section.enum';
import { NewPartnerSelectPackageComponent } from '../../../new-partner/pages/new-partner-select-package/new-partner-select-package.component';
import { SelectedPackageService } from '../../../new-partner/commons/services/package-detail.service';
import { INewPartnerStep3Data } from '../../../../commons/interfaces/new-partner.interfaces';
import { NewPartnerPaymentComponent } from '../../../new-partner/pages/new-partner-payment/new-partner-payment.component';
import { NewPartnerFormPresenter } from '../../../new-partner/new-partner.presenter';
import { PaymentType } from '../../../new-partner/pages/new-partner-payment/commons/enums';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';
import { numberFormat } from '@shared/utils';
import { isEqualToTotalToPaid, normalizeAmount } from '../../../new-partner/commons/constants';
import { IPaypalData } from '../../../new-partner/commons/interfaces/new-partner.interface';
import { ModalSuccessComponent } from 'src/app/profiles/commons/modals/modal-success/modal-success.component';
import { catchError, finalize, of, tap } from 'rxjs';
import { DialogService } from 'primeng/dynamicdialog';
import { getBuyPackagePayload } from '../../commons/constants';
import { Router } from '@angular/router';
import { BuyPackageService } from '../../services/buy-package.service';
import { Location } from '@angular/common';

@Component({
	selector: 'app-store-packages',
	standalone: true,
	providers: [NewPartnerFormPresenter, BuyPackageService, DialogService],
	imports: [CommonModule, NewPartnerSelectPackageComponent, NewPartnerPaymentComponent],
	templateUrl: './store-packages.component.html',
	styleUrl: './store-packages.component.scss'
})
export default class StorePackagesComponent implements OnInit {
	form: FormGroup;
	currentSection: Section = Section.FIRST;
	Section = Section;
	public packages: any[] = [];
	private paypalData: IPaypalData;
	@Input() residenceContry;
	@Input() totalAmountPaid: number;
	@Output() submit = new EventEmitter<INewPartnerStep3Data>();
	public paymentTypeListaFiltered: any;
	amountPaid: number = 0;
	@Input() paymentTypeList: PaymentType[];
	public isPackagePaymentContext: boolean = true;
	public isLoading: boolean;
	stateUser: number = this.userInfoService.userInfo.idState;
	public disabledUser: boolean = this.userInfoService.disabled;

	constructor(
		private fb: FormBuilder,
		private selectedPackageService: SelectedPackageService,
		public presenter: NewPartnerFormPresenter,
		private userInfoService: UserInfoService,
		private dialogService: DialogService,
		private router: Router,
		private buyPackageService: BuyPackageService,
		private location: Location
	) { }

	ngOnInit(): void {
		this.getUserInfoAndSetResidenceCountry();
	}

	goToNextSection(): void {
		this.currentSection = Section.NEXT;
	}

	advanceToNextSection(): void {
		this.currentSection = Section.NEXT;
	}

	goBack() {
		const previousLocation = this.location.back();
	}

	goToPreviousSection(): void {
		if (this.currentSection === Section.NEXT) {
			this.currentSection = Section.FIRST;
		}
	}

	getUserInfoAndSetResidenceCountry(): void {
		const userInfo = this.userInfoService.userInfo;
		this.residenceContry = userInfo.idResidenceCountry;
	}

	onNavigateStep() {
		this.goToPreviousSection();
	}

	onPaypalData(paypalData: IPaypalData) {
		this.paypalData = paypalData;
	}

	onSubmitPaymentStep(dataToSave) {
		const listQuotes = [];
		const value = this.presenter.multiStepForm.getRawValue();
		const { id } = this.userInfoService.userInfo;
		const isSpecialFractional =
			this.selectedPackageService.selectedPackageDetail?.isSpecialFractional ||
			this.selectedPackageService.selectedPackageDetail?.numberInitialQuote > 1;

		let totalComisionInDollars = 0;

		const generalVouchers = dataToSave.listVochers
			.filter((voucher) => voucher.paymentMethod !== 'wallet')
			.map((voucher) => {
				let comisionInDollars = 0;
				if (voucher.currency === 2) {
					comisionInDollars = voucher.comisionSoles / dataToSave.exchangeRate;
				} else if (voucher.currency === 1) {
					comisionInDollars = voucher.comisionDolares;
				}

				comisionInDollars = parseFloat(comisionInDollars.toFixed(2));
				totalComisionInDollars += comisionInDollars;

				return {
					idMethodPaymentSubType: voucher.methodSubTipoPagoId,
					operationNumber: voucher.operationNumber,
					note: voucher.note,
					idPaymentCoinCurrency: voucher.currency,
					comision: isNaN(Number(voucher.comision)) ? 0 : Number(voucher.comision),
					totalAmount: normalizeAmount(voucher.totalAmount).toFixed(2),
					imagenBase64: voucher.imagen ? voucher.imagen.base64 : null
				};
			});

		const walletTransactionVoucher = dataToSave.listVochers.find(
			(voucher) => voucher.paymentMethod === 'wallet'
		);
		const walletTransaction = walletTransactionVoucher
			? { amount: parseFloat(walletTransactionVoucher.totalAmount) }
			: undefined;

		const totalComisionDolares = generalVouchers.reduce(
			(acc, voucher) => acc + (voucher.comision || 0),
			0
		);
		const totalComisionFinal = dataToSave.totalComision + totalComisionDolares;

		if (
			generalVouchers.length === 0 &&
			!this.paypalData &&
			!value.paymentData.isPayLater &&
			!walletTransaction
		) {
			alert('Debe registrar un pago');
			return;
		}

		if (
			!isEqualToTotalToPaid(
				generalVouchers,
				walletTransaction?.amount,
				(isSpecialFractional ? value.paymentData.amountPaid : value.paymentData.amountPaid) +
				totalComisionInDollars,
				dataToSave.exchangeRate
			) &&
			!this.paypalData
		) {
			alert('El monto ingresado no coincide con el total a pagar');
			return;
		}

		if (value.paymentData.amount1 && value.paymentData.amount1 > 0)
			listQuotes.push(numberFormat(value.paymentData.amount1));
		if (value.paymentData.amount2 && value.paymentData.amount2 > 0)
			listQuotes.push(numberFormat(value.paymentData.amount2));
		if (value.paymentData.amount3 && value.paymentData.amount3 > 0)
			listQuotes.push(numberFormat(value.paymentData.amount3));

		const payload = getBuyPackagePayload({
			...dataToSave,
			listVochers: generalVouchers,
			walletTransaction,
			...value,
			idPackageDetailPayment: this.selectedPackageService.selectedPackageDetail?.idPackageDetail,
			id,
			isEditedInitial: isSpecialFractional,
			listQuotes,
			paypalDTO: this.paypalData
		});

		this.isLoading = true;
		this.buyPackageService
			.buyPackage(payload)
			.pipe(
				tap(() => {
					this.dialogService
						.open(ModalSuccessComponent, {
							header: '',
							data: {
								text: 'Tu pago fue registrado con éxito.',
								title: 'Éxito!',
								icon: 'assets/icons/Inclub.png'
							}
						})
						.onClose.pipe(
							tap(() => {
								this.selectedPackageService.setSelectedPackageData(null);
								this.router.navigate(['/profile/ambassador/dashboard/primary-profile']);
							})
						)
						.subscribe();
				}),
				finalize(() => (this.isLoading = false)),
				catchError((error) => {
					alert('Ups! No se pudo procesar el pago. Inténtelo nuevamente');
					return of(null);
				})
			)
			.subscribe();
	}
}
