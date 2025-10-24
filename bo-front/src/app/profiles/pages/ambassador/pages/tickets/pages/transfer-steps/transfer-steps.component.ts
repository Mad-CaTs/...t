import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { StepsNavigation } from '@shared/components/forgot-password/commons/mock/mock';
import { StepProgressComponent } from '@shared/components/step-progress/step-progress.component';
import { BreadcrumbItem } from '@shared/interfaces/breadcrumb';
import { getTicketsBreadcrumbs } from '../../commons/constants';
import { Router } from '@angular/router';
import {
	getRegisterAccountTransferPayload,
	getTransferPayload,
	ICONS_MAP,
	TRANSFER_OPTIONS,
	TRANSFER_STEPS
} from '../commons/constants';
import { LegalizationNoticeModal } from 'src/app/profiles/pages/partner/pages/my-products/pages/documents/pages/validate-documents/commons/components/confirm-shipping-address/commons/modals/app-legalization-notice-modal/app-legalization-notice-modal.component';
import { DialogService } from 'primeng/dynamicdialog';
import {
	ITransferDocuments,
	ITransferInfo,
	ITransferMessageConfig,
	ITransferUserData
} from '../commons/interfaces';
import { TRANSFER_MESSAGES } from '../commons/constants/messages.constants';
import { TransferOptionsComponent } from '../../commons/components/transfer-options/transfer-options.component';
import { TransferDocumentsSubmissionComponent } from '../../commons/components/transfer-documents-submission/transfer-documents-submission.component';
import { RequestConfirmationComponent } from '../../commons/components/request-confirmation/request-confirmation.component';
import { TransferService } from '../commons/services/transfer/transfer.service';
import { ModalSuccessComponent } from 'src/app/profiles/commons/modals/modal-success/modal-success.component';
import { ModalAlertComponent } from 'src/app/profiles/commons/modals/modal-alert/modal-alert.component';
import { ITransferOption } from '../../commons/interfaces';
import { UserResponse } from 'src/app/authentication/commons/interfaces/authenticate.interface';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';
import TransferDetailComponent from '../transfer-detail/transfer-detail.component';
import { LoaderComponent } from '@shared/components/loader/loader.component';
import { ConciliationService } from '../../../payments-and-comissions/pages/conciliation/commons/services/conciliation.service';

@Component({
	selector: 'app-transfer-steps',
	standalone: true,
	imports: [
		CommonModule,
		StepProgressComponent,
		BreadcrumbComponent,
		TransferOptionsComponent,
		TransferDetailComponent,
		TransferDocumentsSubmissionComponent,
		RequestConfirmationComponent,
		LoaderComponent
	],
	templateUrl: './transfer-steps.component.html',
	styleUrl: './transfer-steps.component.scss'
})
export default class TransferStepsComponent implements OnInit {
	stepProcess: number = 1;
	activeStep: number = 0;
	breadcrumbItems: BreadcrumbItem[] = [];
	transferOptions: ITransferOption[] = [];
	userInfo!: UserResponse;
	transferCombinedData: any;
	/* 	 	transferOptions = TRANSFER_OPTIONS;
	 */ title = 'Traspasos';
	userHasMultipleAccounts: boolean = false;
	selectedId: number | null = null;
	stepLabels = TRANSFER_STEPS;
	isFormValid = false;
	transferDocumentsData: any;
	transferInfoData: any;
	transferData: any;
	selectedOption: ITransferOption | null = null;
	public isStepTwoValid = false;
	public isStepThreeValid = false;
	loadingOptions: boolean = false;
	isSubmitting: boolean = false;

	newUserId: number | null = null;
	sponsorInfo: ITransferUserData;
	hasPendingConciliation: boolean = false;

	ngOnInit(): void {
		this.initBreadcrumbs();
		this.loadTransferOptions();
		this.verifyWallet();
	}

	constructor(
		private router: Router,
		private dialogService: DialogService,
		private transferService: TransferService,
		private userInfoService: UserInfoService,
		private conciliationService: ConciliationService
	) {
		this.userInfo = this.userInfoService.userInfo;
	}

	changeStep(index: number) {
		this.stepProcess = index + 1;
	}

	get stepNavigation() {
		return StepsNavigation;
	}
	private initBreadcrumbs(): void {
		this.breadcrumbItems = getTicketsBreadcrumbs(this.router);
	}

