import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatRadioModule } from '@angular/material/radio';
import { ActivatedRoute, ParamMap, Router, RouterLink } from '@angular/router';
import { TableModule } from 'primeng/table';
import RadiosComponent from '@shared/components/form-control/radios/radios.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DialogService } from 'primeng/dynamicdialog';
import { ModalProdtsDetailComponent } from '../../commons/modals/modal-prodts-detail/modal-prodts-detail';
import { ProductService } from '../../commons/services/product-service.service';
import { CommonModule, DatePipe } from '@angular/common';
import { Location } from '@angular/common';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { ModalAlertComponent } from 'src/app/profiles/commons/modals/modal-alert/modal-alert.component';
import { DataSchedules } from '../../commons/interfaces/pay-fee.interface';
import { GracePeriodService } from '../../commons/services/grace-period.service';
import DetailCardComponent from './commons/components/detail-card/detail-card.component';
import { catchError, of } from 'rxjs';
import { ConciliationService } from 'src/app/profiles/pages/ambassador/pages/payments-and-comissions/pages/conciliation/commons/services/conciliation.service';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';
import { VariableSharingService } from '../../commons/services/variable-sharing.service';
import { ModalSuccessComponent } from 'src/app/profiles/commons/modals/modal-success/modal-success.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SelectSponsorModal } from '../product/commons/modals/select-sponsor-modal/select-sponsor-modal';
import { ModalLoadingComponent } from '@shared/components/modal/modal-loading/modal-loading.component';
import { SponsorService } from '../product/commons/services/sponsor.service';
import ModalReactivacionComponent from '../product/commons/modals/modal-reactivacion/modal-reactivacion.component';
import { RejectedPaymentModalComponent } from '../../commons/modals/rejected-payment-modal/rejected-payment-modal.component';

@Component({
	selector: 'app-products-detail',
	templateUrl: './details.component.html',
	styleUrls: ['./details.component.css'],
	standalone: true,
	imports: [
		MatButtonModule,
		MatIconModule,
		RouterLink,
		MatTableModule,
		TableModule,
		MatRadioModule,
		RadiosComponent,
		ReactiveFormsModule,
		DatePipe,
		ModalComponent,
		CommonModule,
		DetailCardComponent
	],
	providers: [DialogService, NgbActiveModal]
})
export default class MyProductDetailComponent {
	selectedProduct: any;
	productId: number;
	cronograma: DataSchedules[];
	@Output() openCoAffiliateModal = new EventEmitter();
	selectedElement: DataSchedules | null = null;
	@Output() selectedElementChange = new EventEmitter<DataSchedules>();
	@Output() cuotaSeleccionada = new EventEmitter<DataSchedules>();
	showMultiplePaymentDetails: boolean = false;
	@Input() totalNumberQuotas: number = 0;
	isLoading: boolean = false;
	graceDebt: number;
	gracePeriodParameter: any;
	quotaCount: number = 0;
	form: FormGroup;
	nameSuscription: string;
	creationDate: Date;
	products: any;
	walletBlock: boolean = false;
	userId: number = this.userInfoService.userInfo.id;
	stateUser: number = this.userInfoService.userInfo.idState;
	isLiquidado = false;
	selectedSponsorId: any = null;

	isInitialPayment: boolean = false;
	isInstallmentPayment: boolean = false;

	constructor(
		private dialogService: DialogService,
		private route: ActivatedRoute,
		private productService: ProductService,
		private location: Location,
		private router: Router,
		public userInfoService: UserInfoService,
		private conciliationService: ConciliationService,
		private gracePeriodService: GracePeriodService,
		private variableSharingService: VariableSharingService,
		private sponsorService: SponsorService
	) {
		this.form = new FormGroup({
			producto: new FormControl('')
		});
	}
	displayedColumns: string[] = [
		'select',
		'description',
		'expiration_date',
		'capital',
		'amortization',
		'interest',
		'mora'
	];
	dataSource: DataSchedules[] = [];
	ngOnInit(): void {
		this.route.paramMap.subscribe((params: ParamMap) => {
			this.productId = +params.get('id');
			this.loadCronograma(this.productId);
			this.loadGracePeriod();
			this.loadSuscriptionDetail(this.productId);

			const storedProducts = localStorage.getItem('products');
			if (storedProducts) {
				this.products = JSON.parse(storedProducts);
				const product = this.products.find((p) => p.id === this.productId);
				if (product) {
					this.selectedProduct = product ?? '';
					this.nameSuscription = this.selectedProduct.nameSuscription.split(' ')[0];
				}
			}
		});
	}

