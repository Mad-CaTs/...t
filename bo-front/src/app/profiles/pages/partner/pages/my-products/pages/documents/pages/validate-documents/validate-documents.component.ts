import { ChangeDetectorRef, Component, Input, ViewChild } from '@angular/core';
import { StepProgressComponent } from '@shared/components/step-progress/step-progress.component';
import {
	getLegalizationNoticeMessage,
	getLegalizationPayload,
	isEqualToLegalizationAmount,
	LEGALIZATION_STEP_LABELS
} from './commons/constants';
import { Location } from '@angular/common';
import { DocumentDetailCardComponent } from '../../commons/components/document-detail-card/document-detail-card.component';
import { MatDividerModule } from '@angular/material/divider';
import { CardDocumentsComponent } from './commons/components/card-documents/card-documents.component';
import { CommonModule } from '@angular/common';
import { UploadDocumentsComponent } from './commons/components/upload-documents/upload-documents.component';
import { FacialValidationRecommendationsComponent } from './commons/components/facial-validation-recommendations/facial-validation-recommendations.component';
import { CaptureFaceComponent } from './commons/components/capture-face/capture-face.component';
import { FaceVerificationComponent } from '../face-verification/face-verification.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataSharingService } from '../../../../commons/services/data-sharing.service';
import ValidatePersonalDataComponent from './commons/components/validate-personal-data/validate-personal-data.component';
import ConfirmShippingAddressComponent from './commons/components/confirm-shipping-address/confirm-shipping-address.component';
import { LegalizationNoticeModal } from './commons/components/confirm-shipping-address/commons/modals/app-legalization-notice-modal/app-legalization-notice-modal.component';
import { DialogService } from 'primeng/dynamicdialog';
import ConfirmLegalizationPaymentComponent from 'src/app/profiles/pages/partner/pages/my-products/pages/documents/pages/validate-documents/commons/components/confirm-legalization-payment/confirm-legalization-payment.component';
import { LegalizationService } from '../../../../../my-legalization/commons/services/legalization.service';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';
import { catchError, EMPTY, finalize, firstValueFrom, map, Subject, takeUntil, tap } from 'rxjs';
import { ModalAlertComponent } from 'src/app/profiles/commons/modals/modal-alert/modal-alert.component';
import { ModalSuccessComponent } from 'src/app/profiles/commons/modals/modal-success/modal-success.component';
import { DocumentService } from '../../commons/services/documents-service';
import { IAuthorizedPerson, IFormDataChange } from './commons/interfaces/validate.interfaces';
import { ISelect } from '@shared/interfaces/forms-control';
import { LegalizationPreNoticeModal } from './commons/components/confirm-shipping-address/commons/modals/app-legalization-pre-notice-modal/app-legalization-notice-pre-modal.component';
import { NewPartnerService } from 'src/app/profiles/pages/ambassador/pages/new-partner/commons/services/new-partner.service';
import { LegalizationValidateService } from './commons/components/validate-personal-data/commons/services/legalization-validate.service';

