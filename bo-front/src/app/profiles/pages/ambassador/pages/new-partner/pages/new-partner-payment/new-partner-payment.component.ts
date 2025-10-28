import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { CheckboxComponent } from '@shared/components/form-control/checkbox/checkbox.component';
import { InputComponent } from '@shared/components/form-control/input/input.component';
import { INewPartnerStepsData } from '../../../../commons/interfaces/new-partner.interfaces';
import { ModalPaymentPaypalComponent } from './commons/modals/modal-payment-paypal/modal-payment-paypal.component';
import { ModalPaymentBankContainer } from './commons/modals/modal-payment-bank/modal-payment-bank.container';
import { ModalPaymentService } from './commons/sevices/modal-payment.service';
import { ModalPartnerPaymentService } from './servicio/new-partner-payment.service';
import { PaymentType } from './commons/enums';
import { getPaymentListByContry } from './commons/contants';
import { Subject, filter, map, switchMap, takeUntil, tap, interval, distinctUntilChanged } from 'rxjs';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DialogModule } from 'primeng/dialog';
import { SelectedPackageService } from '../../commons/services/package-detail.service';
import { ImagenData } from '@shared/constants';
import { ISelect } from '@shared/interfaces/forms-control';
import { GetCurrenciesByCountry } from './commons/contants/currencies-for-country.constant';
import { TableModule } from 'primeng/table';
import { DividerModule } from 'primeng/divider';
import { MessagesModule } from 'primeng/messages';
import { FieldsetModule } from 'primeng/fieldset';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectComponent } from '@shared/components/form-control/select/select.component';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import RadiosComponent from '@shared/components/form-control/radios/radios.component';
import { IPaypalData } from '../../commons/interfaces/new-partner.interface';
import { NewPartnerFormPresenter } from '../../new-partner.presenter';
import { CurrencyType } from 'src/app/profiles/commons/enums';
import { ModalPayFeeComponent } from 'src/app/profiles/pages/partner/pages/my-products/commons/modals/modal-pay-fee/modal-pay-fee';
import { PayFeePresenter } from 'src/app/profiles/pages/partner/pages/my-products/commons/modals/modal-pay-fee/modal-pay-fee.presenter';
import { ModalSuccessComponent } from 'src/app/profiles/commons/modals/modal-success/modal-success.component';
import { ModalAlertComponent } from 'src/app/profiles/commons/modals/modal-alert/modal-alert.component';
import { VariableSharingService } from 'src/app/profiles/pages/partner/pages/my-products/commons/services/variable-sharing.service';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';
import { FormsModule} from '@angular/forms';
import { DiscountService } from 'src/app/shared/services/discount.service';
@Component({
	selector: 'app-new-partner-payment',
	standalone: true,
	imports: [
		CommonModule,
		MatIconModule,
		ReactiveFormsModule,
		CheckboxComponent,
		InputComponent,
		FormsModule,
		DialogModule,
		TableModule,
		DividerModule,
		MessagesModule,
		InputNumberModule,
		SelectComponent,
		CardModule,
		DropdownModule,
		RadiosComponent,
		FieldsetModule
	],
	templateUrl: './new-partner-payment.component.html',
	providers: [DialogService, PayFeePresenter],
	styleUrls: ['./new-partner-payment.component.scss']
})
export class NewPartnerPaymentComponent implements OnInit {
	showCouponSuccess = false;
	public isCollaborator = false; // Por defecto false, se activará solo si es colaborador
	public collaboratorData: any;
	public showCouponInput = false;
	public appliedDiscountPercent = 0;
	public discountAmount = 0;
	public couponCode = '';
	public isCouponValid = false;
	public isCouponApplied = false;
	public isValidatingCoupon = false;
	public isApplyingCoupon = false;
	public couponError = '';
	packageId: number = 0;
	private lastPackageId: number | null = null;
	private validatedCouponId: number | null = null; // ID del cupón validado para enviar al registrar
	//PACKAGE DE FAMILIAS 29 - 43 : IDPACKAGE MEMBRESIAS FLEX
	packageIds: number[] = [129,130,143,144];
	@Input() presenter: NewPartnerFormPresenter;
	@Input() steps: INewPartnerStepsData = {};
	@Input() isLoading: boolean;
	@Input() isToken: boolean;
	@Output() saveNewUser = new EventEmitter<any /* INewPartnerStep4Data */>();
	@Output() prevState = new EventEmitter();
	@Output() paypalData = new EventEmitter<IPaypalData>();
	form: FormGroup;
	dialogRef: DynamicDialogRef;
	public operationCurrency: ISelect[];
	public paymentTypeListaFiltered: any;
	public exchangeType: number;
	public payTypeList: ISelect[];
	public amountPaid: string;
	@Input() methodSelected: any;
	listVochersToShow: any = [];
	listVochersToSave: any = [];
	listVochersToEdit: any = [];
	listMethodPayment: any = [];
	indexEdit: number = null;
	voucherToEdit: any;
	selectedDefaultQuote = 1;
	selectedDefaultPayType = 1;
	selectedDefaultTotalNumberPaymentPaid = 0;
	totalAmountPaid: number;
	diablePaymentMethods = false;
	private destroy$: Subject<void> = new Subject<void>();
	public isCashPayment: boolean = false;
	public canPayLater: boolean = false;
	walletTransaction: any;
	@Input() residenceContry: string;
	paymentTypeList: any;
	public token: string;
	@Input() isPackagePaymentContext: boolean = false;
	public selectedNumberQuotes: number | null = null;
	@Input() packageData: any;
	public listPayments: Array<any> = [];
	public data = this.variableSharingService.getData();
	public walletBlock: boolean = false;
	public disabledUser: boolean = this.userInfoService.disabled;

