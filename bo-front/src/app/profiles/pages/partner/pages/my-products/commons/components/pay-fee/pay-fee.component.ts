import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { SelectComponent } from '@shared/components/form-control/select/select.component';
import { catchError, combineLatest, finalize, map, of, tap, timeout } from 'rxjs';
import { ModalPartnerPaymentService } from 'src/app/profiles/pages/ambassador/pages/new-partner/pages/new-partner-payment/servicio/new-partner-payment.service';
import { ModalPaymentBankContainer } from 'src/app/profiles/pages/ambassador/pages/new-partner/pages/new-partner-payment/commons/modals/modal-payment-bank/modal-payment-bank.container';
import { ModalPaymentService } from 'src/app/profiles/pages/ambassador/pages/new-partner/pages/new-partner-payment/commons/sevices/modal-payment.service';
import { ISelect } from '@shared/interfaces/forms-control';
import {
	GetCurrenciesByCountry,
	getPaymentListByContry
} from 'src/app/profiles/pages/ambassador/pages/new-partner/pages/new-partner-payment/commons/contants';
import {
	CountryType,
	PaymentType
} from 'src/app/profiles/pages/ambassador/pages/new-partner/pages/new-partner-payment/commons/enums';
import { GetListVouchersToSave } from 'src/app/profiles/pages/ambassador/pages/new-partner/pages/new-partner-payment/commons/contants/list-vouchers-to-save';
import { ProductService } from '../../services/product-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DialogService, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { NewPartnerFormPresenter } from 'src/app/profiles/pages/ambassador/pages/new-partner/new-partner.presenter';
import { TableModule } from 'primeng/table';
import { ImagenData } from '@shared/constants';
import { ModalPaymentPaypalComponent } from 'src/app/profiles/pages/ambassador/pages/new-partner/pages/new-partner-payment/commons/modals/modal-payment-paypal/modal-payment-paypal.component';
import { IPaypalData } from 'src/app/profiles/pages/ambassador/pages/new-partner/commons/interfaces/new-partner.interface';
import { Location } from '@angular/common';
import { DataSharingService } from '../../services/data-sharing.service';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';
import { ModalSuccessComponent } from 'src/app/profiles/commons/modals/modal-success/modal-success.component';
import { ModalPayFeeComponent } from '../../modals/modal-pay-fee/modal-pay-fee';
import { CurrencyType } from 'src/app/profiles/commons/enums';
import { ModalAlertComponent } from 'src/app/profiles/commons/modals/modal-alert/modal-alert.component';
import { InputNumberModule } from 'primeng/inputnumber';
import {
	isEqualToTotalToPaid,
	normalizeAmount
} from 'src/app/profiles/pages/ambassador/pages/new-partner/commons/constants';
import { DataSchedules, GracePeriod, QuoteDetail } from '../../interfaces/pay-fee.interface';
import { ModalGracePeriodComponent } from '../../modals/modal-grace-period/modal-grace-period.component';
import { GracePeriodService } from '../../services/grace-period.service';
import { VariableSharingService } from '../../services/variable-sharing.service';
import { SponsorService } from '../../../pages/product/commons/services/sponsor.service';

