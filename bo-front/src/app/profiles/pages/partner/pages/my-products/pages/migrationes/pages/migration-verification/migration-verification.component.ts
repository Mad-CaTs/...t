import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IPaypalData } from 'src/app/profiles/pages/ambassador/pages/new-partner/commons/interfaces/new-partner.interface';
import { NewPartnerPaymentComponent } from 'src/app/profiles/pages/ambassador/pages/new-partner/pages/new-partner-payment/new-partner-payment.component';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { MessagesModule } from 'primeng/messages';
import RadiosComponent from '@shared/components/form-control/radios/radios.component';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { MIGRATION_TABS } from 'src/app/profiles/pages/ambassador/pages/store/commons/constants';
import { INavigation } from '@init-app/interfaces';
import { MatIconModule } from '@angular/material/icon';
import { NavigationComponent } from '@shared/components/navigation/navigation.component';
import { ISelect } from '@shared/interfaces/forms-control';
import { ModalPartnerPaymentService } from 'src/app/profiles/pages/ambassador/pages/new-partner/pages/new-partner-payment/servicio/new-partner-payment.service';
import { SelectComponent } from '@shared/components/form-control/select/select.component';
import { Location } from '@angular/common';
import {
	GetCurrenciesByCountry,
	getPaymentListByContry
} from 'src/app/profiles/pages/ambassador/pages/new-partner/pages/new-partner-payment/commons/contants';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';
import { catchError, finalize, of, tap } from 'rxjs';
import { MigrationVerificationPresenter } from './Migration-verification-presenter';
import {
	CountryType,
	PaymentType
} from 'src/app/profiles/pages/ambassador/pages/new-partner/pages/new-partner-payment/commons/enums';
import { CurrencyType } from 'src/app/profiles/commons/enums';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ModalPaymentService } from 'src/app/profiles/pages/ambassador/pages/new-partner/pages/new-partner-payment/commons/sevices/modal-payment.service';
import { ImagenData } from '@shared/constants';
import {
	isEqualToTotalToPaid,
	normalizeAmount
} from 'src/app/profiles/pages/ambassador/pages/new-partner/commons/constants';
import { ModalSuccessComponent } from 'src/app/profiles/commons/modals/modal-success/modal-success.component';
import { ModalPaymentPaypalComponent } from 'src/app/profiles/pages/ambassador/pages/new-partner/pages/new-partner-payment/commons/modals/modal-payment-paypal/modal-payment-paypal.component';
import { ModalPaymentBankContainer } from 'src/app/profiles/pages/ambassador/pages/new-partner/pages/new-partner-payment/commons/modals/modal-payment-bank/modal-payment-bank.container';
import { GetListVouchersToSave } from 'src/app/profiles/pages/ambassador/pages/new-partner/pages/new-partner-payment/commons/contants/list-vouchers-to-save';
import {
	IModalAlertData,
	IPackage,
	IPackageDetail,
	IQuotesOptions,
	Voucher
} from '../commons/interfaces/Migration.interface';
import { MigrationService } from '../commons/services/migration-service.service';
import { ModalPayFeeComponent } from '../../../../commons/modals/modal-pay-fee/modal-pay-fee';
import { ModalAlertComponent } from 'src/app/profiles/commons/modals/modal-alert/modal-alert.component';

@Component({
	selector: 'app-migration-verification',
	standalone: true,
	providers: [MigrationVerificationPresenter, DialogService],
	imports: [
		CommonModule,
		TableModule,
		MessagesModule,
		RadiosComponent,
		DropdownModule,
		InputNumberModule,
		CardModule,
		DividerModule,
		FormsModule,
		MatIconModule,
		NavigationComponent,
		ReactiveFormsModule,
		SelectComponent
	],
	templateUrl: './migration-verification.component.html',
	styleUrl: './migration-verification.component.scss'
})
export default class MigrationVerificationComponent implements OnInit {
	currentTab: number;

	residenceContry: any;
	paymentType: string = 'contado';
	form: FormGroup;
	tabs: INavigation[] = MIGRATION_TABS;
	public payTypeList: ISelect[];
	paymentForm: FormGroup;
	packageData: IPackage;
	public quotesOptions: IQuotesOptions[] = [];
	public paymentTypeListaFiltered: any;
	paymentTypeList: any;
	showPaymentMethods: boolean = false;
	public selectedNumberQuotes: number | null = null;
	selectedPaymentOption: number;
	methodSelected: any;
	public operationCurrency: any[];