	numberCoutas = [
		{ value: 1, content: 'Cuota 1' },
		{ value: 2, content: 'Cuota 2' },
		{ value: 3, content: 'Cuota 3' }
	];

	constructor(
		public userInfoService: UserInfoService,
		private modalPartnerPaymentService: ModalPartnerPaymentService,
		private dialogService: DialogService,
		private selectedPackageService: SelectedPackageService,
		private modalPaymentService: ModalPaymentService,
		private payFeePresenter: PayFeePresenter,
		private cdr: ChangeDetectorRef,
		private variableSharingService: VariableSharingService,
		private discountService: DiscountService // Servicio preparado para endpoints de cupones
	) { 
		/* 
		 * SISTEMA DE CUPONES UNIFICADO:
		 * - validateCoupon(): Validar cupón (GET) - Preparado para endpoint /api/coupons/validate
		 * - applyCoupon(): Aplicar cupón (UPDATE) - Preparado para endpoint /api/coupons/apply
		 * - Disponible para todos los usuarios (no solo colaboradores)
		 * - Flujo: Validar → Aplicar → Habilitar métodos de pago
		 * 
		 * ENDPOINTS PENDIENTES:
		 * - GET /api/coupons/validate: { couponCode, packageId, companyId?, salary? }
		 * - POST/PUT /api/coupons/apply: { codigo_cupon, packageId, userId }
		 */
	}

	ngOnInit(): void {
		this.checkWalletBlock();
		this.getInitData();
		this.paymentForm.get('email')?.disable();
		this.initializeCollaboratorCheck();
		
		this.subscribeToCollaboratorChanges();
	}
	

	checkWalletBlock() {
		const interval = setInterval(() => {
			const data = this.variableSharingService.getData();
			if (data && data.walletBlock !== undefined) {
				this.walletBlock = data.walletBlock;
				clearInterval(interval);
			}
		}, 200);
	}

	public getInitData() {
		this.getPaymentType();
		this.getContactData();
		this.getCurrencyList();
		this.getTC();
		this.getOptionInitialQuota();
		this.changePackageSelection();
		this.setDefaultFormData();
		this.filterPaymentTypesByCountry();
	}
	initializeCollaboratorCheck(): void {
		this.updateCollaboratorStatus();
	}

	private subscribeToCollaboratorChanges(): void {
		interval(500)
			.pipe(
				takeUntil(this.destroy$),
				map(() => this.variableSharingService.getData()),
				distinctUntilChanged((prev, curr) => {
					// Comparar si cambió el estado de colaborador
					const prevIsCollaborator = prev?.collaboratorData?.collaborator === true;
					const currIsCollaborator = curr?.collaboratorData?.collaborator === true;
					return prevIsCollaborator === currIsCollaborator;
				})
			)
			.subscribe(() => {
				this.updateCollaboratorStatus();
			});
	}