	onOptionClick(option: ITransferOption) {
		if (this.hasPendingConciliation) {
			this.showConciliationModal();
			return;
		}
		this.selectedId = option.id;
		this.selectedOption = option;

		/* 	if (option.id === 3 || option.id === 4) {
			this.modalAlert(
				'Tipo de traspaso no disponible',
				`Por el momento, el tipo de traspaso "${option.title}" no está disponible. Próximamente podrás usar esta opción.`,
				'warning'
			);
			return;
		} */

		this.transferInfoData = null;
		this.sponsorInfo = null;
		this.transferDocumentsData = null;
		this.transferCombinedData = null;
	}

	modalAlert(title: string, message: string, type: string) {
		this.dialogService.open(ModalAlertComponent, {
			header: title,
			data: {
				message: message,
				type: type,
				title: '¡Alerta!',
				icon: 'pi pi-exclamation-triangle'
			}
		});
	}

	previousStep() {
		if (this.stepProcess > 1) {
			this.stepProcess--;
		}
	}

	verifyWallet(): void {
		this.conciliationService.getConciliationPendingByUserIdTransfer(this.userInfo.id).subscribe({
			next: (check) => {
				this.hasPendingConciliation = !!check.data;
			},
			error: (err) => {
				console.error('Error al verificar conciliación:', err);
			}
		});
	}

	nextStep(): void {
		const lastStep = 4;

		if (this.stepProcess === 1) {
			this.handleFirstStep();
			return;
		}
		if (this.stepProcess === 2) {
			if (this.selectedId === 3) {
				this.createNewPartner();
				return;
			}

			this.stepProcess++;
			return;
		}

		if (this.stepProcess === 3) {
			this.handleStepThree();
			return;
		}

		if (this.stepProcess === lastStep) {
			this.submitTransfer();
		}
	}

	createNewPartner(): void {
		this.isSubmitting = true;
		const payload = getRegisterAccountTransferPayload({
			transferInfo: this.transferInfoData.value
		});

		this.transferService.registerAccountTransfer(payload).subscribe({
			next: (res) => {
				this.isSubmitting = false;
				this.stepProcess++;
				this.newUserId = res.data;
			},
			error: (err) => {
				console.error('❌ Error al crear socio:', err);
				this.isSubmitting = false;
			}
		});
	}

	private handleStepThree(): void {
		const filesToUpload: File[] = [];

		if (this.transferDocumentsData?.documentoIdentidad) {
			filesToUpload.push(this.transferDocumentsData.documentoIdentidad);
		}
		if (this.transferDocumentsData?.declaracionJurada) {
			filesToUpload.push(this.transferDocumentsData.declaracionJurada);
		}
		if (this.transferDocumentsData?.partnerDocument) {
			filesToUpload.push(this.transferDocumentsData.partnerDocument);
		}

		if (filesToUpload.length === 0) {
			console.warn('⚠️ No hay archivos para subir');
			this.stepProcess++;
			return;
		}
		this.isSubmitting = true;

		this.transferService.uploadDocuments(filesToUpload, 29).subscribe({
			next: (res) => {
				const parsedUrls = {
					declaration_jurada_url: JSON.parse(res.declaration_jurada_url).data,
					dni_receptor_url: JSON.parse(res.dni_receptor_url).data,
					dni_url: JSON.parse(res.dni_url).data
				};

				this.transferCombinedData.documentos = {
					...this.transferDocumentsData,
					uploadedUrls: parsedUrls
				};
				this.isSubmitting = false;
				this.stepProcess++;
			},
			error: (err) => {
				console.error('❌ Error al subir archivos:', err);
				this.isSubmitting = false;
			}
		});
	}

	private goToNextStep(): void {
		const lastStep = 4;

		if (this.stepProcess < lastStep) {
			this.stepProcess++;
		}
	}

	onTransferFormChange(data: ITransferInfo) {
		this.transferInfoData = data;
		this.updateCombinedData();
	}

	onTransferDocumentsChange(data: ITransferDocuments) {
		this.transferDocumentsData = data;
		this.updateCombinedData();
	}

	updateCombinedData() {
		this.transferCombinedData = {
			info: this.transferInfoData,
			documentos: this.transferDocumentsData
		};
	}