@Component({
	selector: 'app-pay-fee',
	templateUrl: './pay-fee.component.html',
	styleUrls: ['./pay-fee.component.scss'],
	standalone: true,
	imports: [
		ReactiveFormsModule,
		MatIconModule,
		SelectComponent,
		CommonModule,
		TableModule,
		DynamicDialogModule,
		InputNumberModule
	],
	providers: [DialogService]
})
export default class PayFeeComponent implements OnInit {
	form: FormGroup;
	dialogRef: DynamicDialogRef;
	@Input() presenter: NewPartnerFormPresenter;
	product: any;
	methodSelected: any;
	membershipType: any;
	paymentTypes: any[];
	listVochersToShow: any = [];
	voucherToEdit: any;
	indexEdit: number = null;
	listVochersToEdit: any = [];
	listVochersToSave: any = [];
	listMethodPayment: any = [];
	public operationCurrency: any[];
	totalAmountPaid: number;
	public paymentTypeListaFiltered: any;
	residenceCountry: CountryType;
	public exchangeType: number;
	@Output() prevState = new EventEmitter();
	@Input() isLoading: boolean;
	@Output() saveNewUser = new EventEmitter<any /* INewPartnerStep4Data */>();
	/* 	@Output() paypalData = new EventEmitter<IPaypalData>();
	 */ diablePaymentMethods = false;
	selectedProduct: any;
	payloadToSave: any = {};
	isLiquidated: boolean = false;
	/* 	payloadToSave: any;
	 */ quoteDetail: any;
	detalleCuota: any;
	@Input() id: number | null = null;
	@Input() idPayment: number | null = null;
	/* idPayment: number; */
	selectedCuota: any = {};
	cuotaDetails: any;
	cuotaId: number;
	showMultiplePaymentDetails: boolean = true;
	showDetails: boolean = false;
	numberOfQuotes: number = 1;
	payMultiple: boolean = false;
	cronograma: DataSchedules[] = [];
	maxCuotas: number;
	productId: number;
	graceDebt: number;
	gracePeriodParameter: any;
	appliedGracePeriodData: any;
	gracePeriodModel: GracePeriod = new GracePeriod();
	isGracePeriodApplied = false;
	walletBlock: boolean = false;
	idsponsor: number | null = null;
	userInfoId: number;
	
	subscriptionCoupon: any = null;
	hasCoupon: boolean = false;
	couponDiscountAmount: number = 0;
	totalWithDiscount: number = 0;
	
	constructor(
		private paymentTypeService: ModalPartnerPaymentService,
		private modalPaymentService: ModalPaymentService,
		private productService: ProductService,
		private router: Router,
		private dialogService: DialogService,
		private location: Location,
		private userInfoService: UserInfoService,
		private route: ActivatedRoute,
		private gracePeriodService: GracePeriodService,
		private variableSharingService: VariableSharingService,
		private sponsorService: SponsorService
	) {
		this.userInfoId = this.userInfoService.userInfo.id;
	}

	ngOnInit(): void {
		this.route.queryParams.subscribe((params) => {
			this.productId = +params['productId'];
		});
		this.variableSharingService.data$.subscribe((data) => {
			this.walletBlock = data.walletBlock;
		});
		this.route.queryParams.subscribe((params) => {
			this.idsponsor = params['idsponsor'];
			console.log('ID del patrocinador recibido en payfee:', this.idsponsor);
		});
		this.getInitData();
	}

	public getInitData() {
		this.loadPaymentTypes();
		this.getCurrencyList();
		this.getTC();
		this.getGracePeriod();
		this.getUserInfoAndSetResidenceCountry();
		this.subscribeToRouteParams();
		this.initializeForm();
		this.verifyLiquidationStatus();
		this.loadSubscriptionCoupon();
	}

	initializeForm(): void {
		this.form = new FormGroup({
			numberQuotes: new FormControl('', [Validators.required, Validators.min(1)]),
			totalAmount: new FormControl({ value: '', disabled: true }, Validators.required)
		});

		this.form.get('numberQuotes')?.valueChanges.subscribe((value) => {
			if (!isNaN(value)) {
				this.updateTotalAmount(Number(value));
			}
		});
	}

	getGracePeriod(): void {
		this.gracePeriodService.getGracePeriodActiveParameter(1).subscribe({
			next: (data) => {
				this.gracePeriodParameter = data;
			},
			error: (error) => {
				alert(error.error.message + '. Reiniciar la página');
			}
		});
		this.gracePeriodService.getGracePeriodsBySuscriptionIdAndStatus(this.productId, 2).subscribe({
			next: (data) => {
				this.graceDebt = data.data.reduce((total, daysUsed) => total + daysUsed.daysUsed, 0);
			},
			error: (error) => {
				alert(error.error.message + '. Reiniciar la página');
			}
		});
	}