	loadSuscriptionDetail(id: number): void {
		this.productService.getSuscriptionDetail(id).subscribe({
			next: (res) => {
				console.log('detallesus', res);
				this.selectedProduct = res.data;
				this.nameSuscription = res.data.nameSuscription?.split(' ')[0] || '';
			},
			error: (err) => {
				console.error('Error al obtener los detalles de la suscripción', err);
			}
		});
	}

	goBack(): void {
		this.location.back();
	}

	payMultipleInstallments(): void {
		this.isLoading = true;
		this.router.navigate([`/profile/partner/my-products/pay-fee/${this.productId}`], {
			queryParams: { isMultiple: true, productId: this.productId }
		});
	}

	showAlert() {
		const ref = this.dialogService.open(ModalAlertComponent, {
			header: '',
			width: '300px',
			data: {
				message: 'Esta suscripcion no tiene cuotas pendientes por pagar'
			},
			closable: false
		});

		ref.onClose.subscribe(() => {
			this.location.back();
		});
	}

	loadCronograma(id: number) {
		this.isLoading = true;

		this.productService
			.getCronograma(id)
			.pipe(
				catchError((error) => {
					this.isLoading = false;
					alert(
						'Hubo un error al obtener los datos del cronograma. Por favor, intente nuevamente.'
					);
					console.error('Error en la carga del cronograma:', error);
					return of([]);
				})
			)
			.subscribe((data: DataSchedules[]) => {
				this.cronograma = (data || []).map((item) => {
					// Normaliza el estado
					switch (item.statusName) {
						case 'ACTIVO':
							item.statusName = 'PAGADO';
							break;
						case 'INACTIVO':
							item.statusName = 'NO PAGADO';
							break;
					}

					// Determina los puntos que indican si es pago inicial o en cuotas
					const nombre = (item.quoteDescription || '').toLowerCase();
					if (item.payed) {
						if (nombre.includes('cuota')) {
							this.isInstallmentPayment = true;
							this.isInitialPayment = false;
						} else if (nombre.includes('inicial')) {
							this.isInitialPayment = true;
							this.isInstallmentPayment = false;
						}
					}

					return {
						...item,
						nextExpiration: item.nextExpiration ? new Date(item.nextExpiration) : null
					};
				});

				// Si todas están pagadas, resetea flags
				if (this.cronograma.every((q) => q.payed)) {
					this.isInitialPayment = false;
					this.isInstallmentPayment = false;
				}

				this.conciliationService.getConciliationPendingByUserId(this.userId).subscribe({
					next: (check) => {
						this.dataSource = this.cronograma;
						this.isLoading = false;

						this.variableSharingService.setData({
							walletBlock: check.data,
							stateUser: this.stateUser,
							gracePeriod: this.gracePeriodParameter?.valueDays - this.graceDebt || 0
						});

						if (check.data) {
							const ref = this.dialogService.open(ModalSuccessComponent, {
								header: '',
								data: {
									text: 'Para habilitar wallet, falta subir conciliación.',
									title: '¡Alerta!',
									icon: 'assets/icons/Inclub.png'
								}
							});

							ref.onClose.subscribe(() => {
								this.verifyLiquidationStatus();
							});
						} else {
							this.verifyLiquidationStatus();
						}
					},
					error: () => {
						this.isLoading = true;
					}
				});
			});
	}

	private verifyLiquidationStatus(): void {
		this.sponsorService.checkLiquidationStatus(this.userId).subscribe({
			next: (response) => {
				const isLiquidated = response.data;

				if (isLiquidated) {
					this.openPlacementModal();
				}
			},
			error: (err) => {
				console.error('Error al verificar liquidación:', err);
				alert('Hubo un problema al verificar el estado de liquidación.');
			}
		});
	}

