import { CommonModule, Location } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { CheckboxComponent } from '@shared/components/form-control/checkbox/checkbox.component';
import { InputComponent } from '@shared/components/form-control/input/input.component';
import RadiosComponent from '@shared/components/form-control/radios/radios.component';
import { SelectComponent } from '@shared/components/form-control/select/select.component';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { MessagesModule } from 'primeng/messages';
import { TableModule } from 'primeng/table';
import { userMockData } from '../commons/mocks/mock';
import { TablePaymentLaterComponent } from '../commons/components/table-payment-later/table-payment-later.component';
import { ButtonModule } from 'primeng/button';
import { ModalPartnerPaymentService } from 'src/app/profiles/pages/ambassador/pages/new-partner/pages/new-partner-payment/servicio/new-partner-payment.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ModalPaymentService } from 'src/app/profiles/pages/ambassador/pages/new-partner/pages/new-partner-payment/commons/sevices/modal-payment.service';
import { SelectedPackageService } from 'src/app/profiles/pages/ambassador/pages/new-partner/commons/services/package-detail.service';
import { catchError, delay, finalize, of, Subject, tap, throwError } from 'rxjs';
import { PaymentType } from 'src/app/profiles/pages/ambassador/pages/new-partner/pages/new-partner-payment/commons/enums';
import { AuthenticationService } from '@shared/services';
import { ModalPaymentBankContainer } from 'src/app/profiles/pages/ambassador/pages/new-partner/pages/new-partner-payment/commons/modals/modal-payment-bank/modal-payment-bank.container';
import { ModalPaymentPaypalComponent } from 'src/app/profiles/pages/ambassador/pages/new-partner/pages/new-partner-payment/commons/modals/modal-payment-paypal/modal-payment-paypal.component';
import { IPaypalData } from 'src/app/profiles/pages/ambassador/pages/new-partner/commons/interfaces/new-partner.interface';
import { ImagenData } from '@shared/constants';
import { GetListVouchersToSave } from 'src/app/profiles/pages/ambassador/pages/new-partner/pages/new-partner-payment/commons/contants/list-vouchers-to-save';
import { PaymentLaterService } from '../commons/services/payment-later.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NewPartnerSelectPackageService } from 'src/app/profiles/pages/ambassador/pages/new-partner/pages/new-partner-select-package/commons/service/new-partner-select-package.service';
import { IPaymentLater, PackageDetail } from '../commons/interfaces/payment-later.interface';
import {
	GetCurrenciesByCountry,
	getPaymentListByContry
} from 'src/app/profiles/pages/ambassador/pages/new-partner/pages/new-partner-payment/commons/contants';
import { ISelect } from '@shared/interfaces/forms-control';
import { ModalSuccessComponent } from 'src/app/profiles/commons/modals/modal-success/modal-success.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ModalErrorComponent } from '@shared/components/modal/modal-error/modal-error.component';
import { ModalLoadingComponent } from '@shared/components/modal/modal-loading/modal-loading.component';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { ModalPayFeeComponent } from 'src/app/profiles/pages/partner/pages/my-products/commons/modals/modal-pay-fee/modal-pay-fee';
import { CurrencyType } from 'src/app/profiles/commons/enums';
import {
	isEqualToTotalToPaid,
	normalizeAmount
} from 'src/app/profiles/pages/ambassador/pages/new-partner/commons/constants';

@Component({
	selector: 'app-payment-later',
	standalone: true,
	imports: [
		CommonModule,
		MatIconModule,
		ReactiveFormsModule,
		CheckboxComponent,
		InputComponent,
		DialogModule,
		TableModule,
		DividerModule,
		MessagesModule,
		InputNumberModule,
		SelectComponent,
		CardModule,
		DropdownModule,
		RadiosComponent,
		ButtonModule,
		TablePaymentLaterComponent,
		ProgressSpinnerModule,
		ModalErrorComponent,
		ModalComponent,
		ModalSuccessComponent,
		ModalLoadingComponent
	],
	templateUrl: './payment-later.component.html',
	providers: [DialogService],
	styleUrls: []
})
export default class PaymentLaterComponent implements OnInit {
	dialogRef: DynamicDialogRef;
	public packages = userMockData;
	public familyPackageData: any;
	public form: FormGroup;
	public paymentTypeListaFiltered: any;
	public paymentTypeList: any;
	public tableData: IPaymentLater[] = [];
	public dataToken: any;
	public isLoading: boolean = false;
	public isLoadingTable: boolean = false;
	public isLoadingToken: boolean = false;
	public residenceContry: number;
	public exchangeType: number;
	public operationCurrency: ISelect[];
	public idPackageDetail: number;
	public descriptionPackageDetail: string;
	public idPayment: number;
	public numberPaymentInitials: number;
	public userId: string;
	public isPagarLater: boolean;
	isWalletAllowed: boolean = false;
	public showWalletMethod: boolean = false;
	isLoadingCode = false;