	private handleFirstStep(): void {
		const idUser = this.userInfo.id;
		this.transferService.getTransferTypesByUser(idUser, this.selectedId).subscribe({
			next: (res) => {
				if (res.result) {
					this.openNoticeModal(TRANSFER_MESSAGES['SINGLE_ACCOUNT']);
				} else {
					const config: ITransferMessageConfig = {
						title: 'Aviso',
						message: res.message,
						buttonText: 'Aceptar',
						returnValue: 'aceptar',
						autoAdvance: false
					};
					this.openNoticeModal(config);
				}
			},
			error: (err) => {
				const config: ITransferMessageConfig = {
					title: 'Error',
					message: err?.error?.message || 'Hubo un problema al validar la transferencia.',
					buttonText: 'Aceptar',
					returnValue: 'aceptar',
					autoAdvance: false
				};
				this.openNoticeModal(config);
			}
		});
	}

	private openNoticeModal(config: ITransferMessageConfig): void {
		const width = window.innerWidth < 768 ? '90vw' : '40vw';

		this.dialogService
			.open(LegalizationNoticeModal, {
				width,
				data: config
			})
			.onClose.subscribe((res: string) => {
				if (res === config.returnValue && config.autoAdvance) {
					this.goToNextStep();
				}
			});
	}

	submitTransfer(): void {
		/* 	if (this.hasPendingConciliation) {
			this.showConciliationModal();
			return;
		} */
		this.isSubmitting = true;

		if (!this.transferInfoData || !this.transferInfoData.value) {
			console.error('Error: transferInfoData o transferInfoData.value no está definido');
			return;
		}
		const uploadedUrls = this.transferCombinedData.documentos?.uploadedUrls || {};

		const payload = getTransferPayload({
			selectedId: this.selectedId,
			transferInfo: this.transferInfoData.value,
			sponsorInfo: this.sponsorInfo,
			documents: {
				...this.transferDocumentsData,
				uploadedUrls
			},
			userInfo: this.userInfo,
			...(this.newUserId != null && { newUserId: this.newUserId })
		});

		this.transferService.submitTransfer(payload).subscribe({
			next: (res) => {
				this.isSubmitting = false;
				this.handleTransferSuccess(res);
			},
			error: (err) => {
				console.error('Error al registrar transferencia:', err);
				this.isSubmitting = false;
				this.handleTransferError(err);
			}
		});
	}

	private handleTransferSuccess(res: any): void {
		const ref = this.dialogService.open(ModalSuccessComponent, {
			header: '',
			width: '40%',
			data: {
				text: 'La transferencia fue registrada exitosamente.',
				title: '¡Éxito!',
				icon: 'check_circle_outline'
			}
		});

		ref.onClose.subscribe(() => {
			this.router.navigate(['/profile/ambassador/tickets/new-ticket']);
		});
	}

	private handleTransferError(err: any): void {
		this.dialogService.open(ModalAlertComponent, {
			header: '',
			data: {
				message: err?.error?.message || 'Hubo un problema al registrar la transferencia.',
				title: '¡Error!',
				icon: 'pi pi-times-circle'
			}
		});
	}

	get isContinueEnabled(): boolean {
		if (this.stepProcess === 1) {
			return !!this.selectedId;
		} else if (this.stepProcess === 2) {
			return !!this.transferInfoData?.valid;
		} else if (this.stepProcess === 3) {
			return !!this.transferDocumentsData;
		}
		return true;
	}

	private loadTransferOptions(): void {
		this.loadingOptions = true;
		this.transferService.getTransferTypes().subscribe({
			next: (data) => {
				this.transferOptions = data.map((item) => ({
					id: item.id,
					title: item.name,
					description: item.description,
					icon: ICONS_MAP[item.id] || '/assets/icons/tickets/default.svg'
				}));
				setTimeout(() => {
					this.loadingOptions = false;
				}, 500);
			},
			error: (err) => {
				console.error('Error al cargar transfer options', err);
				setTimeout(() => {
					this.loadingOptions = false;
				}, 500);
			}
		});
	}

	onSponsorInfoChange(data: ITransferUserData) {
		this.sponsorInfo = data;
	}

	showConciliationModal(): void {
		this.dialogService.open(ModalSuccessComponent, {
			header: '',
			data: {
				text: 'No puede registrar una transferencia porque tiene conciliaciones pendientes.',
				title: '¡Alerta!',
				icon: 'assets/icons/Inclub.png'
			}
		});
	}
}
