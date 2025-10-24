import {
	Component,
	EventEmitter,
	inject,
	Output,
	NgZone,
	ViewChild,
	TemplateRef,
	ChangeDetectorRef
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule, DatePipe } from '@angular/common';
import { NavigationComponent } from '@shared/components/navigation/navigation.component';
import { ModalSuccessComponent } from 'src/app/profiles/commons/modals/modal-success/modal-success.component';
import { StepsNavigation } from './commons/mock/mock';
import { NewPartnerSelectPackageComponent } from './pages/new-partner-select-package/new-partner-select-package.component';
import { NewPartnerPaymentComponent } from './pages/new-partner-payment/new-partner-payment.component';
import { NewPartnerAssignGodfatherComponent } from './pages/new-partner-assign-godfather/new-partner-assign-godfather.component';
import { NewPartnerFormPresenter } from './new-partner.presenter';
import { NewPartnerService } from './commons/services/new-partner.service';
import { NewPartnerContactInfoContainer } from './pages/new-partner-contact-info/new-partner-contact-info.container';
import { NewPartnerGeneralInfoContainer } from './pages/new-partner-general-info/new-partner-general-info.container';
import { catchError, EMPTY, finalize, tap, firstValueFrom, lastValueFrom, takeUntil, Subject } from 'rxjs';
import { ModalPaymentBankComponent } from './pages/new-partner-payment/commons/modals/modal-payment-bank/modal-payment-bank.component';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';
import { SelectedPackageService } from './commons/services/package-detail.service';
import { numberFormat } from '@shared/utils';
import { DialogService } from 'primeng/dynamicdialog';
import { Router, ActivatedRoute } from '@angular/router';
import { IPaypalData, ITemporaryToken } from './commons/interfaces/new-partner.interface';
import {
    getNewPartnerPayload,
    isEqualToTotalToPaid,
} from './commons/constants';
import { NewPartnerGeneralInfoService } from './pages/new-partner-general-info/commons/services/new-partner-general-info.service';
import { ModalCoRequesterPresenter } from './commons/modals/modal-co-requester/modal-co-requester.presenter';
import { parse } from 'ol/expr/expression';
import { ModalPlacementErrorComponent } from '../tree/pages/placement/commons/modals/modal-placement-error/modal-placement-error.component';
import { ModalAlertComponent } from 'src/app/profiles/commons/modals/modal-alert/modal-alert.component';
import { UserResponse } from 'src/app/authentication/commons/interfaces/authenticate.interface';
import { AuthenticationService } from '@shared/services';
import { v4 as uuidv4 } from 'uuid';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TemporalTokenService } from 'src/app/services/temporalToken.service';
import { NationalityStateService } from './commons/services/nationality-state.service';

@Component({
	selector: 'app-new-partner-component',
	standalone: true,
	providers: [NewPartnerFormPresenter, DialogService, ModalCoRequesterPresenter, TemporalTokenService],
	templateUrl: './new-partner.component.html',
	styleUrls: ['./new-partner.component.scss'],
	imports: [
		CommonModule,
		ReactiveFormsModule,
		FormsModule,
		MatIconModule,
		NewPartnerContactInfoContainer,
		NewPartnerSelectPackageComponent,
		NewPartnerAssignGodfatherComponent,
		NewPartnerPaymentComponent,
		NewPartnerGeneralInfoContainer
	]
})
export default class NewPartnerComponent {
	@Output() saveNewUserPromotor = new EventEmitter<any>();
	public currentStep: number = 0;
	public isPromotor = false;
	public registerTypeControl = new FormControl(1);
	private paypalData: IPaypalData;
	handleChangeTypeUser: string;
	isLoading: boolean;
	coRequesterData: any;
	public isMultiUsuario = false;
	private _authenticationService: AuthenticationService = inject(AuthenticationService);
	onChangeLoading: boolean = false;
	public dataToken: any;
	sponsorId: number = null;
	paramUserId: number = null;
	copied: boolean = false;
	private datePipe = new DatePipe('es-PE');
	generateToken: ITemporaryToken;
	urlgenerate: string = null;
	isToken: boolean = false;
	public familyPackagesList: any[] = [];
	private destroy$ = new Subject<void>();

	constructor(
		public newPartnerFormPresenter: NewPartnerFormPresenter,
		private newPartnerService: NewPartnerService,
		private userInfoService: UserInfoService,
		private selectedPackageService: SelectedPackageService,
		private dialogService: DialogService,
		private router: Router,
	private route: ActivatedRoute,
	private temporalTokenService: TemporalTokenService,
	private modalService: NgbModal,
	private cdr: ChangeDetectorRef,
	private nationalityState: NationalityStateService
) { }

	modalRef: NgbModalRef;
	@ViewChild('modalTemplateClock') modalTemplate: TemplateRef<any>;