@Component({
	selector: 'app-validate-documents',
	standalone: true,
	imports: [
		StepProgressComponent,
		DocumentDetailCardComponent,
		MatDividerModule,
		CommonModule,
		ConfirmShippingAddressComponent,
		ConfirmLegalizationPaymentComponent
	],
	templateUrl: './validate-documents.component.html',
	styleUrl: './validate-documents.component.scss'
})
export class ValidateDocumentsComponent {
	stepProcess: number = 1;
	LEGALIZATION_STEP_LABELS = LEGALIZATION_STEP_LABELS;
	stepLabels = LEGALIZATION_STEP_LABELS.map((step) => step.label);
	public typeDocument: string;
	public date: string;
	documentosValidados: boolean = false;
	recomendationFacial: boolean = false;
	fromLegalization = false;
	selectedProduct: any;
	datosUploadDocuments: any;
	shippingAddressData: any;
	public payTypeSelected: number;
	public step2FormData: any = null;
	userInfo: any;
	public loadingSubmit = false;
	public montoLegalizacion: number = 0;
	public montoSoles: number = 0;
	selectedDocumentUrl: string | null = null;
	listLegalDocuments: any[] = [];
	idSubscription!: number;
	public exchangeType: number;
	@ViewChild('confirmLegalizationRef') confirmLegalizationRef: ConfirmLegalizationPaymentComponent;
	authorizedPersonData: IAuthorizedPerson;
	paymentInfo: any;
	isPaymentReady = false;
	public selectedPayTypeOption: ISelect | null = null;
	montoDeEnvio: number;
	public isForeign: any;
	private modalRef: any;
	selectedBranch: any;
	sucursalesCercanas: any;
	isLoadingSucursales = false;
	formUserIsValid = false;
	@Input() step3FormData: any;
	public legalizationTypes: ISelect[] = [];
	public legalizationDocList: ISelect[] = [];
	voucherToEdit: any = null;
	indexEdit: number | null = null;
	formIsValidChild = false;
	public nationalitiesList: ISelect[] = [];
	private destroy$: Subject<void> = new Subject<void>();
	public pickupInfo: ISelect[] = [];
	public shippingInfo: ISelect[] = [];
	serialDocument: string | null = null;
	documentsData: any;
	constructor(
		private location: Location,
		private route: ActivatedRoute,
		private fb: FormBuilder,
		private legalizationValidateService: LegalizationValidateService,
		private dialogService: DialogService,
		private cdr: ChangeDetectorRef,
		private legalizationService: LegalizationService,
		private userInfoService: UserInfoService,
		private documentService: DocumentService,
		private router: Router,
		private newPartnerService: NewPartnerService
	) {
		this.userInfo = this.userInfoService.userInfo;
	}

	ngOnInit(): void {
		this.subscribeToQueryParams();
		this.loadSelectedProductFromSession();
		this.loadLegalizationTypes();
		this.loadDocumentTypes();
		this.getNationalities();
		this.loadPickupInfo();
	}

	getNationalities() {
		this.newPartnerService
			.getCountriesList()
			.pipe(takeUntil(this.destroy$))
			.subscribe((paises) => {
				this.nationalitiesList = paises;
			});
	}

	private loadPickupInfo(): void {
		this.legalizationValidateService
			.getLocalTypeOptions()
			.pipe(takeUntil(this.destroy$))
			.subscribe({
				next: (options) => (this.pickupInfo = options),
				error: (err) => console.error('Error cargando pickupInfo:', err)
			});
	}

	loadSelectedProductFromSession(): void {
		const productFromSession = sessionStorage.getItem('selectedProduct');
		if (productFromSession) {
			this.selectedProduct = JSON.parse(productFromSession);
		}
		const documentsDataFromSession = localStorage.getItem('documentData');

		if (documentsDataFromSession) {
			this.documentsData = JSON.parse(documentsDataFromSession);
		}
	}
	private loadLegalizationTypes(): void {
		this.legalizationService.getLegalizationTypes().subscribe({
			next: (types) => {
				if (this.isForeign === 3) {
					this.legalizationTypes = types.filter((type: any) => type.value === 1);
				} else {
					this.legalizationTypes = types;
				}
			},
			error: (err) => {
				console.error('Error al cargar tipos de legalización', err);
			}
		});
	}

	private loadDocumentTypes(): void {
		this.legalizationService.getDocumentTypes().subscribe({
			next: (types) => (this.legalizationDocList = types),
			error: () => console.error('Error al cargar tipos de documentos')
		});
	}

	onMontoLegalizacionChanged(monto: number) {
		this.montoLegalizacion = monto;
	}

	onStep2FormChanged(data: { value: any; valid: boolean }) {
		this.step2FormData = data.value;
	}

	onAuthorizedPersonRegistered(persona: IAuthorizedPerson) {
		this.authorizedPersonData = persona;
	}

	onFormValidityChange(isValid: boolean): void {
		this.documentosValidados = isValid;
		this.cdr.detectChanges();
	}

	onShippingAddressChanged(data: any) {
		this.shippingAddressData = data;
	}

	onbranchDataChanged(data) {
		this.selectedBranch = data;
	}
	handleSucursalesCercanasChange(sucursales: any[]) {
		this.sucursalesCercanas = sucursales;
	}

	private subscribeToQueryParams(): void {
		this.route.queryParams.subscribe((params) => {
			this.selectedPayTypeOption = JSON.parse(params['payTypeData']);
			this.isForeign = this.selectedPayTypeOption?.value;
			this.fromLegalization = params['from'] === 'legalization';
		});
	}