	private subscribeToRouteParams(): void {
		combineLatest([this.route.params, this.route.queryParamMap])
			.pipe(
				map(([params, queryParams]) => {
					const idPayment = +params['idPayment'];
					this.payMultiple = queryParams.get('isMultiple') === 'true';
					if (this.payMultiple) {
						  this.productService
							.getCronograma(idPayment)
							.pipe(
								tap((data: DataSchedules[]) => {
									this.cronograma = data.filter((quote) => !quote.payed);

									const quote = data.find((quote) => !quote.payed);

									this.loadQuoteDetail(quote.idPayment);
									this.form.get('numberQuotes').setValue(1);
								}),
								finalize(() => {
									/*                   this.isLoading = false;
									 */
								})
							)
							.subscribe();
					} else {
						this.loadQuoteDetail(idPayment);
					}
				})
			)
			.subscribe();
	}

	private loadQuoteDetail(idPayment: number): void {
		if (isNaN(idPayment)) {
			return;
		}

		this.productService.getQuoteDetail(idPayment).subscribe((data) => {
			this.quoteDetail = data;
			this.methodSelected = this.quoteDetail;
			
			if (this.hasCoupon) {
				this.applyCouponDiscount();
			}
		});
	}


	private loadSubscriptionCoupon(): void {
		if (!this.productId || !this.userInfoId) {
			console.warn('⚠️ No se puede cargar cupón: productId o userInfoId no disponible');
			return;
		}

		console.log('🔍 Buscando cupón activo para suscripción:', {
			idSubscription: this.productId,
			idUser: this.userInfoId
		});

		this.productService.getActiveCouponBySubscription(this.productId, this.userInfoId)
			.subscribe({
				next: (couponData) => {
					if (couponData.found) {
						this.subscriptionCoupon = couponData;
						this.hasCoupon = true;

						console.log('✅ Cupón encontrado y aplicado automáticamente:', {
							code: couponData.code,
							discountPercentage: couponData.discountPercentage,
							idCoupon: couponData.idCoupon
						});

						if (this.quoteDetail) {
							this.applyCouponDiscount();
						}
					} else {
						console.log('ℹ️ No hay cupón activo para esta suscripción');
						this.hasCoupon = false;
					}
				},
				error: (error) => {
					console.error('❌ Error al buscar cupón activo:', error);
					this.hasCoupon = false;
				}
			});
	}


	private applyCouponDiscount(): void {
		if (!this.hasCoupon || !this.quoteDetail) {
			return;
		}

		const baseAmount = (this.quoteDetail.quoteUsd || 0) + (this.quoteDetail.totalOverdue || 0);
		
		this.couponDiscountAmount = (baseAmount * this.subscriptionCoupon.discountPercentage) / 100;
		this.couponDiscountAmount = parseFloat(this.couponDiscountAmount.toFixed(2));
		
		this.totalWithDiscount = baseAmount - this.couponDiscountAmount;
		this.totalWithDiscount = parseFloat(this.totalWithDiscount.toFixed(2));

		console.log('💰 Descuento aplicado:', {
			baseAmount,
			discountPercentage: this.subscriptionCoupon.discountPercentage,
			couponDiscountAmount: this.couponDiscountAmount,
			totalWithDiscount: this.totalWithDiscount
		});

		this.addCouponAsPaymentMethod();
	}


	private addCouponAsPaymentMethod(): void {
		const existingCouponIndex = this.listVochersToSave.findIndex(
			voucher => voucher.paymentMethod === 'coupon'
		);

		const couponVoucher = {
			paymentMethod: 'coupon',
			bankName: 'Cupón de Descuento',
			operationNumber: this.subscriptionCoupon.code,
			operationDescription: `Descuento del ${this.subscriptionCoupon.discountPercentage}%`,
			totalAmount: this.couponDiscountAmount,
			currency: 1,
			idCoupon: this.subscriptionCoupon.idCoupon,
			methodSelected: {
				idPaymentType: 5,
				description: 'CUPÓN'
			}
		};

		if (existingCouponIndex !== -1) {
			this.listVochersToSave[existingCouponIndex] = couponVoucher;
		} else {
			this.listVochersToSave.push(couponVoucher);
		}

		this.listVochersToSave = [...this.listVochersToSave];

		this.addPaymentMethod(5);

		console.log('✅ Cupón agregado como método de pago automático');
	}
	