	async ngOnInit(): Promise<void> {
		try {

			const params = await firstValueFrom(this.route.paramMap);
			this.dataToken = params.get('token') || null;
			if (this.dataToken) {
				this.isToken = true;
				await this.getValidateToken(this.dataToken);
			}
		} catch (err) {
			console.error('Error in ngOnInit:', err);
		}

	this.sponsorId = this.userInfoService.userInfo.id || null;

	this.nationalityState
		.getFamilyPackages$()
		.pipe(takeUntil(this.destroy$))
		.subscribe({
			next: (packages) => {
				console.log('📦 Paquetes cargados:', packages);
				this.onFamilyPackagesChange(packages);
			},
			error: (err) => {
				console.error('❌ Error cargando paquetes:', err);
				this.onFamilyPackagesChange([]);
			}
		});
}

ngOnDestroy(): void {
	this.destroy$.next();
	this.destroy$.complete();
	this.nationalityState.reset();
}

	onSubmitFirstStep() {
		this.newPartnerFormPresenter.removeSpaces();
		this.currentStep = 1;
	}

	onSubmitSecondStep() {
		this.currentStep = 2;
	}

	onSubmitThirdStep() {
		this.currentStep = 3;
	}

	onSubmitGodfatherStep(godfatherData: any) {
		// Guardar datos del padrino en el formulario
		this.newPartnerFormPresenter.multiStepForm.get('godfatherData').patchValue({
			idGodfather: godfatherData.idGodfather,
			godfatherLevel: godfatherData.godfatherLevel,
			isInAscendingLine: godfatherData.isInAscendingLine,
			godfatherName: godfatherData.godfatherName,
			godfatherUsername: godfatherData.godfatherUsername
		});
		this.currentStep = 4;
	}

