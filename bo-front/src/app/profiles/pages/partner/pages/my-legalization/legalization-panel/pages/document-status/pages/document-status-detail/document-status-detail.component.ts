import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { StatusProgressCircleComponent } from '../../commons/components/status-progress-circle/status-progress-circle.component';
import { StatusTimelineStepComponent } from '../../commons/components/status-timeline-step/status-timeline-step.component';
import { FormBuilder, FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { BreadcrumbItem } from '@shared/interfaces/breadcrumb';
import { getDocumentStatusBreadcrumbs } from '../../commons/constans';
import { ActivatedRoute, Router } from '@angular/router';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';
import { LegalizationRequestService } from '../../commons/services/legalization-request-service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Location } from '@angular/common';
import { DialogService } from 'primeng/dynamicdialog';
import { ModalPaymentBankContainer } from 'src/app/profiles/pages/ambassador/pages/new-partner/pages/new-partner-payment/commons/modals/modal-payment-bank/modal-payment-bank.container';
import { ModalPartnerPaymentService } from 'src/app/profiles/pages/ambassador/pages/new-partner/pages/new-partner-payment/servicio/new-partner-payment.service';
import { finalize, tap } from 'rxjs';
import {
	GetCurrenciesByCountry,
	getPaymentListByContry
} from 'src/app/profiles/pages/ambassador/pages/new-partner/pages/new-partner-payment/commons/contants';
import { ModalPaymentService } from 'src/app/profiles/pages/ambassador/pages/new-partner/pages/new-partner-payment/commons/sevices/modal-payment.service';
import { ISelect } from '@shared/interfaces/forms-control';
import { ModalPaymentLegalComponent } from '../../../../../commons/modals/modal-payment-legal/modal-payment-legal.component';
import { ModalPaymentLegalContainer } from '../../../../../commons/modals/modal-payment-legal/modal-payment-legal.container';
import { ModalPaymentBankComponent } from 'src/app/profiles/pages/ambassador/pages/new-partner/pages/new-partner-payment/commons/modals/modal-payment-bank/modal-payment-bank.component';
import {
	buildVoucherPayload,
	validateTotalAmount,
	VoucherModalData
} from '../../commons/constans/build-reupload-voucher-payload';
import { ModalSuccessComponent } from 'src/app/profiles/commons/modals/modal-success/modal-success.component';
import { SuccessfulPaymentDetailModal } from '../../commons/modals/successful-payment-detail-modal/successful-payment-detail-modal.component';

@Component({
	selector: 'app-document-status-detail',
	standalone: true,
	imports: [
		CommonModule,
		StatusProgressCircleComponent,
		StatusTimelineStepComponent,
		BreadcrumbComponent,
		ProgressSpinnerModule
	],
	templateUrl: './document-status-detail.component.html',
	styleUrl: './document-status-detail.component.scss'
})
export class DocumentStatusDetailComponent {
	breadcrumbItems: BreadcrumbItem[] = [];
	form!: FormGroup;
	selectedStep: number | null = null;
	idUsuario: number;
	steps: any[] = [];
	data: any;
	isLoading = true;
	paymentTypeList: any;
	residenceContry: string;
	public paymentTypeListaFiltered: any;
	public walletBlock: boolean = false;
	public idMetodoDesdeApi: number;
	public operationCurrency: ISelect[];
	vouchersList: any;
	loading = false;
	selectedProduct: any;
	voucherToEdit: any;
	indexEdit: number = null;
	public exchangeType: number;
	methodSelected: any;
	documentId: any;
	documentsData: any;
	vouchers: any[] = [];
	dataVouchers: any[] = [];
	constructor(
		private router: Router,
		private formBuilder: FormBuilder,

		private fb: FormBuilder,
		private route: ActivatedRoute,
		private userInfoService: UserInfoService,
		private legalizationRequestService: LegalizationRequestService,
		private location: Location,
		private dialogService: DialogService,
		private modalPartnerPaymentService: ModalPartnerPaymentService,
		private modalPaymentService: ModalPaymentService
	) {
		this.idUsuario = this.userInfoService.userInfo?.id;
		this.residenceContry = this.userInfoService.userInfo.idResidenceCountry;
		this.form = formBuilder.group({
			paymentMethod: [null, Validators.required]
		});
	}

	ngOnInit(): void {
		this.initData();
		this.selectedProduct = JSON.parse(sessionStorage.getItem('selectedProduct') || '{}');
	}

	private initData() {
		this.documentId = this.getDocumentKeyFromRoute();
		this.selectedProduct = JSON.parse(sessionStorage.getItem('selectedProduct') || '{}');
		this.getVouchers(this.documentId);
		this.initBreadcrumbs();
		this.initForm();
		this.getDocumentKeyFromRoute();
		this.fetchDocumentProgress();
		this.getPaymentType();
		this.getCurrencyList();
		this.getTC();
	}

	private getTC() {
		this.modalPaymentService.getTipoCambio().subscribe((exchangeType) => {
			this.exchangeType = exchangeType.sale;
		});
	}

	private initBreadcrumbs(): void {
		const panelId = this.selectedProduct.data?.id || 0;
		this.breadcrumbItems = getDocumentStatusBreadcrumbs(this.router, panelId);
	}

	private initForm(): void {
		this.form = this.fb.group({
			selectedStep: [false],

			prueba: ['']
		});
	}

	private getDocumentKeyFromRoute(): string | null {
		return this.route.snapshot.paramMap.get('documentKey');
	}

	private fetchDocumentProgress(): void {
		const documentKey = this.getDocumentKeyFromRoute();
		if (!documentKey) return;
		this.isLoading = true;

		this.legalizationRequestService.getDocumentProgress(documentKey).subscribe({
			next: (res) => {
				this.steps = res.data?.steps || [];
				this.data = res.data;
				console.log('datagneral', this.data);
				this.isLoading = false;
			},
			error: (err) => {
				console.error('Error al obtener el progreso del documento:', err);
				this.isLoading = false;
			}
		});
	}

	onStepSelected(id: number): void {
		this.form.get('selectedStep')?.setValue(id);
	}

	isSelected(id: number): boolean {
		return this.form.get('selectedStep')?.value === id;
	}
	public getPaymentType() {
		this.modalPartnerPaymentService
			.getPaymenttype()
			.pipe(
				tap((paymentTypeList) => {
					this.paymentTypeList = paymentTypeList;
				}),
				tap(() => {
					if (this.residenceContry) {
						this.setPaymentTypeListaFiltered(this.residenceContry);
					}
				})
			)
			.subscribe();
	}

	private setPaymentTypeListaFiltered(country: string) {
		this.paymentTypeListaFiltered = getPaymentListByContry(
			this.paymentTypeList.filter((payment) => payment.description !== 'WALLET'),
			country,
			this.walletBlock
		);
	}

	private getCurrencyList() {
		this.modalPaymentService
			.getCurrency()
			.pipe(tap((monedas) => (this.operationCurrency = monedas)))
			.subscribe();
	}

	getVouchers(documentId: string) {
		this.loading = true;
		this.legalizationRequestService.getVouchersFromApi(documentId).subscribe({
			next: (data) => {
				this.vouchersList = data;
				this.voucherToEdit = this.vouchersList.vouchers || [];
				this.setMethodSelectedFromVouchers();
				this.loading = false;
			},
			error: (err) => {
				console.error('Error al obtener vouchers:', err);
				this.loading = false;
			}
		});
	}
	setMethodSelectedFromVouchers() {
		if (!this.voucherToEdit || this.voucherToEdit.length === 0) {
			console.warn('No hay vouchers para armar methodSelected');
			return;
		}

		const idPaymentTypeSeleccionado = this.vouchersList?.typeMethodPayment;

		const metodoFiltrado = this.paymentTypeList.find(
			(m) => m.idPaymentType === idPaymentTypeSeleccionado
		);

		this.methodSelected = metodoFiltrado
			? {
					idPaymentMethod: metodoFiltrado.idPaymentMethod,
					idPaymentType: metodoFiltrado.idPaymentType,
					paymentSubTypeList: metodoFiltrado.paymentSubTypeList
			  }
			: {
					idPaymentMethod: null,
					idPaymentType: null,
					paymentSubTypeList: []
			  };
	}

	abrirModal(step: any): void {
		console.log('stepsantesdemodapruebal', step);
		if (step.stepOrder === 2 && step.statusCode === '2') {
			console.log('Abrir modal de solo ver detalle');

			this.openPaymentInfoModal();
		} else if (step.stepOrder === 2 && step.statusCode === '3') {
			console.log('Abrir modal de modificar');
			this.openPaymentBank();
		}
	}
	openPaymentInfoModal(): void {
		this.loadVouchers(() => {
			this.dialogService
				.open(SuccessfulPaymentDetailModal, {
					header: `Pago vía transferencia por ${this.vouchers[0]?.paymentMethod}.`,
					width: '400px',
					data: {
						title: 'Pago exitoso',
						data: this.dataVouchers,
						buttonText: 'Aceptar',
						returnValue: 'confirmar'
					}
				})
				.onClose.subscribe((result: any) => {
					if (result === 'confirmar') {
						console.log('Usuario confirmó el modal de pago exitoso');
					}
				});
		});
	}

	loadVouchers(callback?: () => void): void {
		this.isLoading = true;
		this.legalizationRequestService
			.getLegalizationVouchers(this.documentId)
			.pipe(finalize(() => (this.isLoading = false)))
			.subscribe({
				next: (res) => {
					this.dataVouchers = res || [];
					console.log('Vouchers:', res);
					this.vouchers = res.vouchers || [];
					if (callback) callback();
				},
				error: (err) => {
					console.error('Error al cargar vouchers', err);
				}
			});
	}

	public openPaymentBank() {
		const isMobile = window.innerWidth <= 768;
		this.idMetodoDesdeApi = this.vouchersList?.typeMethodPayment;
		const metodoEncontrado = this.paymentTypeListaFiltered.find(
			(p) => p.idPaymentType === this.idMetodoDesdeApi
		);
		const listCurrencies = this.operationCurrency.filter((currency) =>
			GetCurrenciesByCountry(this.residenceContry).includes(currency.value)
		);
		this.dialogService
			.open(ModalPaymentBankContainer /* ModalPaymentLegalContainer */, {
				header: `Pago en efectivo (${
					this.vouchersList?.vouchers?.[0]?.paymentMethod || 'Sin método'
				})`,
				width: isMobile ? '95vw' : '60vw',
				styleClass: 'custom-modal-css',
				dismissableMask: true,
				data: {
					methodSelected: this.methodSelected,
					exchangeType: this.exchangeType,
					operationCurrency: listCurrencies,
					totalAmountPaid: this.vouchersList.priceTarifa,
					voucherToEdit: this.voucherToEdit[0],
					indexEdit: 0,
					isFromStepTimelineobs: true
				}
			})
			.onClose.subscribe((data) => {
				if (data) {
					this.handleVoucherModalClose(data);
				}
			});
	}

	handleVoucherModalClose(data: any) {
		if (!data || !data.listaVouches || data.listaVouches.length === 0) return;

		const hasEmptyField = data.listaVouches.some(
			(voucher) =>
				!voucher.currency ||
				!voucher.currencyDescription ||
				!voucher.totalAmount ||
				!voucher.methodSubTipoPagoId ||
				!voucher.operationNumber ||
				!voucher.note ||
				voucher.imagen === null
		);

		if (hasEmptyField) {
			alert('Tienes campos requeridos por completar');
			return;
		}

		const payload = buildVoucherPayload(data.listaVouches);

		const isValid = validateTotalAmount(data.listaVouches, data.montoTotalEsperado);
		if (!isValid) {
			alert('Los montos no coinciden');
			return;
		}

		this.legalizationRequestService.reuploadVouchers(this.documentId, payload).subscribe({
			next: (res) => {
				this.showResultModal(true);
			},
			error: (err) => {
				console.error('Error al subir vouchers', err);
				this.showResultModal(false);
			}
		});
	}

	private showResultModal(success: boolean) {
		const ref = this.dialogService.open(ModalSuccessComponent, {
			header: '',
			width: '40%',
			data: {
				text: success
					? 'Hemos registrado correctamente la corrección de su pago. En breve recibirá los detalles por correo o a través de las notificaciones del sistema.'
					: 'Ocurrió un problema al enviar los vouchers.',
				title: success ? 'Corrección enviada' : 'Error en el envío',
				icon: success ? 'check_circle_outline' : 'error_outline'
			}
		});

		ref.onClose.subscribe(() => {
			this.router.navigate(['/profile/partner/my-legalization']);
		});
	}
}