	updateTotalAmount(numberOfCuotas: number): void {
		const totalAmount = this.cronograma.slice(0, numberOfCuotas).reduce((total, item) => {
			return total + item.total;
		}, 0);

		this.form.get('totalAmount')?.setValue(totalAmount, { emitEvent: false });
	}

	getUserInfoAndSetResidenceCountry(): void {
		const userInfo = this.userInfoService.userInfo;
		this.residenceCountry = userInfo.idResidenceCountry;
	}

	goBack() {
		this.location.back();
	}
	public getForm(form: string) {
		return this.presenter.multiStepForm.controls[form];
	}

	loadPaymentTypes(): void {
		this.isLoading = true;
		this.getUserInfoAndSetResidenceCountry();
		if (this.residenceCountry) {
			this.paymentTypeService.getPaymenttype().subscribe((types) => {
				this.paymentTypeListaFiltered = getPaymentListByContry(
					types,
					this.residenceCountry
				);
				this.isLoading = false;
			});
		}
	}

	onMedioPago(methodSelected): void {
		const numberQuotesControl = this.form.get('numberQuotes');
		if (this.payMultiple && (!numberQuotesControl || !numberQuotesControl.value)) {
			this.methodSelected = null;
			alert('Debe agregar el numero de cuotas a pagar.');
			return;
		}
		this.methodSelected = methodSelected;
		switch (methodSelected.description) {
			case PaymentType.WALLET:
				this.openModalWallet();
				break;
			case PaymentType.BCP:
				this.openPaymentBank();
				break;

			case PaymentType.INTERBANK:
				this.openPaymentBank();
				break;

			case PaymentType.DAVIVIENDA:
				this.openPaymentBank();
				break;

			case PaymentType.OTROS:
				this.openPaymentBank();
				break;

			case PaymentType.PAYPAL:
				this.onPaypal();

				break;

			default:
				this.openPaymentBank();
				break;
		}
	}

	shouldShowImageColumn(): boolean {
		return this.methodSelected.description !== PaymentType.WALLET;
	}

	public openModalWallet(voucher = null): void {
		const dolaresCurrency = this.operationCurrency.find(
			(currency) => currency.value === CurrencyType.DOLARES
		);
		if (!dolaresCurrency) {
			return;
		}

		this.dialogRef = this.dialogService.open(ModalPayFeeComponent, {
			header: 'Mi Wallet',
			width: '35%',
			data: {
				isWallet: true,
				methodSelected: this.methodSelected,
				operationCurrency: [dolaresCurrency],

				totalAmountPaid: this.isGracePeriodApplied
					? this.appliedGracePeriodData?.totalPay
					: this.payMultiple
					? this.totalAmount || 0
					: this.quoteDetail.total || 0,
				voucherToEdit: voucher
			}
		});

		this.dialogRef.onClose.subscribe((data) => {
			if (data) {
				data.currencyDescription = dolaresCurrency.content;
				this.processWalletPayment(data, !!voucher);
			}
		});
	}

	public get totalAmount() {
		return this.form.get('totalAmount')?.value || 0;
	}

	private processWalletPayment(data: any, isEditing: boolean): void {
		if (data) {
			this.addPaymentMethod(4);

			const [voucher] = data.listaVouches;

			if (!data.currencyDescription) {
				const dolaresCurrency = this.operationCurrency.find(
					(currency) => currency.value === CurrencyType.DOLARES
				);
				data.currencyDescription = dolaresCurrency.content;
			}

			const amountToCompare = this.payMultiple
				? this.totalAmount
				: this.isGracePeriodApplied
				? this.appliedGracePeriodData?.totalPay
				: this.quoteDetail.total;

			if (voucher.totalAmount === amountToCompare) {
				this.payloadToSave = {
					walletTransaction: { amount: voucher.totalAmount }
				};
				this.onSubmit(2);
			} else {
				if (this.payloadToSave?.walletTransaction) {
					const currentAmount = this.payloadToSave.walletTransaction.amount;
					let updatedAmount = currentAmount
						? currentAmount + voucher.totalAmount
						: voucher.totalAmount;
					updatedAmount = isEditing ? voucher.totalAmount : updatedAmount;

					this.payloadToSave.walletTransaction = { amount: updatedAmount };

					this.listVochersToSave = this.listVochersToSave.map((item) => {
						if (item.paymentMethod === 'wallet') item.totalAmount = updatedAmount;
						return item;
					});
				} else {
					this.listVochersToSave.push({
						...voucher,
						paymentMethod: 'wallet',
						bankName: 'Wallet'
					});
					this.payloadToSave.walletTransaction = { amount: voucher.totalAmount };
				}
			}
		}
	}