	validarDocumentos() {
		this.documentosValidados = true;
		this.stepProcess = 1;
	}

	mostrarRecomendacionesFacial() {
		this.recomendationFacial = true;
		this.stepProcess = 3;
	}

	handleLoadingSucursalesChange(isLoading: boolean) {
		this.isLoadingSucursales = isLoading;
		this.cdr.detectChanges();
	}

	get formsValid(): boolean {
		if (this.isForeign === 2) {
			if (this.isLoadingSucursales) {
				return false;
			}
			if (this.sucursalesCercanas && this.sucursalesCercanas.length > 0) {
				return !!this.shippingAddressData?.valid && !!this.selectedBranch;
			} else {
				return !!this.shippingAddressData?.valid;
			}
		} else {
			return !!this.shippingAddressData?.valid;
		}
	}

	siguientePaso(): void {
		if (this.isForeign === 1) {
			this.openRejectModal();
		} else if (this.isForeign === 2 || this.isForeign === 3) {
			this.openFirstModalThenReject();
		} else {
			this.siguientePasoDesdeModal();
		}
	}

	openFirstModalThenReject(): void {
		if (this.modalRef) {
			this.modalRef.close();
		}

		const modalData: any = {
			title: this.isForeign === 2 ? 'Estimado socio/a' : '¡Importante!',
			message:
				this.isForeign === 2
					? 'Todo documento enviado a SERPOST recibe un código de seguimiento único. Usted será responsable del rastreo y recojo del documento en la agencia asignada:'
					: 'La dirección ingresada será utilizada para coordinar la entrega con el courier',
			buttonText: 'Continuar',
			returnValue: 'continuar'
		};
		if (this.isForeign === 2) {
			const street =
				this.selectedBranch?.tags?.['addr:street'] ?? this.shippingAddressData?.data?.address;
			const sucursal = this.selectedBranch?.tags?.alt_name ?? 'Serpots';
			modalData.address = `
 
			  <strong>${sucursal} - ${street}</strong><br>
    <strong>Importante:</strong>
  `;
			modalData.description = `
    Si no recoge su documento dentro del plazo establecido, la solicitud se anulará y deberá:
    <br>a. Volver a iniciar el trámite de legalización.
    <br>b. Pagar nuevamente el envío a provincia.
  `;
			modalData.buttonText = 'Sí, proceder';
			modalData.secondaryButtonText = 'No, corregir';
		} else {
			modalData.address = `
    <strong>Dirección:</strong> ${this.shippingAddressData?.data?.foreignFullAddress}<br>
    <strong>Contacto:</strong> ${this.shippingAddressData?.data?.nroPhone} - ${this.shippingAddressData?.data?.email}
  `;
			modalData.description = `
    ¿Confirma que los datos son los correctos?
  `;
			modalData.buttonText = 'Sí, es correcta';
			modalData.secondaryButtonText = 'No, cambiar dirección';
		}
		const width = window.innerWidth < 768 ? '90vw' : '40vw';
		this.modalRef = this.dialogService.open(LegalizationPreNoticeModal, {
			width: width,
			dismissableMask: true,
			closable: true,
			data: modalData
		});

		this.modalRef.onClose.subscribe((res: string) => {
			if (res === 'continuar') {
				setTimeout(() => {
					this.openRejectModal();
				});
			}
			this.modalRef = null;
		});
	}

	openRejectModal(): void {
		if (this.modalRef) {
			this.modalRef.close();
		}
		const width = window.innerWidth < 768 ? '90vw' : '40vw';
		this.modalRef = this.dialogService.open(LegalizationNoticeModal, {
			width: width,
			dismissableMask: true,
			closable: true,
			data: {
				title: '¡Importante!',
				message: getLegalizationNoticeMessage(this.isForeign),
				buttonText: 'Entendido',
				returnValue: 'entendido'
			}
		});

		this.modalRef.onClose.subscribe((res: string) => {
			if (res === 'entendido') {
				this.siguientePasoDesdeModal();
			}
			this.modalRef = null;
		});
	}

	siguientePasoDesdeModal(): void {
		if (this.stepProcess < this.LEGALIZATION_STEP_LABELS.length) {
			this.stepProcess++;
		}
	}