	loadGracePeriod(): void {
		//Activo = 1, Inactivo = 0
		this.gracePeriodService.getGracePeriodActiveParameter(1).subscribe({
			next: (data) => {
				this.gracePeriodParameter = data;
			},
			error: (error) => {
				alert(error.error.message);
			}
		});

		// Enviado = 1, Aprobado = 2, Rechazo = 3
		this.gracePeriodService.getGracePeriodsBySuscriptionIdAndStatus(this.productId, 2).subscribe({
			next: (data) => {
				this.graceDebt = data.data.reduce((total, daysUsed) => total + daysUsed.daysUsed, 0);
			},
			error: (error) => {
				alert(error.error.message);
			}
		});
	}

	public get hasMultiplePayes() {
		const cuotasNoPagadas = this.cronograma.filter(
			(quote) => quote.payed === false && quote.statusName === 'NO PAGADO'
		);

		if (cuotasNoPagadas.length <= 1) {
			console.log('No hay suficientes cuotas no pagadas para habilitar el botón.');
			return false;
		}

		const primeraNoPagadaIndex = this.cronograma.findIndex(
			(quote) => quote.payed === false && quote.statusName === 'NO PAGADO'
		);

		const cuotasAnteriores = this.cronograma.slice(0, primeraNoPagadaIndex);

		const hayPendientesAntes = cuotasAnteriores.some(
			(quote) => !quote.payed === false && quote.statusName !== 'PAGADO'
		);

		if (hayPendientesAntes) {
			return false;
		}

		return true;
	}

	/* 	public get hasMultiplePayes() {
		return this.cronograma.filter((quote) => !quote.payed).length > 1;
	} */

	toggleMultiplePaymentDetails() {
		this.showMultiplePaymentDetails = !this.showMultiplePaymentDetails;
	}

	onQuoteSelection(element: DataSchedules) {
		this.selectedElement = element;
	}

	onClickOpenCoAffiliateModal(element: any): void {
		const dataToPass = { element: element, productId: this.productId, idsponsor: this.selectedSponsorId };

		if (element.statusName === 'RECHAZO CUOTA' || element.statusName === 'RECHAZO INICIAL' || element.statusName === 'RECHAZO MIGRACION') {
			const refRejected = this.dialogService.open(RejectedPaymentModalComponent, {
				width: '29.375vw',
				data: dataToPass,
				breakpoints: {
					'1440px': '35vw',
					'1200px': '40vw',
					'960px': '50vw',
					'768px': '65vw',
					'640px': '80vw',
					'480px': '90vw',
					'320px': '95vw'
				}
			});
			refRejected.onClose.subscribe(() => {
				this.openModalProductsDetail(dataToPass);
			});
		} else {
			this.openModalProductsDetail(dataToPass);
		}
	}

	openModalProductsDetail(dataToPass: any): void {

		const ref = this.dialogService.open(ModalProdtsDetailComponent, {
			header: 'Detalle de la cuota',
			width: '50vw',
			data: dataToPass,
			styleClass: 'custom-modal-header',
			breakpoints: {
				'1440px': '55vw',
				'1200px': '60vw',
				'960px': '65vw',
				'768px': '70vw',
				'640px': '80vw',
				'480px': '90vw',
				'320px': '95vw'
			}
		});
		ref.onClose.subscribe(() => {});
	}

	openPlacementModal() {
		const screenWidth = window.innerWidth;

		const modalWidth = screenWidth < 768 ? '80vw' : '35vw';

		const modalRef = this.dialogService.open(ModalReactivacionComponent, {
			width: modalWidth,
			closable: false
		});

		modalRef.onClose.subscribe((sponsor) => {
			if (sponsor) {
				console.log('Patrocinador recibido del modal:', sponsor);
				this.handleSponsorSelection(sponsor);
			} else {
				console.warn('Modal cerrado sin selección.');
			}
		});
	}

	handleSponsorSelection(sponsor: any) {
		console.log('Selección manejada en el componente principal:', sponsor);
		this.selectedSponsorId = sponsor;
	}
}