	methodSelected: any;
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
	payloadToSave: any;
	diablePaymentMethods = false;
	dataValidate: any;

	tokenError: boolean = false;
	pagePayError: boolean = false;
	hasError: boolean = false;

	constructor(
		private modalPartnerPaymentService: ModalPartnerPaymentService,
		private dialogService: DialogService,
		private paymentLaterService: PaymentLaterService,
		private location: Location,
		private modalPaymentService: ModalPaymentService,
		private route: ActivatedRoute,
		private router: Router,
		private cdr: ChangeDetectorRef,
		private fb: FormBuilder
	) {}

	ngOnInit() {
		this.route.queryParams.subscribe((params) => {
			const token = params['token'];
			if (token) {
				this.dataToken = token;
				this.getValidateToken(this.dataToken);
			}
		});
		this.form = this.fb.group({
			codigo: [null, [Validators.required]]
		});
	}

	public getValidateToken(token: string): void {
		this.isLoadingTable = true;
		this.isLoadingToken = true;
		this.paymentLaterService.getValitateToken(token).subscribe({
			next: (data) => {
				this.isWalletAllowed = data.isPayLatter;
				this.showWalletMethod = !this.isWalletAllowed;
				this.userId = data.idUserPay;
				let totalAmount = data.totalAmount;
				this.getSuscription(data.idUserPay, totalAmount);
				this.residenceContry = Number(data.idResidenceCountry);
				this.idPayment = data.idPayment;

				this.getPaymentType();
				this.isLoadingToken = false;
			},
			error: (error) => {
				if (
					error.status === 404 &&
					error.error?.apierror?.message === 'The payment has already been made'
				) {
					this.pagePayError = true;
					this.isLoadingToken = false;
					this.isLoadingTable = false;
					this.tokenError = false;
				} else if (
					error.status === 404 &&
					error.error?.apierror?.message === 'The token is not valid or does not exist'
				) {
					this.tokenError = true;
					this.isLoadingToken = false;
					this.isLoadingTable = false;
					this.pagePayError = false;
				} else {
					console.error('Error Data Token:', error);
					this.hasError = true;
					this.isLoadingToken = false;
					this.isLoadingTable = false;
					this.tokenError = false;
					this.pagePayError = false;
				}
			}
		});
	}

	public getSuscription(id: number, totalAmount: number): void {
		this.paymentLaterService.getSuscription(id).subscribe({
			next: (data) => {
				if (data.length > 0) {
					const subscription = data[0];
					this.idPackageDetail = subscription.idPackageDetail;
					this.descriptionPackageDetail = subscription.nameSuscription;
					this.getPackageDetailById(
						subscription.idPackageDetail,
						subscription.nameSuscription,
						totalAmount
					);
					this.getCurrencyList();
					this.getTC();
				} else {
					console.error('No data found for subscription');
				}
			},
			error: (error) => {
				console.error('Error Data Suscription:', error);
				this.isLoadingTable = false;
			}
		});
	}

	public getPackageDetailById(id: number, nameSuscription: string, totalAmount: number): void {
		this.isLoadingTable = true;
		this.paymentLaterService.getPackageById(id).subscribe({
			next: (data: PackageDetail | PackageDetail[]) => {
				if (Array.isArray(data)) {
					data = data[0];
				}
				if (data) {
					this.tableData = [
						{
							description: nameSuscription,
							quotas: data.numberQuotas,
							duration: data.monthsDuration,
							price: data.price,
							initialPrice: totalAmount
						}
					];
					this.totalAmountPaid = totalAmount;
					this.numberPaymentInitials = data.numberInitialQuote;
				} else {
					console.error('No package data found');
				}
				this.isLoadingTable = false;
			},
			error: (error) => {
				console.error('Error fetching package detail:', error);
				this.isLoadingTable = false;
			}
		});
	}

	public getPaymentType(): void {
		this.isLoading = true;
		this.modalPartnerPaymentService
			.getPaymenttype()
			.pipe(
				tap((data) => {
					this.paymentTypeList = data;
					this.paymentTypeList = this.showWalletMethod
						? data
						: data.filter((payment) => payment.idPaymentType !== 4);
					this.getCountry();
				}),
				finalize(() => (this.isLoading = false))
			)
			.subscribe();
	}