	pkgDetail: IPackageDetail;
	dialogRef: DynamicDialogRef;
	public amountPaid: number;
	idPackage: number;
	idPackageDetail: number;
	idSuscription: number;
	walletTransaction: any;
	listVochersToShow: any = [];
	listVochersToEdit: any = [];
	listMethodPayment: any = [];
	@Output() saveNewUser = new EventEmitter<any /* INewPartnerStep4Data */>();
	listVochersToSave: any = [];
	payloadToSave: any = {};
	files: File[] = [];
	residenceCountry: CountryType;
	public exchangeType: number;
	diablePaymentMethods = false;
	voucherToEdit: any;
	indexEdit: number = null;
	userInfo: any;
	deteilSuscription: any;
	title: string = '';
	subtitle: string = '';
	selectedDefaultQuote = 1;
	idOption: number;
	migrationDetalle: any;
	isLoading: boolean = false;
	isButtonLoading: boolean = false;
	private isAutomaticChange: boolean = false;
	dataValidate: any;
	selectPackageData: any;
	deteilMigration: any;
	public getTotalAmountPaid: number = 0;

	constructor(
		private route: ActivatedRoute,
		private presenter: MigrationVerificationPresenter,
		private migrationService: MigrationService,
		private modalPartnerPaymentService: ModalPartnerPaymentService,
		private location: Location,
		private userInfoService: UserInfoService,
		private dialogService: DialogService,
		private modalPaymentService: ModalPaymentService,
		private fb: FormBuilder,
		private router: Router,
		private changeDetectorRef: ChangeDetectorRef,
		private cdr: ChangeDetectorRef
	) {
		this.presenter = new MigrationVerificationPresenter(this.fb);
		this.form = this.presenter.form;
	}

	ngOnInit(): void {
		this.initData();
		this.validateAndLimitPayments();
	}

	private initData() {
		this.initParms();

		this.getUserInfoAndSetResidenceCountry();
		this.getPaymentType();
		this.getOptionInitialQuota();
		this.filterPaymentTypesByCountry();
		this.initializeDefaultSelection();
		this.getCurrencyList();
		this.getTC();
	}
	initParms() {
		this.route.queryParams.subscribe((params) => {
			this.currentTab = +params['currentTab'];
			this.selectPackageData = params['selectedPackage'] ? JSON.parse(params['selectedPackage']) : null;
			this.deteilMigration = params['deteilMigration'] ? JSON.parse(params['deteilMigration']) : null;
			this.pkgDetail = this.deteilMigration?.packageDetail[0];
			this.updateTexts();
			if (this.idPackage && this.idPackageDetail && this.idSuscription && this.idOption) {
				this.fetchMigrationScheduleDetail();
			}
		});
		this.getTotalAmountPaid = this.selectPackageData?.quoteUsd || 0;
	}

	fetchMigrationScheduleDetail(): void {
		this.isLoading = true;
		this.migrationService
			.getMigrationScheduleDetail(
				this.idSuscription,
				this.idOption,
				this.idPackage,
				this.idPackageDetail
			)
			.subscribe((response) => {
				if (response && response.result) {
					this.migrationDetalle = response.data;
				}
				this.isLoading = false;
			});
	}

	validateAndLimitPayments() {
		this.form.get('totalNumberPaymentPaid')?.valueChanges.subscribe((numberOfPayments: number) => {
			const maxCuotas = this.migrationDetalle?.durationMonths || 0;
			const initialAmountPaid = this.migrationDetalle?.initialAmountNew || 0;

			if (numberOfPayments > maxCuotas) {
				this.form.get('totalNumberPaymentPaid')?.patchValue(maxCuotas, { emitEvent: false });
			}

			this.calculateAmountPaid();
		});
	}

	updateTexts() {
		if (this.currentTab === 1) {
			this.title = 'Migrar paquetes';
			this.subtitle = 'Verifique los datos del paquete o membresía a migrar';
		} else if (this.currentTab === 2) {
			this.title = 'Migrar portafolio';
			this.subtitle = 'Verifique los datos del portafolio o familia a migrar';
		}
	}