	public get totalInTable(): number {
		return this.listVochersToShow.reduce((sum, voucher) => {
			return Number(sum) + Number(voucher.totalAmount);
		}, 0);
	}

	public get totalInTableNoWallet(): number {
		return this.listVochersToShow.reduce((sum, voucher) => {
			return Number(sum) + voucher.bankName === PaymentType.WALLET ? 0 : Number(voucher.totalAmount);
		}, 0);
	}

	public openPaymentBank(): void {
		const { packageDetailId } = this.quoteDetail;
		const listCurrencies = this.operationCurrency.filter((currency) =>
			GetCurrenciesByCountry(this.residenceCountry).includes(currency.value)
		);

		this.dialogService
			.open(ModalPaymentBankContainer, {
				header: `Pago en efectivo a través de ${
					this.voucherToEdit?.methodSelected?.description || this.methodSelected?.description
				}`,
				data: {
					methodSelected: this.voucherToEdit?.methodSelected || this.methodSelected,
					exchangeType: this.exchangeType,
					packageDetailId: packageDetailId,
					operationCurrency: listCurrencies,
					totalAmountPaid: this.isGracePeriodApplied
						? this.appliedGracePeriodData?.totalPay
						: this.payMultiple
						? this.form.get('totalAmount').value || 0
						: this.quoteDetail.total || 0,
					voucherToEdit: this.voucherToEdit,
					indexEdit: this.indexEdit
				},
				styleClass: 'custom-modal-css',
				width: '40%'
			})
			.onClose.subscribe((data) => {
				this.voucherToEdit = null;
				this.indexEdit = null;

				if (data && data?.listaVouches && data?.listaVouches.length > 0) {
					if (data.indexEdit !== null && data.indexEdit !== undefined) {
						this.listVochersToSave.splice(data.indexEdit, 1, ...data.listaVouches);
					} else {
						this.listVochersToSave.push(...data.listaVouches);
					}

					this.payloadToSave = {
						...this.payloadToSave,
						listaVouches: this.listVochersToSave
					};

					this.addPaymentMethod(2);
				}
			});
	}

