import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { SelectComponent } from '@shared/components/form-control/select/select.component';
import {
	DialogService,
	DynamicDialogConfig,
	DynamicDialogModule,
	DynamicDialogRef
} from 'primeng/dynamicdialog';
import { DialogModule } from 'primeng/dialog';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product-service.service';
import { ModalAlertComponent } from 'src/app/profiles/commons/modals/modal-alert/modal-alert.component';
import CardCommunicatedComponent from '../../../../communicated/commons/components/card-communicated/card-communicated.component';
import { VariableSharingService } from '../../services/variable-sharing.service';

@Component({
	selector: 'modal-prodts-detail',
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		MatIconModule,
		SelectComponent,
		DialogModule,
		DynamicDialogModule,
		CardCommunicatedComponent
	],
	templateUrl: './modal-prodts-detail.html',
	styleUrls: ['./modal-prodts-detail.scss'],
	providers: [DialogService]
})
export class ModalProdtsDetailComponent implements OnInit {
	@Input() isLoading: boolean;
	product: any;
	selectedElement: any;
	@Output() botonClickeado = new EventEmitter<void>();
	productId: number;
	loadingRef: any;
	hideFields: boolean = false;
	selectedContent: any;
	isImageZoomed: boolean = false;
	paymentDetails: any = {};
	walletBlock: boolean = false;
	vouchers: Array<{ imagePath: string }> = [];
	selectedVoucher: { type: string; imagePath: string } | null = null;
	/* 	gracePeriod: number = this.variableSharingService.getData().gracePeriod;
	 */ /* stateUser: number = this.variableSharingService.getData().stateUser; */
	cronograma: any[] = [];

	selectedSponsorId: any = null;
	constructor(
		private router: Router,
		private productService: ProductService,
		public ref: DynamicDialogRef,
		public config: DynamicDialogConfig,
		private dialogService: DialogService,
		private variableSharingService: VariableSharingService
	) {}

	ngOnInit(): void {
		this.initializePaymentDetails();
		this.setImageContent();
	}

	initializePaymentDetails(): void {
		console.log(' this.config.data', this.config.data);

		this.paymentDetails = this.config.data?.element;
		console.log(' paymentDetailsprue', this.paymentDetails);
		this.cronograma = this.config.data.cronograma;

		this.productId = this.config.data?.productId;
		this.walletBlock = this.config.data?.walletBlock;
		if (this.config.data?.hideFields !== undefined) {
			this.hideFields = this.config.data.hideFields;
		}
	}

	setImageContent(): void {
		if (this.paymentDetails?.vouchers?.length > 0) {
			this.selectedVoucher = {
				type: 'image',
				imagePath: this.paymentDetails.vouchers[0].pathPicture
			};

			this.vouchers = this.paymentDetails.vouchers.map((voucher) => ({
				imagePath: voucher.pathPicture
			}));
		} else {
			this.selectedVoucher = null;
			this.vouchers = [];
		}
	}

	selectVoucher(voucher: { imagePath: string }): void {
		this.selectedVoucher = {
			type: 'image',
			imagePath: voucher.imagePath
		};
	}

	/* 	onClickButton(): void {
	if (!this.paymentDetails || !this.cronograma) return;

	const cuotasPendientes = this.cronograma
		.filter((item: any) => item.idStatePayment === 0)
		.sort((a: any, b: any) => a.positionOnSchedule - b.positionOnSchedule);

	const primeraCuotaPendiente = cuotasPendientes[0];

	if (!primeraCuotaPendiente) {
		alert('No hay cuotas pendientes por pagar.');
		return;
	}

	if (this.paymentDetails.positionOnSchedule !== primeraCuotaPendiente.positionOnSchedule) {
		alert('⚠️ La cuota seleccionada no es la cuota a pagar.');
		return;
	}

	const idPayment = this.paymentDetails.idSuscription;
	console.log('✅ Navegando con idPayment:', idPayment);
	console.log('➡️ Cuota que pasa:', primeraCuotaPendiente);

	this.closeModal();

	this.router.navigate([`/profile/partner/my-products/pay-fee/${idPayment}`], {
		queryParams: {
			productId: JSON.stringify(primeraCuotaPendiente), 
			idsponsor: this.config.data?.idsponsor
		}
	});
}
 */

	onClickButton() {
		if (this.paymentDetails) {
			const idPayment = this.paymentDetails.idPayment;
			this.isLoading = true;

			console.log('idPayment:', idPayment);

			this.productService.getCronograma(this.productId).subscribe(
				(cronograma) => {
					this.isLoading = false;

					const currentQuote = cronograma.find((quote) => quote.idPayment === idPayment);
					console.log('currentQuote:', currentQuote);

					if (!currentQuote) {
						console.log('No se encontró la cuota actual.');
						return;
					}

					const previousQuotes = cronograma.filter(
						(quote) => quote.positionOnSchedule < currentQuote.positionOnSchedule
					);
					console.log('previousQuotes:', previousQuotes);

					const anyPreviousNotPaid = previousQuotes.some(
						(quote) => !['ACTIVO', 'ACEPTADA'].includes(quote.statusName)
					);
					console.log('anyPreviousNotPaid:', anyPreviousNotPaid);

					if (anyPreviousNotPaid) {
						window.alert(
							'Existen cuotas anteriores que aún no han sido aceptadas. Debe completar todos los pagos y confirmar las cuotas anteriores antes de continuar.'
						);
						return;
					}

					this.closeModal();
					this.router.navigate([`/profile/partner/my-products/pay-fee/${idPayment}`], {
						queryParams: {
							productId: this.productId,
							walletBlock: this.walletBlock,
							idsponsor: this.config.data?.idsponsor
						}
					});
				},
				(error) => {
					this.isLoading = false;
					console.error('Error al obtener el cronograma:', error);
					window.alert('Hubo un problema al obtener los datos del cronograma.');
				}
			);
		}
	}

	showAlert() {
		this.dialogService.open(ModalAlertComponent, {
			header: '',
			width: '300px',
			data: {
				message: 'Esta no es la cuota pendiente a pagar'
			},
			closable: false
		});
	}

	closeModal() {
		this.ref.close();
	}

	/*  selectVoucher(index: number): void {
     this.selectedVoucher = this.paymentDetails.vouchers[index];
   } */

	selectContent(type: string, index: number) {
		if (type === 'image') {
			this.selectedContent = {
				type: 'image',
				imagePath: this.paymentDetails.vouchers[index]?.pathPicture
			};
		}
	}

	toggleImageZoom() {
		this.isImageZoomed = !this.isImageZoomed;
	}
}