	onSkipGodfatherStep() {
		this.newPartnerFormPresenter.multiStepForm.get('godfatherData').patchValue({
			idGodfather: null,
			godfatherLevel: null,
			isInAscendingLine: null,
			godfatherName: null,
			godfatherUsername: null
		});
		this.currentStep = 4;
	}
	onSubmitPaymentStep(dataToSave) {
		const listQuotes = [];
		const discountPercent = dataToSave.discountPercent || 0;
		const value = this.newPartnerFormPresenter.multiStepForm.getRawValue();
		const id = this.sponsorId;
		const isSpecialFractional =
			this.selectedPackageService.selectedPackageDetail?.isSpecialFractional ||
			this.selectedPackageService.selectedPackageDetail?.numberInitialQuote > 1;

		const exchangeRate = dataToSave.exchangeRate;
		let totalComisionInDollars = 0;

		// Filtrar cupones de los vouchers generales - el cupón no es un método de pago
		const generalVouchers = dataToSave.listVochers
			.filter((voucher) => voucher.paymentMethod !== 'wallet' && voucher.paymentMethod !== 'coupon')
			.map((voucher) => {
				let comisionInDollars = 0;

				if (voucher.currency === 2) {
					comisionInDollars = voucher.comisionSoles / exchangeRate;
				} else if (voucher.currency === 1) {
					comisionInDollars = voucher.comisionDolares;
				}

				const formattedComisionInDollars = parseFloat(comisionInDollars.toFixed(2));
				totalComisionInDollars += formattedComisionInDollars;

				return {
					idMethodPaymentSubType: voucher.methodSubTipoPagoId,
					operationNumber: voucher.operationNumber,
					note: voucher.note,
					idPaymentCoinCurrency: voucher.currency,
					comision: isNaN(Number(voucher.comision)) ? 0 : Number(voucher.comision),
					totalAmount: voucher.totalAmount,
					imagenBase64: voucher.imagen ? voucher.imagen.base64 : null
				};
			});

		const walletTransactionVoucher = dataToSave.listVochers.find(
			(voucher) => voucher.paymentMethod === 'wallet'
		);
		const walletTransaction = walletTransactionVoucher
			? { amount: parseFloat(walletTransactionVoucher.totalAmount) }
			: undefined;

		if (
			generalVouchers.length === 0 &&
			!walletTransaction &&
			!value.paymentData.isPayLater &&
			!this.paypalData
		) {
			this.dialogService.open(ModalAlertComponent, {
				header: '',
				data: {
					message: 'Debe registrar un pago. ',
					title: '¡Alerta!',
					icon: 'pi pi-exclamation-triangle'
				}
			});

			return;
		}

		if (
			!isEqualToTotalToPaid(
				generalVouchers,
				walletTransaction?.amount,
				(isSpecialFractional ? value.paymentData.amountPaid : value.paymentData.amountPaid) +
					totalComisionInDollars,
				exchangeRate
			) &&
			!this.paypalData &&
			!value.paymentData.isPayLater
		) {
			this.dialogService.open(ModalSuccessComponent, {
				header: '',
				data: {
					text: 'El monto ingresado no coincide con el total a pagar.',
					title: '¡Alerta!',
					icon: 'assets/icons/Inclub.png'
				}
			});
			return;
		}

		if (value.paymentData.amount1 && value.paymentData.amount1 > 0) {
			listQuotes.push(numberFormat(value.paymentData.amount1));
		}
		if (value.paymentData.amount2 && value.paymentData.amount2 > 0) {
			listQuotes.push(numberFormat(value.paymentData.amount2));
		}
		if (value.paymentData.amount3 && value.paymentData.amount3 > 0) {
			listQuotes.push(numberFormat(value.paymentData.amount3));
		}

		const payload = getNewPartnerPayload({
			...dataToSave,
			listVochers: generalVouchers,
			walletTransaction,
			...value,
			id,
			isEditedInitial: isSpecialFractional,
			listQuotes,
			discountPercent,
			...this.paypalData,
			...(dataToSave.idCoupon && { idCoupon: dataToSave.idCoupon }),
			...(dataToSave.discountMont !== undefined && { discountMont: dataToSave.discountMont })
		});

		console.log('🚀 Payload final para registro de socio:', {
			hasIdCoupon: !!payload.idCoupon,
			idCoupon: payload.idCoupon,
			discountMont: payload.discountMont,
			fullPayload: payload
		});

		this.newPartnerService.validateUserId(id).subscribe((isValid) => {
			if (!isValid) {
				alert('El usuario no existe, ¡Contacte a soporte!');
				this.router.navigate(['/profile/partner']);
				return;
			}

			this.isLoading = true;

			this.newPartnerService
				.createNewParner(payload)
				.pipe(
					tap(() => {
						this.dialogService
							.open(ModalSuccessComponent, {
								header: '',
								width: '40%',
								data: {
									text: 'Los datos de tu registro se guardaron exitosamente y ahora es parte del club. ¡Bienvenido a Inclub!.',
									title: 'Registro exitoso!',
									icon: 'check_circle_outline'
								}
							})
							.onClose.pipe(
								tap(() => {
									this.selectedPackageService.setSelectedPackageData(null);
									if (this.isMultiUsuario) {
										this._authenticationService.getUser();
									}

									if (this.dataToken) {
										this.deleteTokenTemporary(this.dataToken).then(() => {
											this.goToLink('/');
										}).catch((error) => {
											console.error("Error al eliminar el token:", error);
										});
									} else {
										this.goToLink('/profile/partner');
									}
								})
							)
							.subscribe();
					}),
					catchError((error) => {
						console.error('Error en el registro:', error);
						this.dialogService.open(ModalAlertComponent, {
							header: '',

							data: {
								message:
									'Hubo un problema al registrar el usuario. Por favor, intente nuevamente. ',
								title: '¡Error!',
								icon: 'pi pi-times-circle'
							}
						});
						return EMPTY;
					}),
					finalize(() => (this.isLoading = false))
				)
				.subscribe();
		});
	}

	onNavigateStep() {
		this.currentStep--;
	}

	onChangeStep(newStep: number) {
		this.currentStep = newStep;
	}

	get stepNavigation() {
		if (this.isPromotor) return [StepsNavigation[0], StepsNavigation[1]];
		return StepsNavigation;
	}

	onPaypalData(paypalData: IPaypalData) {
		this.paypalData = paypalData;
	}

	onSaveNewUserPromotor() { }

	onChangeTypeUser(value: string) {
		this.onChangeLoading = true;
		this.handleChangeTypeUser = value;
		this.newPartnerFormPresenter.preserveAndResetFormData();

		switch (parseInt(value)) {
			case 1:
				this.isMultiUsuario = false;
				this.isPromotor = true;
				this.newPartnerFormPresenter.removePackageAndPaymentForm();
				setTimeout(() => {
					this.onChangeLoading = false;
				}, 1000);
				break;

			case 2:
				this.isMultiUsuario = false;
				this.isPromotor = false;
				setTimeout(() => {
					this.onChangeLoading = false;
				}, 1000);
				break;

			case 3:
				this.isMultiUsuario = true;
				const user: UserResponse = this.userInfoService.userInfo;
				const birthDate = new Date(user.birthDate);
				const civilState: number = parseInt(user.civilState?.toString().trim() || '0', 10);

				const personalData = {
					name: user.name,
					lastname: user.lastName,
					birthdate: birthDate,
					gender: user.gender,
					idNationality: user.idNationality,
					civilState: civilState
				};

				const contactData = {
					email: user.email,
					country: user.idResidenceCountry,
					city: user.districtAddress,
					phone: user.telephone,
					address: user.address,
					districtAddress: user.districtAddress
				};

				this.newPartnerFormPresenter.multiStepForm.get('personalData').patchValue(personalData);
				setTimeout(() => {
					this.newPartnerFormPresenter.multiStepForm.get('personalData').patchValue({
						idDocument: user.idTypeDocument,
						nroDocument: user.documentNumber
					});
					this.onChangeLoading = false;
				}, 2000);
				this.newPartnerFormPresenter.multiStepForm.get('contactData').patchValue(contactData);
				this.newPartnerFormPresenter.disableFormSections();
				break;
		}
	}