	private payload(): any {
		let idTypeMethodPayment = null;
		let uniqueArray = Array.from(new Set(this.listMethodPayment));

		if (uniqueArray.length > 1) {
			idTypeMethodPayment = 1;
		} else {
			[idTypeMethodPayment] = uniqueArray;
		}
		const numberQuotes = this.form.get('numberQuotes')?.value || 0;
		const payload = {
			idPayment: this.quoteDetail.idPayment,
			idUserPayment: this.userInfoService.userInfo.id,
			typeMethodPayment: idTypeMethodPayment,
			/* 	amountPaidPayment: this.payMultiple
				? this.form.get('totalAmount').value || 0
				: this.quoteDetail.total || 0, */
			amountPaidPayment: this.payMultiple
				? this.form.get('totalAmount').value || 0
				: this.isGracePeriodApplied
				? this.appliedGracePeriodData?.totalPay || 0
				: this.quoteDetail.total || 0,

			idPackage: this.quoteDetail.packgeId,
			numberPaymentInitials: this.payMultiple ? 1 : this.quoteDetail.isInitialQuote,
			numberAdvancePaymentPaid: this.payMultiple ? numberQuotes - 1 : numberQuotes,
			paypalDTO: {},
			isGracePeriodApplied: this.isGracePeriodApplied,
			typePercentOverdue: this.isGracePeriodApplied
				? this.appliedGracePeriodData?.percentOverdueType
				: 0,
			totalOverdue: this.isGracePeriodApplied ? this.appliedGracePeriodData?.overdue : 0,
			idPercentOverdueDetail: this.isGracePeriodApplied
				? this.appliedGracePeriodData?.percentOverdueDetailId
				: 0
		};

		return payload;
	}
	public onSubmit(status: number) {
		if (this.isLiquidated) {
			if (!this.idsponsor) {
				alert('Debe seleccionar un patrocinador antes de realizar el pago.');
				return;
			}
		}

		this.payloadToSave = {
			...this.payload(),
			listaVouches:
				this.listVochersToSave
					?.filter((voucher) => voucher.paymentMethod !== 'wallet' && voucher.paymentMethod !== 'coupon')
					.map((voucher) => ({
						idMethodPaymentSubType: voucher.methodSubTipoPagoId,
						operationNumber: voucher.operationNumber,
						comision: isNaN(Number(voucher.comision)) ? 0 : Number(voucher.comision),
						note: voucher.note,
						totalAmount: normalizeAmount(voucher.totalAmount).toFixed(2),
						idPaymentCoinCurrency: voucher.currency,
			imagenBase64: voucher.imagen?.base64 || null
		})) || [],
	walletTransaction: this.payloadToSave?.walletTransaction || null,
	couponTransaction: this.hasCoupon && this.subscriptionCoupon ? {
		amount: Math.round(this.couponDiscountAmount),
		idCoupon: this.subscriptionCoupon.idCoupon
	} : null,
	paypalDTO: this.payloadToSave?.paypalDTO || null
};	console.log('🎫 Payload con cupón automático:', {
		hasCoupon: this.hasCoupon,
		couponTransaction: this.payloadToSave.couponTransaction,
		fullPayload: this.payloadToSave
	});		if (
			(!this.payloadToSave.listaVouches || this.payloadToSave.listaVouches.length === 0) &&
			!this.payloadToSave.paypalDTO &&
			!this.payloadToSave.walletTransaction &&
			!this.payloadToSave.couponTransaction
		) {
			alert('Debe registrar un pago');
			return;
		}

		const exchangeRate = this.exchangeType || 1;
		const totalComision = (this.dataTableToShow || []).reduce((sum, item) => {
			const comisionValue = isNaN(parseFloat(item.comision)) ? 0 : parseFloat(item.comision);

			const comisionEnDolares =
				item.currency === 2 && exchangeRate > 0 ? comisionValue / exchangeRate : comisionValue;

			return Math.round((sum + comisionEnDolares) * 100) / 100;
		}, 0);
		const amountToCompare = (this.payloadToSave.amountPaidPayment || 0) + (totalComision || 0);
		const isTotalValid = isEqualToTotalToPaid(
			this.payloadToSave.listaVouches,
			this.payloadToSave.walletTransaction?.amount,
			amountToCompare,
			exchangeRate,
			this.payloadToSave.couponTransaction?.amount
		);

		if (!isTotalValid && !this.payloadToSave.paypalDTO) {
			alert('El monto ingresado no coincide con el total a pagar');
			return;
		}

		console.log("payload: " ,this.payloadToSave ) ;
		//return

		this.isLoading = true;
		this.productService
			.payQuote(this.payloadToSave)
			.pipe(
				tap(() => {
					const onlyWallet =
						!!this.payloadToSave.walletTransaction &&
						!this.payloadToSave.listaVouches?.length &&
						!this.payloadToSave.paypalDTO;
					const onlyPaypal =
						!!this.payloadToSave.paypalDTO &&
						!this.payloadToSave.listaVouches?.length &&
						!this.payloadToSave.walletTransaction;

					if (onlyWallet || onlyPaypal) {
						this.checkAndUpdateJobStatusIfNeeded(this.userInfoId);
					}

					if (
						this.gracePeriodModel?.daysUsed <= 0 ||
						Object.keys(this.gracePeriodModel || {}).length === 0
					) {
						this.verifyLiquidationAndReactivate();
						this.dialogService
							.open(ModalSuccessComponent, {
								header: '',
								data: {
									text: 'El pago se realizó correctamente.',
									title: '¡Éxito!',
									icon: 'check_circle_outline'
								}
							})
							.onClose.pipe(tap(() => this.router.navigate(['/profile/partner'])))
							.subscribe();
					} else {
						this.gracePeriodModel.status = status;
						this.gracePeriodService.saveGracePeriod(this.gracePeriodModel).subscribe({
							next: () => {
								this.verifyLiquidationAndReactivate();

								this.dialogService
									.open(ModalSuccessComponent, {
										header: '',
										data: {
											text: 'El pago se realizó correctamente.',
											title: '¡Éxito!',
											icon: 'assets/icons/Inclub.png'
										}
									})
									.onClose.pipe(
										tap(() => {
											this.router.navigate(['/profile/partner']);
										})
									)
									.subscribe();
							},
							error: (error) => {
								alert(error.error.message);
							}
						});
						catchError((error) => {
							console.error('Error en la llamada a la API:', error);
							alert('Ocurrió un inconveniente al procesar el pago. Intenta más tarde.');
							this.isLoading = false;
							return of(null);
						});
					}
				}),
				finalize(() => {
					this.isLoading = false;
				})
			)
			.subscribe();
	}