	private initializeDefaultSelection() {
		const defaultQuotaOption = 1;
		this.changeSelectionNumberQuotes({ value: defaultQuotaOption });
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

	getUserInfoAndSetResidenceCountry(): void {
		this.userInfo = this.userInfoService.userInfo;
		this.residenceContry = this.userInfo.idResidenceCountry;
	}
	private getTC() {
		this.modalPaymentService.getTipoCambio().subscribe((exchangeType) => {
			this.exchangeType = exchangeType.sale;
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
	private setPaymentTypeListaFiltered(country: string) {
		this.paymentTypeListaFiltered = getPaymentListByContry(this.paymentTypeList, country);
	}

	private getOptionInitialQuota() {
		this.modalPartnerPaymentService.getFractioninitialQuota().subscribe((opciones) => {
			this.payTypeList = opciones;
		});
	}

	private handlePackageDetail() {
		if (this.pkgDetail) {
			const numberInitialQuote = this.pkgDetail.numberInitialQuote;
			this.quotesOptions = this.getListNumberQuotes(numberInitialQuote);
		}
	}

	private calculateAmountPaid() {
		const numberOfPayments = Math.min(
			this.form.get('totalNumberPaymentPaid')?.value || 0,
			this.migrationDetalle?.durationMonths || 0
		);
		const remainingInitialAmount = this.migrationDetalle?.initialAmountNew;
		const finalRemainingInitialAmount = Math.max(remainingInitialAmount, 0);
		const amountPaid = (this.pkgDetail.quotaPrice * numberOfPayments).toFixed(2);
		this.amountPaid = parseFloat(amountPaid);
	}

	public getListNumberQuotes(numberQuotes: number) {
		const quotes = [];
		for (let i = 1; i <= numberQuotes; i++) {
			quotes.push({ value: i, content: `Cuota ${i}` });
		}
		return quotes;
	}

	public changeSelectionNumberQuotes({ value }) {
		this.selectedNumberQuotes = value;
		const detail = this.pkgDetail;
		this.manageQuotesAmounts(detail, value);
		const totalNumberPaymentPaidControl = this.form.get(`totalNumberPaymentPaid`);
	}

	private manageQuotesAmounts(detail, quotesNumber) {
		if (detail && (detail?.isSpecialFractional || detail?.numberInitialQuote > 1)) {
			this.cleanAndDisableQuotesAmount();
			this.setAndAbleQuotesAmount(quotesNumber, this.quoteAmount(quotesNumber));
		}
	}

	private cleanAndDisableQuotesAmount() {
		for (let i = 1; i <= this.pkgDetail?.numberInitialQuote; i++) {
			this.form.get(`amount${i}`).setValue(0);
			this.form.get(`amount${i}`).disable();
		}
	}
	private setAndAbleQuotesAmount(quotesNumber: number, quoteAmount: number) {
		this.isAutomaticChange = true;
		for (let i = 1; i <= quotesNumber; i++) {
			const amountControl = this.form.get(`amount${i}`);

			if (amountControl) {
				amountControl.setValue(quoteAmount);
				if (this.form.get('payType').value === 2) {
					amountControl.enable();
				}
			}
		}
	}

	setTab(selectedTab: number): void {
		if (selectedTab !== this.currentTab) {
			console.warn('No se puede cambiar de pestaña hasta completar el proceso.');
			return;
		}
		this.currentTab = selectedTab;
	}

	onChangeSelectionPayType(option: number) {
		this.presenter.updatePaymentType(option);
		const initialAmountPaid = this.migrationDetalle?.initialAmountNew;
		this.selectedNumberQuotes = 0;
		if (option === 1 && initialAmountPaid === 0) {
		} else if (option === 1) {
			this.form.get('numberPaymentInitials')?.disable();
			this.form.get('totalNumberPaymentPaid')?.enable();
			this.form.get('numberPaymentInitials')?.setValue(null);
			this.form.get('amount1')?.disable();
			this.form.get('amount2')?.disable();
			this.form.get('amount3')?.disable();
			this.form.get('amount1')?.setValue(null);
			this.form.get('amount2')?.setValue(null);
			this.form.get('amount3')?.setValue(null);
		} else if (option === 2) {
			this.form.get('totalNumberPaymentPaid')?.disable();

			this.form.get('totalNumberPaymentPaid')?.setValue(0);

			if (initialAmountPaid > 0) {
				this.form.get('numberPaymentInitials')?.enable();

				this.form.get('totalNumberPaymentPaid')?.disable();
			} else {
				this.form.get('numberPaymentInitials')?.disable();
				this.form.get('totalNumberPaymentPaid')?.enable();
			}
		}

		this.selectedPaymentOption = option;
	}
	get remainingInitialAmount(): number {
		const initialAmount = this.migrationDetalle?.initialAmountNew || 0;
		const amount1 = this.form.get('amount1')?.value || 0;

		if (this.selectedPaymentOption === 2 && amount1 > 0) {
			return amount1;
		}

		return initialAmount;
	}

	onNextClick() {
		if (this.showPaymentMethods || !this.pkgDetail?.isSpecialFractional) {
			this.onSubmit();
		} else {
			if (this.pkgDetail?.isSpecialFractional) {
				if (this.selectedPaymentOption === 2 || this.selectedPaymentOption === 1) {
					if (this.form.get('payType')?.value === 2) {
						const amount1 = parseFloat(this.form.get('amount1')?.value || '0');
						const amount2 = parseFloat(this.form.get('amount2')?.value || '0');
						const amount3 = parseFloat(this.form.get('amount3')?.value || '0');
						const totalFraccionado = amount1 + amount2 + amount3;
						const initialPrice = parseFloat(this.migrationDetalle?.initialAmountNew || '0');

						if (amount1 === 0 && amount2 === 0 && amount3 === 0) {
							alert('En cuantas cuotas desea fraccionar.');
							return;
						}

						if (this.pruebaIsFractional) {
							if (totalFraccionado !== initialPrice) {
								alert(
									'La suma de los montos fraccionados no coincide con el monto restante de la cuota inicial.'
								);
								return;
							}
						}
					}

					this.showPaymentMethods = true;
				} else {
					alert('Por favor selecciona una opción de pago antes de continuar.');
					return;
				}
			}
		}
	}

	goBack() {
		this.location.back();
	}

	private filterPaymentTypesByCountry() {
		if (this.paymentTypeList) {
			this.paymentTypeListaFiltered = getPaymentListByContry(
				this.paymentTypeList,
				this.residenceContry
			);
		}
	}

	public get pruebaIsFractional() {
		return this.pkgDetail?.isSpecialFractional || this.pkgDetail?.numberInitialQuote > 1;
	}
	public getForm(form: string) {
		return this.presenter.form.get(form) as FormControl;
	}

	public get amount1Value() {
		return this.getForm('amount1').value;
	}

	get calculaNuevaInicial(): number {
		if (this.pkgDetail && this.migrationDetalle) {
			const nuevaInicial = this.pkgDetail.initialPrice - this.migrationDetalle.initialAmountNew;
			return nuevaInicial;
		}
		return 0;
	}

	private quoteAmount(quotesNumber: number) {
		const initialPrice = this.migrationDetalle?.initialAmountNew;
		return initialPrice / quotesNumber;
	}

	public get fracciona() {
		return this.form.get('payType')?.value === 1 || this.selectedNumberQuotes > 1;
	}

	public onMedioPago(methodSelected) {
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
				totalAmountPaid: this.getTotalAmountPaid,
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
		const [voucher] = data.listaVouches;

		const walletVoucher = {
			...voucher,
			paymentMethod: 'wallet',
			bankName: 'Wallet',
			totalAmount: voucher.totalAmount || 0
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

		const totalAmountPaid = this.getTotalAmountPaid;

		this.addPaymentMethod(4);

		if (walletVoucher.totalAmount === totalAmountPaid) {
			this.payloadToSave = {
				...this.payloadToSave,
				walletTransaction: { amount: walletVoucher.totalAmount }
			};

			/* 			this.onSubmit();
			 */
		}
	}

	public calculateTotalVouchersInDollars(vouchers: any[], exchangeRate: number): number {
		return vouchers.reduce((sum, voucher) => {
			const totalAmount = Number(voucher.totalAmount);
			if (isNaN(totalAmount)) {
				console.error('Error: Voucher totalAmount is NaN for:', voucher);
				return sum;
			}

			if (voucher.idPaymentCoinCurrency === 2) {
				return sum + totalAmount / exchangeRate;
			}

			return sum + totalAmount;
		}, 0);
	}

	private addPaymentMethod(paymentType: number) {
		if (!this.listMethodPayment.includes(paymentType)) {
			this.listMethodPayment.push(paymentType);
		}
	}
	public onSubmit(): void {
		if (this.listVochersToSave.length === 0 && !this.payloadToSave.operationNumberPaypal) {
			this.showModalAlert({
				title: 'Realiza un pago',
				message: 'Debe registrar al menos un método de pago.',
				type: 'warning',
				icon: 'pi pi-exclamation-triangle'
			});
			return;
		}
		const exchangeRate = this.exchangeType || 1;
		const comisionTotal = !this.payloadToSave.operationNumberPaypal
			? this.listVochersToSave
					.filter((voucher) => voucher.paymentMethod !== 'wallet')
					.reduce((sum, voucher) => {
						const comision =
							voucher.currency === 2
								? parseFloat(voucher.comisionSoles) / exchangeRate
								: parseFloat(voucher.comisionDolares);
						const roundedComision = isNaN(comision) ? 0 : Math.round(comision * 100) / 100;
						return Math.round((sum + roundedComision) * 100) / 100;
					}, 0)
			: 0;

		const files = this.payloadToSave.operationNumberPaypal
			? []
			: this.listVochersToSave
					.filter(
						(voucher) =>
							voucher.paymentMethod !== 'wallet' && voucher.imagen && voucher.imagen.file
					)
					.map((voucher) => voucher.imagen.file);

		const generalVouchers = this.listVochersToSave
			.filter((voucher) => voucher.paymentMethod !== 'wallet')
			.map((voucher) => ({
				idSuscription: this.selectPackageData.idSuscription,
				pathPicture: voucher.imagen?.file?.name || null,
				operationNumber: voucher.operationNumber,
				idMethodPaymentSubType: voucher.methodSubTipoPagoId,
				note: voucher.note,
				idPaymentCoinCurrency: voucher.currency,
				commissionPaymentSubType: isNaN(Number(voucher.comision)) ? 0 : Number(voucher.comision),
				totalAmount: normalizeAmount(voucher.totalAmount).toFixed(2),
				creationDate: new Date().toISOString()
			}));

		const walletAmount = this.listVochersToSave
			.filter((voucher) => voucher.paymentMethod === 'wallet')
			.reduce((sum, voucher) => sum + parseFloat(voucher.totalAmount), 0);

		const basePayload = this.payload();

		const finalPayload = {
			...basePayload,
			generalVouchers,
			walletTransaction: walletAmount ? { amount: walletAmount } : null,
			operationNumberPaypal: this.payloadToSave.operationNumberPaypal || null
		};

		if (!this.payloadToSave.operationNumberPaypal) {
			const totalToPay = generalVouchers.reduce(
				(sum, v) => sum + parseFloat(v.totalAmount),
				walletAmount
			);

			if (!isEqualToTotalToPaid(generalVouchers, walletAmount, this.getTotalAmountPaid, exchangeRate)) {
				this.showModalAlert({
					title: 'Monto incorrecto',
					message: 'El monto ingresado no coincide con el total a pagar',
					type: 'warning',
					icon: 'pi pi-exclamation-triangle'
				});
				return;
			}
		}
		this.isButtonLoading = true;
		this.migrationService
			.registerMigration(finalPayload, files)
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
						.onClose.pipe(tap(() => this.router.navigate(['/profile/partner'])))
						.subscribe();
				}),
				catchError((error) => {
					console.error('❌ Error en la API de migración:', error);
					this.showModalAlert({
						title: 'Error en el proceso',
						message:
							'Ha ocurrido un inconveniente al procesar la migración. Por favor, inténtelo nuevamente más tarde.',
						icon: 'pi pi-times-circle'
					});
					return of(null);
				}),
				finalize(() => (this.isButtonLoading = false))
			)
			.subscribe();
	}

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

	private buildListInitialAmounts(): number[] {
		const listInitialAmounts: number[] = [];

		const numberOfPayments = this.form.get('numberPaymentInitials')?.value || 0;

		for (let i = 1; i <= numberOfPayments; i++) {
			const amountControl = this.form.get(`amount${i}`);

			if (amountControl && amountControl.value) {
				listInitialAmounts.push(Math.round(amountControl.value));
			}
		}

		return listInitialAmounts.length > 0 ? listInitialAmounts : [];
	}

	private payload(): any {
		let idTypeMethodPayment = null;

		const uniqueArray = Array.from(new Set(this.listMethodPayment));

		if (uniqueArray.length > 1) {
			idTypeMethodPayment = 1;
		} else {
			[idTypeMethodPayment] = uniqueArray;
		}

		const listInitialAmounts = this.buildListInitialAmounts();

		const payload = {
			idUser: this.userInfo.id,
			migrationAmount: this.selectPackageData.quoteUsd,
			amountPaid: this.selectPackageData.quoteUsd,
			idPaymentMethodType: idTypeMethodPayment,
			idSuscription: this.selectPackageData.idSuscription,
			idPackageNew: this.pkgDetail.idPackage,
			idPackageDetailNew: this.pkgDetail.idPackageDetail,
			listInitialAmounts:
				this.selectPackageData.isInitialQuote === 1 && this.selectPackageData.idStatePayment === 0
					? [this.selectPackageData.quoteUsd]
					: []
		};
		return payload;
	}

	public onPaypal() {
		const {
			paymentSubTypeList: [value]
		} = this.methodSelected;

		const dataToModal = {
			description: this.deteilMigration.description,
			amount: this.getTotalAmountPaid || 0,
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
							operationNumberPaypal: data.operationNumber
						};
						this.diablePaymentMethods = true;
						this.onSubmit();
					}
				})
			)
			.subscribe();
	}

	public openPaymentBank(): void {
		const listCurrencies = this.operationCurrency.filter((currency) =>
			GetCurrenciesByCountry(this.residenceContry).includes(currency.value)
		);
		const methodToDisplay = this.voucherToEdit?.methodSelected || this.methodSelected;
		this.dialogService
			.open(ModalPaymentBankContainer, {
				header: `Pago en efectivo a través de ${methodToDisplay?.description}`,
				data: {
					methodSelected: methodToDisplay,
					exchangeType: this.exchangeType,
					operationCurrency: listCurrencies,
					totalAmountPaid: this.selectPackageData?.quoteUsd,
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
						this.listVochersToSave.splice(
							data.indexEdit,
							1,
							...data.listaVouches.map((voucher, idx) => ({
								...this.listVochersToSave[data.indexEdit],
								...voucher,
								imagen: this.listVochersToSave[data.indexEdit]?.imagen || data.imagen
							}))
						);
					} else {
						this.addPaymentMethod(2);
						this.listVochersToSave.push(...data.listaVouches);
					}
					const totalComision = this.listVochersToSave.reduce(
						(sum, voucher) => sum + (Number(voucher.comisionDolares) || 0),
						0
					);
					this.getTotalAmountPaid = (this.selectPackageData?.quoteUsd || 0) + totalComision;
					this.cdr.detectChanges();
				}
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

	public get totalInTable(): number {
		return this.listVochersToShow.reduce((sum, voucher) => {
			return Number(sum) + Number(voucher.totalAmount);
		}, 0);
	}

	deletePayItem(index: number): void {
		this.listVochersToSave.splice(index, 1);

		this.listMethodPayment = this.listVochersToSave.map((voucher) =>
			voucher.paymentMethod === 'wallet' ? 4 : 2
		);
	}

	/* 	deletePayItem(index: number): void {
		this.listVochersToSave.splice(index);

		this.listMethodPayment = this.listVochersToSave.map((voucher) =>
			voucher.paymentMethod === 'wallet' ? 4 : 2
		);

	} */

	editPayItem(index: number) {
		this.indexEdit = index;
		this.voucherToEdit = { ...this.listVochersToSave[index] };

		if (this.voucherToEdit.paymentMethod === 'wallet') {
			this.openModalWallet(this.voucherToEdit);
		} else {
			this.openPaymentBank();
		}
	}

	private showModalAlert(data: IModalAlertData, onCloseCallback?: () => void): void {
		const ref = this.dialogService.open(ModalAlertComponent, {
			data: {
				message: data.message,
				type: data.type,
				title: data.title,
				icon: data.icon
			}
		});

		ref.onClose.subscribe(() => {
			if (onCloseCallback) onCloseCallback();
		});
	}
}