	async getValidateToken(token: string): Promise<void> {
		let pathUrl = `/temporary/${token}`;
		await this.temporalTokenService.getTemporalTokenByToken(pathUrl).subscribe({
			next: (response) => {
				if (response.result) {
					this.generateToken = response.data;
					this.sponsorId = this.generateToken.userId;
					this.compareTodate(response.data);
				} else {
					this.copied = false;
					this.generateToken = null;
					this.goToHome();
				}
			},
			error: (error) => {
				console.error('HTTP Error gemerate token: ', error);
				this.goToHome();
			},
			complete: () => {
				this.copied = true;
			}
		})
	}

	generateTemporalUrl() {

		const datePipe = new DatePipe('en-US');
		const actual = new Date();
		let dateTimeNow = datePipe.transform(actual, 'yyyy-MM-dd HH:mm:ss.SSSSSS', 'America/Lima'); //America/Lima
		let dateTimeNowISO = dateTimeNow?.replace(' ', 'T') || '';

		actual.setTime(actual.getTime() + (6 * 60 * 60 * 1000));
		let dateExpired = datePipe.transform(actual, 'yyyy-MM-dd HH:mm:ss.SSSSSS', 'America/Lima');//GMT-05:00
		let dateExpiredISO = dateExpired?.replace(' ', 'T') || '';
		let uuid = this.generate();

		const paramBody = {
			"userId": this.userInfoService.userInfo.id,
			"userType": null,
			"contactId": null,
			"securityToken": uuid,
			"createdAt": dateTimeNowISO,
			"expiredAt": dateExpiredISO,
			"updatedAt": null
		}

		let path = "/temporary";
		this.temporalTokenService.postTemporalToken(paramBody, path).subscribe({
			next: (response) => {
				if (response.result) {
					this.generateToken = response.data;
					this.urlgenerate = `${window.location.origin}/backoffice/new-partner/${this.generateToken.securityToken}`;
					this.showModalMessage();
					navigator.clipboard.writeText(this.urlgenerate).then(() => {
						this.copied = true;
						setTimeout(() => {
							this.copied = false;
						}, 2500);
					}).catch(err => {
						this.copied = false;
					});

				} else {
					this.copied = false;
					this.generateToken = null;
				}
			},
			error: (error) => {
				//window.location.href = '/backoffice';
				console.error('HTTP Error gemerate token-3: ', error);
			},
			complete: () => {
				this.copied = true;
			}
		})

	}

	generate(): string {
		return uuidv4();
	}

	compareTodate(temoraryToken: ITemporaryToken) {

		const datePipe = new DatePipe('en-US');

		let dateXpired = temoraryToken.expiredAt;
		let dateLimit = datePipe.transform(dateXpired, 'yyyy-MM-dd HH:mm:ss', 'America/Lima');

		const actual = new Date();
		let currentDate = datePipe.transform(actual, 'yyyy-MM-dd HH:mm:ss', 'America/Lima');

		const expirationDate = new Date(dateLimit!);
		const currentDatex = new Date(currentDate!);

		if (currentDatex > expirationDate) {
			console.log("fecha expirado");
			this.goToHome();
		} else {
			console.log("fecha no expirado");
		}

	}

	goToHome() {
		this.generateToken = null;
		this.copied = false;
		window.location.href = '/backoffice';
	}

	showModalMessage() {
		this.modalRef = this.modalService.open(this.modalTemplate, { size: 'md' });
	}

	closeModal() {
		this.modalRef?.close();
	}

	async deleteTokenTemporary(token: string) {
		let path = `/temporary/${token}`;
		await this.temporalTokenService.deleteTemporalToken(path).subscribe({
			next: (response) => {
				if (response.result) {
					console.log("token eliminado");
				} else {
					console.error("Error al eliminar el token");
				}
			},
			error: (error) => {
				console.error('HTTP Error delete token: ', error);
			},
			complete: () => {
				this.generateToken = null;
			}
		})
	}

	goToLink(path: string) {

		if (this.dataToken) {
			this.router.navigate([path]);
			return;
		}
		this.router.navigate([path]);
	}

	onFamilyPackagesChange(packages: any[]): void {

		if (!packages || packages.length === 0) {
			this.familyPackagesList = [];
			return;
		}

		this.familyPackagesList = [...packages];

	}

}