	private checkAndUpdateJobStatusIfNeeded(idUser: number): void {
		this.productService.updateJobStatus(idUser).subscribe({
			next: () => console.log('Estado actualizado correctamente'),
			error: (err) => console.error('Error al actualizar el estado:', err)
		});
	}

	getListVochersToEdit(data): Array<any> {
		return data.listaVouches.map((voucher) => {
			voucher = {
				...voucher,
				currency: data.currency,
				currencyDescription: data.currencyDescription,
				methodSelected: voucher.methodSelected ? voucher.methodSelected : this.methodSelected
			};
			return voucher;
		});
	}

	private addPaymentMethod(paymentType: number) {
		if (!this.listMethodPayment.includes(paymentType)) {
			this.listMethodPayment.push(paymentType);
		}
	}

	/* 	private addPaymentMethod() {
		if (!this.listMethodPayment.includes(this.methodSelected.idPaymentMethod)) {
			this.listMethodPayment.push(this.methodSelected.idPaymentMethod);
		}
	} */

	getListVochersToShow(data): Array<any> {
		return data.listaVouches.map((voucher) => {
			voucher.bankName = voucher.methodSelected
				? voucher.methodSelected.description
				: this.methodSelected.description;
			voucher.currencyDescription = data.currencyDescription;
			voucher.comision = voucher?.comision ? voucher.comision : '-';
			voucher.img = voucher.imagen ? ImagenData(voucher.imagen.file) : '-';
			voucher.operationDescription = voucher?.operationDescription ? voucher.operationDescription : '-';
			return voucher;
		});
	}

	public get dataTableToShow() {
		return [
			...this.listVochersToSave.map((voucher) => {
				voucher.bankName = voucher.methodSelected
					? voucher.methodSelected.description
					: this.methodSelected.description;

				voucher.comision = voucher?.comision ? voucher.comision : '-';
				voucher.img = voucher.imagen ? ImagenData(voucher.imagen.file) : '-';
				voucher.operationDescription = voucher?.operationDescription
					? voucher.operationDescription
					: '-';
				return voucher;
			})
		];
	}
	public editPayItem(index: number): void {
		this.indexEdit = index;
		this.voucherToEdit = { ...this.listVochersToSave[index] };

		if (this.voucherToEdit.paymentMethod === 'wallet') {
			this.openModalWallet(this.voucherToEdit);
		} else {
			this.openPaymentBank();
		}
	}

	public deletePayItem(index: number): void {
		const voucher = this.listVochersToSave[index];
		
		if (voucher && voucher.paymentMethod === 'coupon') {
			alert('El cupón asociado a esta suscripción no puede ser eliminado manualmente.');
			return;
		}
		
		this.listVochersToSave.splice(index, 1);

		this.listMethodPayment = this.listVochersToSave.map((voucher) =>
			voucher.paymentMethod === 'wallet' ? 4 : 2
		);
	}

