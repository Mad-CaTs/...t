import { CommonModule } from '@angular/common';
import {
	ChangeDetectorRef,
	Component,
	EventEmitter,
	Input,
	OnInit,
	Output,
	SimpleChanges
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import RadiosComponent from '@shared/components/form-control/radios/radios.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { tap } from 'rxjs';
import { CurrencyType } from 'src/app/profiles/commons/enums';
import { ModalAlertComponent } from 'src/app/profiles/commons/modals/modal-alert/modal-alert.component';
import { ModalSuccessComponent } from 'src/app/profiles/commons/modals/modal-success/modal-success.component';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';
import { IPaypalData } from 'src/app/profiles/pages/ambassador/pages/new-partner/commons/interfaces/new-partner.interface';
import { SelectedPackageService } from 'src/app/profiles/pages/ambassador/pages/new-partner/commons/services/package-detail.service';
import { NewPartnerFormPresenter } from 'src/app/profiles/pages/ambassador/pages/new-partner/new-partner.presenter';
import {
	GetCurrenciesByCountry,
	getPaymentListByContry
} from 'src/app/profiles/pages/ambassador/pages/new-partner/pages/new-partner-payment/commons/contants';
import { PaymentType } from 'src/app/profiles/pages/ambassador/pages/new-partner/pages/new-partner-payment/commons/enums';
import { ModalPaymentBankContainer } from 'src/app/profiles/pages/ambassador/pages/new-partner/pages/new-partner-payment/commons/modals/modal-payment-bank/modal-payment-bank.container';
import { ModalPaymentPaypalComponent } from 'src/app/profiles/pages/ambassador/pages/new-partner/pages/new-partner-payment/commons/modals/modal-payment-paypal/modal-payment-paypal.component';
import { ModalPaymentService } from 'src/app/profiles/pages/ambassador/pages/new-partner/pages/new-partner-payment/commons/sevices/modal-payment.service';
import { ModalPartnerPaymentService } from 'src/app/profiles/pages/ambassador/pages/new-partner/pages/new-partner-payment/servicio/new-partner-payment.service';
import { LegalizationService } from 'src/app/profiles/pages/partner/pages/my-legalization/commons/services/legalization.service';
import { ModalPayFeeComponent } from 'src/app/profiles/pages/partner/pages/my-products/commons/modals/modal-pay-fee/modal-pay-fee';
import { PayFeePresenter } from 'src/app/profiles/pages/partner/pages/my-products/commons/modals/modal-pay-fee/modal-pay-fee.presenter';
import { ILegalizationRateFilter } from '../../interfaces';
import { LegalizationInfoComponent } from 'src/app/profiles/pages/partner/pages/my-legalization/commons/components/legalization-info/legalization-info.component';
import { IShippingFormData } from '../confirm-shipping-address/commons/interfaces';

@Component({
	selector: 'app-confirm-legalization-payment',
	standalone: true,
	imports: [CommonModule, RadiosComponent, LegalizationInfoComponent],
	providers: [DialogService, PayFeePresenter],
	templateUrl: './confirm-legalization-payment.component.html',
	styleUrl: './confirm-legalization-payment.component.scss'
})
export default class ConfirmLegalizationPaymentComponent implements OnInit {
	public paymentTypeListaFiltered: any;
	paymentTypeList: any;
	public walletBlock: boolean = false;
	residenceContry: string;
	public form: FormGroup;
	documentosValidados = false;
	@Output() formValidityChanged = new EventEmitter<boolean>();
	methodSelected: any;
	public operationCurrency: any[];
	dialogRef: DynamicDialogRef;
	indexEdit: number = null;
	listVochersToSave: any = [];
	listMethodPayment: any = [];
	@Input() presenter: NewPartnerFormPresenter;
	@Input() isPackagePaymentContext: boolean = false;
	public exchangeType: number;
	@Output() saveNewUser = new EventEmitter<any /* INewPartnerStep4Data */>();
	voucherToEdit: any;
	@Output() paypalData = new EventEmitter<IPaypalData>();
	diablePaymentMethods = false;
	public multiStepForm: FormGroup;
	@Output() paymentCompleted = new EventEmitter<any>();

	@Input() step2FormData: any;
	@Input() payTypeSelected: any;
	/* 	@Input() typeLegalization: any;
	 */ public montoLegalizacion: number | null = null;
	@Output() montoLegalizacionChanged = new EventEmitter<number>();
	@Output() montoSolesChanged = new EventEmitter<number>();

	listaVouches: any[] = [];
	isEditingPayment = false;
	montoSoles: number | null = null;
	montoLegalizacionUSD!: number;
	@Input() shippingAddressData: any;
	@Input() isForeign: boolean = false;
	@Input() step3FormData: any;
	public apostilladoMontoUSD: number | null = null;
	public apostilladoMontoPEN: number | null = null;
	public legalizationRate: any;
	@Input() selectedProduct: any;

	constructor(
		private formBuilder: FormBuilder,
		public userInfoService: UserInfoService,
		private modalPartnerPaymentService: ModalPartnerPaymentService,
		private dialogService: DialogService,
		private payFeePresenter: PayFeePresenter,
		private cdr: ChangeDetectorRef,
		private selectedPackageService: SelectedPackageService,
		private fb: FormBuilder,
		private modalPaymentService: ModalPaymentService,
		private legalizationService: LegalizationService
	) {
		this.residenceContry = this.userInfoService.userInfo.idResidenceCountry;
		this.form = formBuilder.group({
			paymentMethod: [null, Validators.required]
		});
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes['shippingAddressData'] && changes['shippingAddressData'].currentValue) {
			console.log('Hijo recibió shippingAddressData:', this.shippingAddressData);
			// Aquí puedes inicializar tu formulario o lógica que dependa de estos datos
		}
	}

	ngOnInit(): void {
		this.getInitData();
		console.log("payTypeSelectedpaypal",this.payTypeSelected)
	}

	public getInitData() {
		/* 		this.loadSelectedProductFromSession();
		 */
		this.setupFormStatusListener();
		this.emitInitialFormValidity();
		this.getPaymentType();
		this.getCurrencyList();
		this.filterPaymentTypesByCountry();
		this.loadLegalizationRate();
		this.getTC();
		this.checkAndFetchShippingCost();
		this.checkAndFetchApostille();
	}

	checkAndFetchApostille(): void {
		if (this.shippingAddressData?.data?.apostillaOLegalizacion === 1) {
			this.fetchApostilladoMontoConvertido();
		}
	}

	private setupFormStatusListener(): void {
		this.form.statusChanges.subscribe(() => {
			const isValid = this.form.valid && this.form.get('paymentMethod')?.value !== null;
			this.formValidityChanged.emit(isValid);
		});
	}

	private emitInitialFormValidity(): void {
		this.formValidityChanged.emit(false);
	}

	public get paymentForm() {
		return this.getForm('paymentData');
	}

	public getForm(form: string) {
		return this.presenter.multiStepForm.controls[form];
	}

	checkAndFetchShippingCost(): void {
		const userLocalUbic = this.payTypeSelected;
		const legalizationType = this.selectedProduct?.tipo;
		if (userLocalUbic !== 1) {
			this.legalizationService.getShippingCost(userLocalUbic, legalizationType).subscribe({
				next: (response) => {
					this.montoSoles = response.data.amount;
					this.montoSolesChanged.emit(this.montoSoles);
					this.calcularMontoUSD();
				},
				error: (err) => {
					console.error('Error al obtener el costo de envío:', err);
				}
			});
		}
	}

	private getTC() {
		this.modalPaymentService.getTipoCambio().subscribe((exchangeType) => {
			this.exchangeType = exchangeType.sale;
			this.calcularMontoUSD();
		});
	}

	private calcularMontoUSD(): void {
		if (this.montoSoles !== null && this.montoSoles !== undefined && this.exchangeType) {
			this.montoLegalizacionUSD = +(this.montoSoles / this.exchangeType).toFixed(2);
		}
	}

	private setPaymentTypeListaFiltered(country: string) {
		this.paymentTypeListaFiltered = getPaymentListByContry(
			this.paymentTypeList.filter((payment) => payment.description !== 'WALLET'),
			country,
			this.walletBlock
		);
	}

	getPicture(desc: string) {
		return this.paymentTypeListaFiltered.find((p) => p.description === desc)?.pathPicture;
	}

	private filterPaymentTypesByCountry() {
		if (this.paymentTypeList) {
			this.paymentTypeListaFiltered = getPaymentListByContry(
				this.paymentTypeList,
				this.residenceContry,
				this.walletBlock
			);
		}
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

	private loadLegalizationRate(): void {
		const filter: ILegalizationRateFilter = {
			legalizationType: this.shippingAddressData?.data?.typeLegalization,
			documentType: this.selectedProduct?.tipo,
			userLocalUbic: this.payTypeSelected
		};
		this.legalizationService.getFilteredRate(filter).subscribe((rate) => {
			if (rate) {
				this.legalizationRate = rate;
				this.montoLegalizacion = rate.price;
				this.montoLegalizacionChanged.emit(this.montoLegalizacion);
			} else {
				this.montoLegalizacion = null;
				console.warn('⚠️ No se encontró una tarifa con esos valores');
			}
		});
	}

	public getPaymentType() {
		this.modalPartnerPaymentService
			.getPaymenttype()
			.pipe(
				tap((paymentTypeList) => (this.paymentTypeList = paymentTypeList)),
				tap(() => {
					if (this.residenceContry) {
						this.setPaymentTypeListaFiltered(this.residenceContry);
					}
				})
			)
			.subscribe();
	}

	onMedioPago(methodSelected: any, listaVouches?: any[]): void {
		this.methodSelected = methodSelected;

		if (methodSelected.description === PaymentType.PAYPAL) {
			this.onPaypal();
			return;
		}

		if (listaVouches && listaVouches.length) {
			this.listaVouches = listaVouches;
			this.isEditingPayment = true;
		}

		switch (methodSelected.description) {
			case PaymentType.WALLET:
				this.dialogService.open(ModalAlertComponent, {
					header: 'Información',
					data: {
						message: 'Pronto podrás realizar tus pagos con wallet, estamos trabajando en ello.',
						title: 'Próximamente',
						icon: 'pi pi-info-circle'
					},
					styleClass: 'custom-alert-modal'
				});
				/* 				this.openModalWallet();
				 */ break;

			case PaymentType.BCP:
			case PaymentType.INTERBANK:
			case PaymentType.DAVIVIENDA:
			case PaymentType.OTROS:
			default:
				this.openPaymentBank();
				break;
		}
	}

	public get totalAmount() {
		return this.payFeePresenter.paymentForm.get('totalAmount')?.value || 0;
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

				totalAmountPaid: this.montoLegalizacion || 0,

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

	private processWalletPayment(data: any, isEditing: boolean): void {
		if (data) {
			const [voucher] = data.listaVouches;
			const walletVoucher = {
				...voucher,
				paymentMethod: 'wallet',
				bankName: 'Wallet',
				totalAmount: voucher.totalAmount || 0,
				methodSelected: this.methodSelected
			};

			if (isEditing && this.indexEdit !== null && this.indexEdit !== undefined) {
				this.listVochersToSave[this.indexEdit] = {
					...this.listVochersToSave[this.indexEdit],
					...walletVoucher
				};
			} else {
				this.listVochersToSave.push(walletVoucher);
			}
			this.listVochersToSave = [...this.listVochersToSave];
			this.cdr.detectChanges();
			this.addPaymentMethod(4);
			const totalAmountPaid = this.getTotalAmountPaid;
			if (walletVoucher.totalAmount === totalAmountPaid) {
				this.onSubmit();
			}
		}
	}
	get montoUSD(): number {
		if (this.payTypeSelected === 3) {
			return this.montoLegalizacion;
		}
		if (!this.montoLegalizacion || !this.exchangeType) return 0;
		const raw = this.montoLegalizacion / this.exchangeType;
		return Math.round(raw * 100) / 100;
	}

	private fetchApostilladoMontoConvertido(): void {
		this.legalizationService.getApostilladoMonto().subscribe({
			next: (res) => {
				if (res?.moneda === 'USD' && res.monto && this.exchangeType) {
					this.apostilladoMontoUSD = res.monto;
					/* 					this.apostilladoMontoPEN = +(res.monto * this.exchangeType).toFixed(2);
					 */
				}
			},
			error: (err) => {
				console.error('❌ Error al obtener monto del apostillado:', err);
			}
		});
	}

	public openPaymentBank(fromLegalization: boolean = true, voucherToEdit?: any, indexEdit?: number) {
		if (!this.montoLegalizacion || this.montoLegalizacion <= 0) {
			this.dialogService.open(ModalSuccessComponent, {
				header: '',
				data: {
					text: 'Debe seleccionar el tipo de documento a legalizar antes de continuar con el pago.',
					title: '¡Alerta!',
					icon: 'assets/icons/Inclub.png'
				}
			});
			return;
		}
		const listCurrencies = this.operationCurrency.filter((currency) =>
			GetCurrenciesByCountry(this.residenceContry).includes(currency.value)
		);
		this.dialogService
			.open(ModalPaymentBankContainer, {
				header: `Pago en efectivo a través de ${
					this.voucherToEdit?.methodSelected?.description || this.methodSelected?.description
				}`,
				data: {
					methodSelected: this.voucherToEdit?.methodSelected || this.methodSelected,
					exchangeType: this.exchangeType,
					operationCurrency: listCurrencies,
					idCurrency: 2,
					totalAmountPaid: this.montoLegalizacion,
					voucherToEdit,
					indexEdit,
					listaVouches: this.listaVouches,
					fromLegalization,
					payTypeSelected: this.payTypeSelected,
					shippingCost: this.montoSoles,
					apostilladoMontoUSD: this.apostilladoMontoUSD
				},
				styleClass: 'custom-modal-css',
				width: '40%'
			})
			.onClose.subscribe((data) => {
				if (data) {
					this.paymentCompleted.emit(data);
				}
			});
	}

	get selectedPackageData() {
		return this.selectedPackageService.selectedPackage;
	}

	public onPaypal() {
		if (!this.montoLegalizacion || this.montoLegalizacion <= 0) {
			this.dialogService.open(ModalSuccessComponent, {
				header: '',
				data: {
					text: 'Debe seleccionar el tipo de documento que desea legalizar.',
					title: '¡Alerta!',
					icon: 'assets/icons/Inclub.png'
				}
			});
			return;
		}

		const {
			paymentSubTypeList: [value]
		} = this.methodSelected;
		const dataToModal = {
			amount: this.montoUSD,
			fromLegalization: true,
			payTypeSelected: this.payTypeSelected,
			...this.methodSelected,
			...value
		};
		if (this.payTypeSelected !== 3) {
			dataToModal.montoLegalizacionUSD = this.montoLegalizacionUSD;
		} else {
			dataToModal.montoLegalizacionUSD = this.montoSoles;
		}
		if (this.shippingAddressData?.data?.apostillaOLegalizacion === 1) {
  console.log("✅ Entró a la validación de Apostillado");
  console.log("Monto apostillado extra:", this.apostilladoMontoUSD);
  dataToModal.montoApostilladoExtraUSD = this.apostilladoMontoUSD;
} else {
  console.log("❌ No entró, valor actual:", this.shippingAddressData?.data?.apostillaOLegalizacion);
}

console.log("👉 dataToModal final:", dataToModal);

		/* if (this.shippingAddressData?.data?.apostillaOLegalizacion === 1) {
			dataToModal.montoApostilladoExtraUSD = this.apostilladoMontoUSD;
		} */
		this.dialogService
			.open(ModalPaymentPaypalComponent, {
				header: 'Pago con Paypal',
				data: dataToModal
			})
			.onClose.pipe(
				tap((data: IPaypalData) => {
					if (data) {
						this.paymentCompleted.emit({
							...data,
							paymentMethod: 3
						});

						this.addPaymentMethod(3);
					}
				})
			)
			.subscribe();
	}

	private addPaymentMethod(paymentType: number) {
		if (!this.listMethodPayment.includes(paymentType)) {
			this.listMethodPayment.push(paymentType);
		}
	}

	get getTotalAmountPaid(): number {
		const totalAmountPaid = this.pruebaIsFractional
			? this.amount1Value + parseFloat(this.getAmountPaid)
			: parseFloat(this.getAmountPaid) + parseFloat(this.pkgDetail?.initialPrice);

		this.paymentForm.get('amountPaid').setValue(totalAmountPaid);
		return totalAmountPaid;
	}

	get pkgDetail() {
		return this.selectedPackageService.selectedPackageDetail;
	}

	public get pruebaIsFractional() {
		return this.pkgDetail?.isSpecialFractional || this.pkgDetail?.numberInitialQuote > 1;
	}

	public get amount1Value() {
		return this.getForm('paymentData').get('amount1').value;
	}

	public onSubmit() {
		if (!this.isPackagePaymentContext && !this.presenter.multiStepForm.valid) {
			this.methodSelected = null;
			this.presenter.multiStepForm.markAllAsTouched();
			this.presenter.multiStepForm.updateValueAndValidity();
			this.dialogService.open(ModalAlertComponent, {
				header: '',
				data: {
					message: 'Tienes campos requeridos por completar. ',
					title: '¡Alerta!',
					icon: 'pi pi-exclamation-triangle'
				}
			});
			return;
		}

		const amount1 = parseFloat(this.paymentForm.get('amount1')?.value || '0');
		const amount2 = parseFloat(this.paymentForm.get('amount2')?.value || '0');
		const amount3 = parseFloat(this.paymentForm.get('amount3')?.value || '0');
		const totalFraccionado = amount1 + amount2 + amount3;
		const initialPrice = parseFloat(this.pkgDetail?.initialPrice || '0');

		if (this.pruebaIsFractional) {
			if (totalFraccionado !== initialPrice) {
				this.dialogService.open(ModalSuccessComponent, {
					header: '',
					data: {
						text: 'La suma de los montos fraccionados no puede ser diferente al monto inicial a pagar',
						title: '¡Alerta!',
						icon: 'assets/icons/Inclub.png'
					}
				});
				return;
			}
		}
		const exchangeRate = this.exchangeType;
		this.saveNewUser.emit({
			listMethodPayment: this.listMethodPayment,
			listVochers: this.listVochersToSave,
			exchangeRate
		});
	}

	public get getAmountPaid() {
		let { value } = this.paymentForm.get('totalNumberPaymentPaid');
		if (value > this.pkgDetail?.numberQuotas) {
			value = this.pkgDetail.numberQuotas;
			this.paymentForm.get('totalNumberPaymentPaid')?.setValue(value);
		}
		const amountPaid = ((this.pkgDetail?.quotaPrice || 0) * value).toFixed(0);
		return amountPaid;
	}

	onPaymentAdded(data: any, paymentMethod: number) {
		this.paymentCompleted.emit({
			...data,
			paymentMethod
		});
	}
}