	private updateCollaboratorStatus(): void {
		const sharedData = this.variableSharingService.getData();
		
		if (sharedData && sharedData.collaboratorData) {
			if (sharedData.collaboratorData.collaborator === true) {
				this.isCollaborator = true;
				this.collaboratorData = sharedData.collaboratorData;
			} else {
				this.isCollaborator = false;
				this.collaboratorData = null;
				
				if (this.isCouponValid || this.isCouponApplied) {
					this.resetCouponState();
				}
			}
		} else {
			this.isCollaborator = false;
			this.collaboratorData = null;
			
			if (this.isCouponValid || this.isCouponApplied) {
				this.resetCouponState();
			}
		}
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
        // Permitir una tolerancia de 0.01 por redondeos
        const difference = Math.abs(totalFraccionado - initialPrice);
        if (difference > 0.01) {
            this.dialogService.open(ModalSuccessComponent, {
                header: '',
                data: {
                    text: `La suma de los montos fraccionados ($ ${totalFraccionado.toFixed(2)}) no coincide con el monto inicial ($ ${initialPrice.toFixed(2)}). El descuento del cupón se aplicará al total.`,
                    title: '¡Alerta!',
                    icon: 'assets/icons/Inclub.png'
                }
            });
            return;
        }
    }
    const exchangeRate = this.exchangeType || 1;

		const paymentData: any = {
			listMethodPayment: this.listMethodPayment,
			listVochers: this.listVochersToSave,
			exchangeRate: exchangeRate,
			discountPercent: this.appliedDiscountPercent,
			discountAmount: this.discountAmount,
			isCouponValid: this.isCouponValid,
			isCouponApplied: this.isCouponApplied,
			couponCode: this.isCouponValid ? this.couponCode : null
		};

		if (this.validatedCouponId && this.isCouponValid) {
			paymentData.idCoupon = this.validatedCouponId;
			paymentData.discountMont = this.discountAmount;
			console.log('✅ Incluyendo cupón en el registro:', {
				idCoupon: this.validatedCouponId,
				discountPercent: this.appliedDiscountPercent,
				discountMont: this.discountAmount
			});
		}