	public getCountry(): void {
		if (this.residenceContry) {
			const country = this.residenceContry;
			let filteredList = getPaymentListByContry(this.paymentTypeList, country);
			this.paymentTypeListaFiltered = filteredList;
		}
	}

	public onMedioPago(methodSelected) {
		this.methodSelected = methodSelected;
		switch (methodSelected.description) {
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
			case PaymentType.WALLET:
				this.openModalWallet();
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
		const userId = this.userId;
		this.dialogRef = this.dialogService.open(ModalPayFeeComponent, {
			header: 'Mi Wallet',
			width: '35%',
			data: {
				isWallet: true,
				methodSelected: this.methodSelected,
				operationCurrency: [dolaresCurrency],
				totalAmountPaid: this.totalAmountPaid,
				voucherToEdit: voucher,
				userId: userId,
				isPagarLater: true
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

			if (!this.payloadToSave) {
				this.payloadToSave = {};
			}

			this.payloadToSave.walletTransaction = {
				amount: walletVoucher.totalAmount
			};

			const totalAmountPaid = this.totalAmountPaid;
			if (walletVoucher.totalAmount === totalAmountPaid) {
				this.addPaymentMethod(4);
				this.onSubmit();
				return;
			}

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
		}
	}

	public openPaymentBank(): void {
		const packageDetailId = this.idPackageDetail;
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
					packageDetailId: packageDetailId,
					operationCurrency: listCurrencies,
					totalAmountPaid: this.totalAmountPaid,
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

	private totalPretendToPay(newListToAdd: any): number {
		if (!newListToAdd || !newListToAdd.listaVouches || !Array.isArray(newListToAdd.listaVouches)) {
			return this.listVochersToSave.reduce((sum, voucher) => {
				const totalAmountAfterCommission = this.convertToDollarIfNecessary(voucher);
				return sum + totalAmountAfterCommission;
			}, 0);
		}

		let listaVouches = [...this.listVochersToSave];
		if (this.indexEdit !== null) {
			listaVouches[this.indexEdit] = newListToAdd.listaVouches[0];
			const remainingVouchers = newListToAdd.listaVouches.slice(1);
			listaVouches.push(...remainingVouchers);
		} else {
			listaVouches = [...listaVouches, ...newListToAdd.listaVouches];
		}

		const newTotal = listaVouches.reduce((sum, voucher) => {
			const totalAmountAfterCommission = this.convertToDollarIfNecessary(voucher);
			return sum + totalAmountAfterCommission;
		}, 0);

		return newTotal;
	}

	private convertToDollarIfNecessary(voucher: any): number {
		const totalAmount = Number(voucher.totalAmount);
		const commission = Number(voucher.comision || 0);
		if (voucher.currency === 2) {
			const exchangeRate = this.exchangeType || 1;
			return (totalAmount - commission) / exchangeRate;
		} else if (voucher.currency === 1) {
			return totalAmount - commission;
		} else {
			return totalAmount - commission;
		}
	}

	public get totalInTable(): number {
		return this.listVochersToShow.reduce((sum, voucher) => {
			return Number(sum) + Number(voucher.totalAmount);
		}, 0);
	}

	private payload(): any {
		let idTypeMethodPayment = null;
		let uniqueArray = Array.from(new Set(this.listMethodPayment));

		if (uniqueArray.length > 1) {
			idTypeMethodPayment = 1;
		} else {
			[idTypeMethodPayment] = uniqueArray;
		}
		const payload = {
			idPayment: this.idPayment,
			idUserPayment: this.userId,
			typeMethodPayment: idTypeMethodPayment,
			amountPaidPayment: this.totalAmountPaid,
			applyGracePeriod: 0,
			idPackage: this.idPackageDetail,
			numberPaymentInitials: this.numberPaymentInitials,
			numberAdvancePaymentPaid: 0,
			paypalDTO: {}
		};

		return payload;
	}

	public onSubmit(): void {
		this.payloadToSave = {
			...this.payload(),
			listaVouches:
				this.payloadToSave?.listaVouches
					?.filter((voucher) => voucher.paymentMethod !== 'wallet')
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
			paypalDTO: this.payloadToSave?.paypalDTO || null
		};

		if (
			(!this.payloadToSave.listaVouches || this.payloadToSave.listaVouches.length === 0) &&
			!this.payloadToSave.paypalDTO &&
			!this.payloadToSave.walletTransaction
		) {
			alert('Debe registrar un pago');
			return;
		}
		const exchangeRate = this.exchangeType;
		const totalComision = (this.dataTableToShow || []).reduce((sum, item) => {
			const comisionValue = item.comision ? parseFloat(item.comision) : 0;
			const comisionEnDolares = item.currency === 2 ? comisionValue / exchangeRate : comisionValue;
			return Math.round((sum + comisionEnDolares) * 100) / 100;
		}, 0);

		const amountToCompare = (this.payloadToSave.amountPaidPayment || 0) + (totalComision || 0);

		const isTotalValid = isEqualToTotalToPaid(
			this.payloadToSave.listaVouches,
			this.payloadToSave.walletTransaction?.amount,
			amountToCompare,
			exchangeRate
		);

		if (!isTotalValid && !this.payloadToSave.paypalDTO) {
			alert('El monto ingresado no coincide con el total a pagar');
			return;
		}

		const loadingRef = this.dialogService.open(ModalLoadingComponent, {
			header: 'Cargando',
			closable: false
		});

		this.isLoading = true;
		this.paymentLaterService
			.postPay(this.payloadToSave)
			.pipe(
				tap(() => {
					loadingRef.close();
					const ref = this.dialogService.open(ModalSuccessComponent, {
						header: '',
						data: {
							text: 'Tu pago fue registrado con éxito.',
							title: '¡Éxito!',
							icon: 'assets/icons/Inclub.png'
						}
					});
					ref.onClose.subscribe(() => {
						this.location.back();
						setTimeout(() => {
							window.location.reload();
						}, 1000);
					});

					/* setTimeout(() => {
						ref.close();
						this.location.back();
						setTimeout(() => {
							window.location.reload();
						}, 1000);
					}, 2000); */
				}),
				catchError((error) => {
					console.error('Error al procesar el pago:', error);
					loadingRef.close();
					alert('Ocurrió un error al procesar el pago. Por favor, intenta nuevamente.');
					return throwError(() => error);
				}),
				finalize(() => {
					this.isLoading = false;
				})
			)
			.subscribe();
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

	/* 	private showModalWithDelay(message: string, title: string) {
		const ref = this.dialogService.open(ModalErrorComponent, {
			header: '',
			data: {
				text: message,
				title: title
			}
		});

		setTimeout(() => {
			ref.close();
			this.location.back();
		}, 2000);
	} */

	private showModalWithDelay(message: string, title: string) {
		const ref = this.dialogService.open(ModalErrorComponent, {
			header: title,
			data: {
				text: message,
				title: title
			},
			width: '35%'
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

	getListVochersToShow(data): Array<any> {
		return data.listaVouches
			.map((voucher) => {
				if (!voucher) {
					console.warn('Skipping Invalid Voucher:', voucher);
					return null;
				}

				voucher.bankName = voucher.methodSelected
					? voucher.methodSelected.description
					: this.methodSelected?.description || '-';

				voucher.currencyDescription = data.currencyDescription;
				voucher.img = voucher.imagen ? ImagenData(voucher.imagen.file) : '-';
				voucher.operationDescription = voucher?.operationDescription || '-';
				return voucher;
			})
			.filter((voucher) => voucher !== null);
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

	public onPaypal() {
		const {
			paymentSubTypeList: [value]
		} = this.methodSelected;

		const dataToModal = {
			description: this.descriptionPackageDetail,
			amount: this.totalAmountPaid,
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
							...this.payload(),
							paypalDTO: {
								nroOperation: data.operationNumber,
								currencyId: data.typeCurrency
							}
						};
						this.diablePaymentMethods = true;
						this.onSubmit();
					}
				})
			)
			.subscribe();
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

	public goHome() {
		this.router.navigate(['/backoffice/home']);
	}

	validarCodigo() {
		const codigo = this.form.get('codigo').value;
		if (this.form.valid) {
			this.isLoadingCode = true;
			this.paymentLaterService.validateCode(codigo).subscribe({
				next: (response) => {
					this.isLoadingCode = false;
					if (response.result === true && response.data === true) {
						this.showWalletMethod = true;
						this.getPaymentType();
					} else {
						this.showWalletMethod = false;
						this.showModalWithDelay(
							'Código invalido',
							'El código ingresado no es válido. Por favor, verifica e ingresa un código correcto.'
						);
						this.form.get('codigo').setValue(null);
					}
				},
				error: (error) => {
					this.isLoadingCode = false;

					console.error('Error al validar el código:', error);
					this.showModalWithDelay(
						'',
						'No pudimos procesar tu solicitud en este momento. Por favor, intenta nuevamente en unos minutos.'
					);
				}
			});
		}
	}
}