	onMontoSolesChanged(monto: number): void {
		this.montoSoles = monto;
	}

	goBack(): void {
		if (this.stepProcess > 1) {
			this.stepProcess--;
		} else {
			this.location.back();
		}
	}

	onPaymentStepCompleted(data: any) {
		this.paymentInfo = data;
		this.isPaymentReady = true;
		this.documentosValidados = true;
		this.exchangeType = data.exchangeType;
		this.cdr.detectChanges();
		this.registerRequest();
	}

	registerRequest(): void {
		const paymentMethod = this.paymentInfo?.paymentMethod;
		const isPayPal = paymentMethod === 3;

		let listaVouches = [];
		let paypalDTO = undefined;

		if (isPayPal) {
			paypalDTO = {
				operationNumber: this.paymentInfo.operationNumber,
				paymentSubTypeId: this.paymentInfo.paymentSubTypeId
			};
		} else {
			listaVouches = this.paymentInfo?.listaVouches || [];
		}

		const exchangeRate = Number(this.exchangeType);
		const monedaBase = isPayPal ? this.paymentInfo?.typeCurrency : this.paymentInfo?.currency;

		const montoTotalEsperado = isPayPal
			? Number(this.paymentInfo?.amount || 0) +
			  Number(this.paymentInfo?.montoLegalizacionUSD || 0) +
			  Number(this.paymentInfo?.apostillaUSD || 0)
			: Number(this.paymentInfo?.montoTotalEsperado || 0);

		if (
			!isPayPal &&
			!isEqualToLegalizationAmount(listaVouches, montoTotalEsperado, exchangeRate, monedaBase)
		) {
			const ref = this.dialogService.open(ModalAlertComponent, {
				header: '',
				data: {
					message:
						'El monto ingresado no coincide con el monto de legalización. Por favor verifica los datos.',
					title: 'Montos no coinciden',
					icon: 'pi pi-exclamation-triangle'
				}
			});

			ref.onClose.subscribe(() => {
				const vauchers = this.paymentInfo?.listaVouches;
				const metodo = vauchers?.[0]?.methodSelected;
				this.confirmLegalizationRef?.onMedioPago(metodo, vauchers);
			});

			return;
		}
		this.loadingSubmit = true;
		const montoTotalEsperadoPayload = isPayPal
			? montoTotalEsperado
			: this.paymentInfo?.amountLegalization;
		const payload = getLegalizationPayload(
			this.userInfo,
			listaVouches,
			this.documentsData,
			this.shippingAddressData?.data,
			paypalDTO,
			this.montoLegalizacion,
			montoTotalEsperadoPayload,
			this.selectedPayTypeOption,
			paymentMethod,
			Number(this.paymentInfo?.documentShippingCost) || 0,
			isPayPal ? this.paymentInfo?.montoLegalizacionUSD : this.montoSoles,
			this.selectedProduct,
			this.selectedBranch
		);
		this.legalizationService
			.submitLegalizationRequest(payload, this.selectedProduct?.tipo)
			.pipe(
				tap(() => {
					const ref = this.dialogService.open(ModalSuccessComponent, {
						header: '',
						width: '40%',
						data: {
							text: 'Tu solicitud fue registrada exitosamente.',
							title: '¡Registro exitoso!',
							icon: 'check_circle_outline'
						}
					});
					ref.onClose.subscribe(() => {
						this.router.navigate(['/profile/partner/my-legalization']);
					});
				}),
				catchError((error) => {
					let message =
						'Hubo un problema al registrar la solicitud. Por favor, intente nuevamente.';

					if (error?.status === 409) {
						message = error?.error?.message;

						const ref = this.dialogService.open(ModalAlertComponent, {
							header: '',
							data: {
								message,
								title: '¡Error!',
								icon: 'pi pi-times-circle'
							}
						});
						ref.onClose.subscribe(() => {
							this.router.navigate(['/profile/partner/my-legalization']);
						});
					} else {
						this.dialogService.open(ModalAlertComponent, {
							header: '',
							data: {
								message,
								title: '¡Error!',
								icon: 'pi pi-times-circle'
							}
						});
					}

					return EMPTY;
				}),
				finalize(() => {
					this.loadingSubmit = false;
				})
			)
			.subscribe();
	}
}