		this.saveNewUser.emit(paymentData);
		
}

	private setDefaultFormData() {
		this.paymentForm.get('numberPaymentInitials').setValue(this.selectedDefaultQuote);
		this.paymentForm.get('payType').setValue(this.selectedDefaultPayType);
	}

	private getOptionInitialQuota() {
		this.modalPartnerPaymentService.getFractioninitialQuota().subscribe((opciones) => {
			this.payTypeList = opciones;
		});
	}

	public onPaypal() {
		const {
			paymentSubTypeList: [value]
		} = this.methodSelected;

		const dataToModal = {
			description: this.selectedPackageData.name,
			amount: this.getTotalAmountPaid,
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
						this.paypalData.emit(data);
						this.diablePaymentMethods = true;
						this.addPaymentMethod(3);
						this.onSubmit();
					}
				})
			)
			.subscribe();
	}

	public getPaymentType() {
		this.modalPartnerPaymentService
			.getPaymenttype()
			.pipe(
				tap((paymentTypeList) => {
					this.paymentTypeList = this.isToken? paymentTypeList.filter(items=> items.idPaymentType !== 4 || items.description !== 'WALLET'  ) : paymentTypeList;
				}),
				tap(() => {
					if (this.residenceContry) {
						this.setPaymentTypeListaFiltered(this.residenceContry);
					}
				})
			)
			.subscribe();
	}

	public getContactData() {
		this.getForm('contactData')
			.get('country')
			.valueChanges.pipe(
				filter((country) => !!country),
				tap((country: string) => (this.residenceContry = country)),
				tap((country) => this.setPaymentTypeListaFiltered(country))
			)
			.subscribe();
	}

	private setPaymentTypeListaFiltered(country: string) {
		this.paymentTypeListaFiltered = getPaymentListByContry(
			this.paymentTypeList,
			country,
			this.walletBlock
		);
	}

	public getForm(form: string) {
		return this.presenter.multiStepForm.controls[form];
	}

	public onMedioPago(methodSelected) {
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

		this.methodSelected = methodSelected;

		this.onChangeIsPayLater();
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

	public onChangeIsPayLater() {
		const isChecked = this.paymentForm.get('isPayLater')?.value;
		const emailControl = this.paymentForm.get('email');

		if (isChecked) {
			emailControl?.enable();
			this.diablePaymentMethods = true;
		} else {
			emailControl?.disable();
			emailControl?.setValue('');
			this.diablePaymentMethods = false;
		}
	}

	public get totalAmount() {
		return this.payFeePresenter.paymentForm.get('totalAmount')?.value || 0;
	}

	public openModalWallet(voucher = null): void {
		const { packageDetailId } = this.getForm('packageData').value;

		if (!packageDetailId) {
			this.dialogService.open(ModalSuccessComponent, {
				header: '',
				data: {
					text: 'Debe seleccionar un paquete de suscripción',
					title: '¡Alerta!',
					icon: 'assets/icons/Inclub.png'
				}
			});
			return;
		}

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
	ensureNotEmpty(event: Event): void {
		const input = event.target as HTMLInputElement;

		if (input.value === '') {
			input.value = '0';
		}

		if (/^0\d+/.test(input.value)) {
			input.value = '0';
		}
	}

	public get amount1Value() {
		const control = this.getForm('paymentData').get('amount1');
		return control ? control.value : 0;
	}
	public openPaymentBank() {
		const { packageDetailId } = this.getForm('packageData').value;

		if (packageDetailId) {
			const listCurrencies = this.operationCurrency.filter((currency) =>
				GetCurrenciesByCountry(this.residenceContry).includes(currency.value)
			);
			console.log("registrovoucherToEdit",this.voucherToEdit)
			this.dialogService
				.open(ModalPaymentBankContainer, {
					header: `Pago en efectivo a través de ${
						this.voucherToEdit?.methodSelected?.description || this.methodSelected?.description
					}`,
					data: {
						methodSelected: this.voucherToEdit?.methodSelected || this.methodSelected,
						exchangeType: this.exchangeType,
						operationCurrency: listCurrencies,
						totalAmountPaid: this.getTotalAmountPaid,
						voucherToEdit: this.voucherToEdit,
						indexEdit: this.indexEdit
					},
					styleClass: 'custom-modal-css',
					width: '40%'
				})
				.onClose.subscribe((data) => {
					if (data && data.listaVouches && data.listaVouches.length > 0) {
						this.paymentForm.get('email').setValue('');
						this.paymentForm.get('email').disable();
						this.paymentForm.get('isPayLater').setValue(false);
						if (data.indexEdit !== null && data.indexEdit !== undefined) {
							const updatedVouchers = data.listaVouches.map((voucher) => ({
								...voucher,
								methodSelected:
									voucher.methodSelected ||
									this.listVochersToSave[data.indexEdit]?.methodSelected ||
									this.methodSelected
							}));
							this.listVochersToSave.splice(data.indexEdit, 1, ...updatedVouchers);
						} else {
							const newVouchers = data.listaVouches.map((voucher) => ({
								...voucher,
								methodSelected: voucher.methodSelected || this.methodSelected
							}));
							this.listVochersToSave.push(...newVouchers);
						}
						this.addPaymentMethod(2);
					}
				});
		} else {
			this.dialogService.open(ModalSuccessComponent, {
				header: '',
				data: {
					text: 'Debe seleccionar un paquete de suscripción.',
					title: '¡Alerta!',
					icon: 'assets/icons/Inclub.png'
				}
			});
		}
	}

	public get dataTableToShow() {
		// Mostrar todos los vouchers incluyendo cupones
		return [
			...this.listVochersToSave.map((voucher) => {
				voucher.bankName = voucher.methodSelected
					? voucher.methodSelected.description
					: this.methodSelected?.description || 'N/A';

				voucher.comision = voucher?.comision ? voucher.comision : '-';
				voucher.img = voucher.imagen ? ImagenData(voucher.imagen.file) : '-';
				voucher.operationDescription = voucher?.operationDescription
					? voucher.operationDescription
					: '-';
				return voucher;
			})
		];
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


	private addCouponAsPaymentMethod(): void {
		// ✅ Agregar cupón a la lista para visualización
		// ⚠️ IMPORTANTE: El cupón SÍ se muestra pero NO se suma en validaciones
		
		const couponVoucher = {
			paymentMethod: 'coupon',
			bankName: 'Cupón de Descuento',
			operationNumber: this.couponCode,
			operationDescription: `Descuento del ${this.appliedDiscountPercent}%`,
			note: `Cupón: ${this.couponCode}`,
			currency: 1,
			idPaymentCoinCurrency: 1,
			currencyDescription: 'Dólar',
			totalAmount: this.discountAmount,
			comision: 0,
			imagen: null,
			img: '-',
			methodSelected: {
				idPaymentType: 5,
				description: 'CUPÓN',
				pathPicture: 'assets/icons/coupon-icon.png'
			},
			idCoupon: this.validatedCouponId,
			discountPercent: this.appliedDiscountPercent
		};

		// Eliminar cupón anterior si existe
		const existingCouponIndex = this.listVochersToSave.findIndex(
			v => v.paymentMethod === 'coupon'
		);

		if (existingCouponIndex !== -1) {
			this.listVochersToSave[existingCouponIndex] = couponVoucher;
		} else {
			this.listVochersToSave.push(couponVoucher);
		}

		this.listVochersToSave = [...this.listVochersToSave];
		
	}

	private getCurrencyList() {
		this.modalPaymentService
			.getCurrency()
			.pipe(tap((monedas) => (this.operationCurrency = monedas)))
			.subscribe();
	}

	private getTC() {
		this.modalPaymentService.getTipoCambio().subscribe((exchangeType) => {
			this.exchangeType = exchangeType.sale;
		});
	}

	get pkgDetail() {
		return this.selectedPackageService.selectedPackageDetail;
	}

	get selectedPackageData() {
		return this.selectedPackageService.selectedPackage;
	}

	public get paymentForm() {
		return this.getForm('paymentData');
	}

	public get pruebaIsFractional() {
		return this.pkgDetail?.isSpecialFractional || this.pkgDetail?.numberInitialQuote > 1;
	}
//pocheti estuvo aqui
private changePackageSelection() {
    this.selectedPackageService
        .getSelectedPackageDetailData$()
        .pipe(
            takeUntil(this.destroy$),
            filter((detail) => !!detail),
            tap((detail) => {
				if (this.lastPackageId !== null && this.lastPackageId !== detail.idPackage) {
					this.clearPreviousPackageState();
				}
				
				this.lastPackageId = detail.idPackage;
				
                this.paymentForm
                    .get('totalNumberPaymentPaid')
                    .setValue(this.selectedDefaultTotalNumberPaymentPaid);
                this.paymentForm.get('payType').setValue(this.selectedDefaultPayType);
                this.paymentForm.get('numberPaymentInitials').disable();
                this.paymentForm.get('numberPaymentInitials').setValue(this.selectedDefaultQuote);

                const isPayLaterControl = this.paymentForm.get('isPayLater');
                isPayLaterControl.setValue(false);

                this.paymentForm.get('email').disable();

				this.packageId= detail.idPackage;

                this.updateCollaboratorStatus();

                this.manageQuotesAmounts(detail, this.selectedDefaultQuote);
            })
        )
        .subscribe();
		
}

	private manageQuotesAmounts(detail, quotesNumber) {
		if (detail && (detail?.isSpecialFractional || detail?.numberInitialQuote > 1)) {
			this.cleanAndDisableQuotesAmount();
			this.setAndAbleQuotesAmount(quotesNumber, this.quoteAmount(quotesNumber));
		}
	}

	private quoteAmount(quotesNumber: number) {
		const initialPrice = parseFloat(this.pkgDetail?.initialPrice || '0');
		return initialPrice / quotesNumber;
	}

	private cleanAndDisableQuotesAmount() {
		for (let i = 1; i <= this.pkgDetail?.numberInitialQuote; i++) {
			const control = this.paymentForm.get(`amount${i}`);
			if (control) {
				control.setValue(0);
				control.disable();
			}
		}
	}

	private setAndAbleQuotesAmount(quotesNumber: number, quoteAmount: number) {
		for (let i = 1; i <= 3; i++) {
			const control = this.paymentForm.get(`amount${i}`);
			if (!control) continue;
			
			if (i <= quotesNumber) {
				control.setValue(quoteAmount);

				if (this.paymentForm.get('payType').value === 2) {
					control.disable();
				} else {
					control.disable();
				}
			} else {
				control.setValue(0);
				control.disable();
			}
		}
	}

		public changeSelectionNumberQuotes({ value }) {
			this.selectedNumberQuotes = value;
			const detail = this.selectedPackageService.selectedPackageDetail;
			this.manageQuotesAmounts(detail, value);
			const totalNumberPaymentPaidControl = this.paymentForm.get(`totalNumberPaymentPaid`);
			if (value > 1) {
				totalNumberPaymentPaidControl.disable();
				totalNumberPaymentPaidControl.setValue(0);
			} else {
				totalNumberPaymentPaidControl.enable();
			}
			
			// 🔧 Recalcular descuento del cupón si está aplicado
			if (this.isCouponValid && this.appliedDiscountPercent > 0) {
				this.recalculateCouponDiscount();
			}
			/* 		this.setAmountPaid(); */
		}

		public getListNumberQuotes(numberQuotes: number) {
			const quotes = [];
			for (let i = 1; i <= numberQuotes; i++) {
				quotes.push({ value: i, content: `Inicial ${i}` });
			}
			return quotes;
		}

		    get initialPriceWithDiscount(): number {
		const initialPrice = parseFloat(this.pkgDetail?.initialPrice || '0');
		if (this.isCouponValid && this.discountAmount > 0) {
			return initialPrice - this.discountAmount;
		}
		return initialPrice;
	}

	get discountedQuotaPrice(): number {
		const quotaPrice = parseFloat(this.pkgDetail?.quotaPrice || '0');
		return quotaPrice;
	}

	get initialDisplayAmount(): number {
		const payTypeControl = this.paymentForm.get('payType');
		const amount1Control = this.paymentForm.get('amount1');
		
		if (payTypeControl && amount1Control && payTypeControl.value === 2 && amount1Control.value > 0) {
			return amount1Control.value;
		}
		return this.initialPriceWithDiscount;
	}
	
	public onChangeSelectionPayType(option: number) {
		this.paymentForm.get('numberPaymentInitials').setValue(this.selectedDefaultQuote);
		this.cleanAndDisableQuotesAmount();
		const isPayLaterControl = this.paymentForm.get('isPayLater');

		if (option === 1) {
			isPayLaterControl.setValue(false);
			this.diablePaymentMethods = false;
			this.paymentForm.get('numberPaymentInitials').disable();
			this.paymentForm.get('totalNumberPaymentPaid').enable();
			this.setAndAbleQuotesAmount(
				this.selectedDefaultQuote,
				this.quoteAmount(this.selectedDefaultQuote)
			);
			this.selectedNumberQuotes = 1;
		} else if (option === 2) {
			if (this.listVochersToSave.length === 0) {
				isPayLaterControl.enable();
			}
			this.diablePaymentMethods = false;
			this.paymentForm.get('numberPaymentInitials').enable();
			this.setAndAbleQuotesAmount(
				this.selectedDefaultQuote,
				this.quoteAmount(this.selectedDefaultQuote)
			);
			this.selectedNumberQuotes = this.paymentForm.get('numberPaymentInitials').value;
		}
		
		// 🔧 Recalcular descuento del cupón cuando cambia el tipo de pago
		if (this.isCouponValid && this.appliedDiscountPercent > 0) {
			this.recalculateCouponDiscount();
		}
	}

	get getTotalAmountPaid(): number {
		const initialPrice = parseFloat(this.pkgDetail?.initialPrice || '0');
		let totalAmountPaid = this.pruebaIsFractional
			? this.amount1Value + parseFloat(this.getAmountPaid)
			: parseFloat(this.getAmountPaid) + initialPrice;

		const totalWithoutDiscount = totalAmountPaid;

		if (this.isCouponValid && this.discountAmount > 0) {
			totalAmountPaid = Math.max(0, totalAmountPaid - this.discountAmount);
		}

		this.paymentForm.get('amountPaid').setValue(totalWithoutDiscount);
		return totalAmountPaid;
	}		    public get getAmountPaid() {
        let { value } = this.paymentForm.get('totalNumberPaymentPaid');
        if (value > this.pkgDetail?.numberQuotas) {
            value = this.pkgDetail.numberQuotas;
            this.paymentForm.get('totalNumberPaymentPaid')?.setValue(value);
        }
        const amountPaid = (this.discountedQuotaPrice * value).toFixed(2);
        return amountPaid;
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
			this.listVochersToSave.splice(index, 1);

			this.listMethodPayment = this.listVochersToSave.map((voucher) =>
				voucher.paymentMethod === 'wallet' ? 4 : 2
			);
		}

		ngOnDestroy(): void {
			this.destroy$.next();
			this.destroy$.complete();
		}

		public onCouponCheckboxChange(): void {
		if (!this.showCouponInput) {
			this.appliedDiscountPercent = 0;
			this.discountAmount = 0;
			this.couponCode = '';
			this.couponError = '';
			this.isCouponValid = false;
			this.isCouponApplied = false;
			this.isValidatingCoupon = false;
			this.isApplyingCoupon = false;
		}
	}

	public validateCoupon(): void {
		const couponCode = this.couponCode.trim();
		
		if (!couponCode) {
			this.couponError = 'Por favor ingresa un código de cupón';
			return;
		}

		this.isValidatingCoupon = true;
		this.couponError = '';
		this.isCouponValid = false;
		this.modalPartnerPaymentService.searchCouponByCode(couponCode).subscribe({
			next: (response) => {
				this.isValidatingCoupon = false;

				if (!response.found) {
					this.couponError = 'Cupón no encontrado';
					
					this.dialogService.open(ModalAlertComponent, {
						header: '',
						data: {
							message: `El cupón "${couponCode}" no existe en el sistema.`,
							title: 'Cupón No Encontrado',
							icon: 'pi pi-exclamation-triangle'
						}
					});
					return;
				}

				if (!response.state) {
					this.couponError = 'Este cupón está inactivo';
					
					this.dialogService.open(ModalAlertComponent, {
						header: '',
						data: {
							message: `El cupón "${couponCode}" no está activo actualmente.`,
							title: 'Cupón Inactivo',
							icon: 'pi pi-exclamation-triangle'
						}
					});
					return;
				}

		this.isCouponValid = true;
		this.couponError = '';
		this.appliedDiscountPercent = response.discountPercentage || 0;
		this.validatedCouponId = response.idCoupon;
		
		// 🔧 CORRECCIÓN: Calcular descuento según el fraccionamiento
		const initialPrice = parseFloat(this.pkgDetail?.initialPrice || '0');
		const selectedQuotes = this.paymentForm.get('numberPaymentInitials')?.value || 1;
		const payType = this.paymentForm.get('payType')?.value || 1;
		
		// Si está en modo "Fraccionar pago" (payType === 2) y tiene fraccionamiento
		let baseAmountForDiscount = initialPrice;
		if (payType === 2 && selectedQuotes > 1) {
			// El descuento se aplica sobre el monto de cada cuota, no sobre el total
			baseAmountForDiscount = initialPrice / selectedQuotes;
			console.log(`📊 Aplicando descuento sobre cuota fraccionada: $${initialPrice} / ${selectedQuotes} = $${baseAmountForDiscount}`);
		}
		
		this.discountAmount = +(baseAmountForDiscount * (this.appliedDiscountPercent / 100)).toFixed(2);
		
		console.log(`💰 Cálculo de descuento:`, {
			precioInicial: initialPrice,
			cuotasSeleccionadas: selectedQuotes,
			tipoPago: payType === 1 ? 'Contado' : 'Fraccionado',
			baseParaDescuento: baseAmountForDiscount,
			porcentajeDescuento: this.appliedDiscountPercent + '%',
			montoDescuento: this.discountAmount
		});
		
		this.addCouponAsPaymentMethod();			this.dialogService.open(ModalSuccessComponent, {
				header: '',
				width: '40%',
				data: {
					text: `¡Cupón "${couponCode}" aplicado! Descuento del ${this.appliedDiscountPercent}% ($${this.discountAmount}) agregado como método de pago.`,
					title: '¡Cupón Aplicado!',
					icon: 'check_circle_outline'
				}
			});				console.log('✅ Cupón validado - Se aplicará al registrar:', {
					codigo: couponCode,
					idCoupon: response.idCoupon,
					descuento: this.appliedDiscountPercent + '%',
					montoDescuento: this.discountAmount
				});
			},
			error: (err) => {
				console.error('❌ Error al buscar cupón:', err);
				this.isValidatingCoupon = false;
				this.isCouponValid = false;
				this.appliedDiscountPercent = 0;
				this.discountAmount = 0;

				this.couponError = 'Error al buscar el cupón';

				this.dialogService.open(ModalAlertComponent, {
					header: '',
					data: {
						message: 'No se pudo conectar con el servidor. Verifica tu conexión e intenta nuevamente.',
						title: 'Error de Conexión',
						icon: 'pi pi-times-circle'
					}
				});
			}
		});
	}

	/**
	 * Recalcula el descuento del cupón cuando cambia el número de cuotas
	 */
	private recalculateCouponDiscount(): void {
		if (!this.isCouponValid || this.appliedDiscountPercent === 0) {
			return;
		}

		const initialPrice = parseFloat(this.pkgDetail?.initialPrice || '0');
		const selectedQuotes = this.paymentForm.get('numberPaymentInitials')?.value || 1;
		const payType = this.paymentForm.get('payType')?.value || 1;
		
		let baseAmountForDiscount = initialPrice;
		if (payType === 2 && selectedQuotes > 1) {
			baseAmountForDiscount = initialPrice / selectedQuotes;
		}
		
		this.discountAmount = +(baseAmountForDiscount * (this.appliedDiscountPercent / 100)).toFixed(2);
		
		// Actualizar el voucher del cupón en la lista
		const couponIndex = this.listVochersToSave.findIndex(v => v.paymentMethod === 'coupon');
		if (couponIndex !== -1) {
			this.listVochersToSave[couponIndex].totalAmount = this.discountAmount;
			this.listVochersToSave[couponIndex].operationDescription = `Descuento del ${this.appliedDiscountPercent}%`;
			this.listVochersToSave = [...this.listVochersToSave]; // Forzar detección de cambios
		}
		
		console.log(`🔄 Descuento recalculado:`, {
			cuotasSeleccionadas: selectedQuotes,
			baseParaDescuento: baseAmountForDiscount,
			nuevoMontoDescuento: this.discountAmount
		});
	}

	public resetCouponState(): void {
		this.couponCode = '';
		this.couponError = '';
		this.isCouponValid = false;
		this.isCouponApplied = false;
		this.isValidatingCoupon = false;
		this.isApplyingCoupon = false;
		this.appliedDiscountPercent = 0;
		this.discountAmount = 0;
		this.showCouponSuccess = false;
		this.validatedCouponId = null;
		
		const couponIndex = this.listVochersToSave.findIndex(v => v.paymentMethod === 'coupon');
		if (couponIndex !== -1) {
			this.listVochersToSave.splice(couponIndex, 1);
			this.listVochersToSave = [...this.listVochersToSave];
		}
		
	}

	private clearPreviousPackageState(): void {
		
		this.listVochersToSave = [];
		this.listVochersToShow = [];
		this.listVochersToEdit = [];
		this.listMethodPayment = [];
		
		this.methodSelected = null;
		this.indexEdit = null;
		this.voucherToEdit = null;
		
		this.resetCouponState();
		
		for (let i = 1; i <= 3; i++) {
			const control = this.paymentForm.get(`amount${i}`);
			if (control) {
				control.setValue(0);
				control.disable();
			}
		}
		
		this.paymentForm.get('totalNumberPaymentPaid')?.setValue(0);
		this.paymentForm.get('isPayLater')?.setValue(false);
		this.paymentForm.get('email')?.setValue('');
		this.paymentForm.get('email')?.disable();
		this.diablePaymentMethods = false;
		this.selectedNumberQuotes = null;
		
	}

	public onGoBack(): void {
		this.prevState.emit();
	}

	public canProceedWithPayment(): boolean {
		const payType = this.paymentForm.get('payType').value;
		
		if (payType === 3) {
			return this.isCouponValid && this.isCouponApplied;
		}
		
		return true;
	}
}