	public onPaypal() {
		const {
			paymentSubTypeList: [value]
		} = this.methodSelected;

		const dataToModal = {
			description: this.quoteDetail.nameSuscription,
			amount: this.isGracePeriodApplied
				? this.appliedGracePeriodData?.totalPay
				: this.payMultiple
				? this.form.get('totalAmount').value || 0
				: this.quoteDetail.total || 0,
			...this.methodSelected,
			...value
		};
		this.dialogService
			.open(ModalPaymentPaypalComponent, {
				header: 'Pago con Paypal',
				data: dataToModal
			})
			.onClose.pipe(
				tap((data: IPaypalData) => {
					if (data) {
						this.addPaymentMethod(3);
						this.payloadToSave = {
							paypalDTO: {
								nroOperation: data.operationNumber,
								currencyId: data.typeCurrency
							}
						};

						this.diablePaymentMethods = true;
						this.onSubmit(2);
					}
				})
			)
			.subscribe();
	}

	private getCurrencyList() {
		this.modalPaymentService
			.getCurrency()
			.pipe(
				tap((monedas) => {
					this.operationCurrency = monedas;
				})
			)
			.subscribe();
	}

	private getTC() {
		this.modalPaymentService.getTipoCambio().subscribe((exchangeType) => {
			this.exchangeType = exchangeType.sale;
		});
	}

	get title() {
		return 'Pagar cuota';
	}

	getQuoteDetail(idSuscription: number): void {
		this.productService.getQuoteDetail(idSuscription).subscribe((data) => {
			this.quoteDetail = data;
		});
	}

	openGracePeriod() {
		this.dialogRef = this.dialogService.open(ModalGracePeriodComponent, {
			header: 'Periodo de gracia',
			width: '35%',
			data: {
				daysAvailable: this.gracePeriodParameter?.valueDays - this.graceDebt,
				totalOverdueDetail: this.quoteDetail?.daysOverdue,
				quote: this.quoteDetail?.quoteUsd,
				amountOverdue: this.quoteDetail?.totalOverdue,
				percentOverdueDetailId: this.quoteDetail?.idPercentOverduedetail
			}
		});

		this.dialogRef.onClose.subscribe((data) => {
			if (data) {
				this.appliedGracePeriodData = data.response;
				this.gracePeriodModel.flagSchedule = data.flagSchedule;
				this.isGracePeriodApplied = true;
				this.gracePeriodModel.daysUsed = this.appliedGracePeriodData.daysUsed;
				this.gracePeriodModel.suscriptionId = this.productId;
				this.gracePeriodModel.gracePeriodTypeId = 1;
				this.gracePeriodModel.userId = this.userInfoService.userInfo.id;
				this.dialogService.open(ModalSuccessComponent, {
					header: '',
					data: {
						text: 'El período de gracia se aplicó correctamente.',
						title: '¡Éxito!',
						icon: 'assets/icons/Inclub.png'
					}
				});
			}
		});
	}

	private verifyLiquidationStatus(): void {
		this.sponsorService.checkLiquidationStatus(this.userInfoService.userInfo.id).subscribe({
			next: (response) => {
				this.isLiquidated = response.data;
			},
			error: (err) => {
				console.error('Error al verificar liquidación:', err);
				alert('Hubo un problema al verificar el estado de liquidación.');
			}
		});
	}

	private reactivateMember() {
		const idSponsor = this.idsponsor;
		const idUser = this.userInfoService.userInfo.id;

		this.sponsorService.reactivateMember(idSponsor, idUser).subscribe({
			next: () => {
				console.log('Socio reactivado exitosamente');
				alert('Socio reactivado exitosamente');
			},
			error: (error) => {
				console.error('Error al reactivar socio:', error);
				alert('El pago se realizó, pero hubo un error al reactivar al socio.');
			}
		});
	}

	private verifyLiquidationAndReactivate(): void {
		const idSponsor = this.idsponsor;

		if (idSponsor && idSponsor !== null) {
			console.log('El usuario tiene un sponsor válido, procediendo a reactivación...');
			this.reactivateMember();
		} else {
			console.log('El usuario no tiene sponsor o es inválido, no se puede reactivar.');
		}
	}
}
