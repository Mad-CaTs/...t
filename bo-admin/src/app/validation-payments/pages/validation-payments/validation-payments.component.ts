import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';

import { TableModel } from '@app/core/models/table.model';

import type { ITableValidatePayments } from '@interfaces/payment-validate.interface';

import { ModalSuccessPaymentComponent } from '@app/validation-payments/components/modals';
import { ModalRejectPaymentComponent } from '@app/validation-payments/components/modals';

import { TableService } from '@app/core/services/table.service';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

/* === Modules === */
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TablesModule } from '@shared/components/tables/tables.module';
import { Subscription } from 'rxjs';
import { PaymentScheduleService } from '@app/validation-payments/services/payment-schedule.service';
import { ModalLoadingComponent } from '@app/validation-payments/components/modals';
import { PaymentOptions } from '@interfaces/payment-type.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalLoadingComponentManageBusiness } from '@app/manage-business/components/modals/modal-loading/modal-loading.component';

@Component({
	selector: 'app-payment-verificate',
	standalone: true,
	imports: [CommonModule, ModalComponent, FormControlModule, ReactiveFormsModule, TablesModule],
	templateUrl: './validation-payments.component.html',
	styleUrls: ['./validation-payments.component.scss'],
	providers: [CurrencyPipe]
})
export class ValidationPaymentComponent implements OnInit, OnDestroy {

	@Input() idSuscription!: number;
	@Input() idUser!: number;
	@Input() typePayments!: number;
	@Output() paymentConfirmed = new EventEmitter<void>();

	@ViewChild('imageModal') imageModalRef!: TemplateRef<any>;
	selectedImageUrl: string = '';

	public readonly table: TableModel<ITableValidatePayments>;
	public nVouchers: number;
	public form: FormGroup;
	public paymentTypeOptions: PaymentOptions[] = [];
	private subs: Subscription[] = [];
	private expandedRows: { [key: number]: boolean } = {};
	private loadingModalRef: NgbModalRef | null = null;

	constructor(
		//public instanceModal: NgbActiveModal,
		private modalService: NgbModal,
		private builder: FormBuilder,
		private tableService: TableService,
		private paymentService: PaymentScheduleService,
		private route: ActivatedRoute,
		private cdr: ChangeDetectorRef,
		private router: Router,
		public modal: NgbModal
	) {
		this.table = this.tableService.generateTable<ITableValidatePayments>({
			headers: [
				'Descripción',
				'Fecha',
				'Capital',
				'Amortización',
				'Interés',
				'Cuota',
				'Puntaje',
				'Estado',
				'Vouchers',
				//'Cód. Operación',
				//'Medio de Pago',
				//'Nota',
				//'Moneda',
				//'Sub total',
				//'Comisión',
				//'Mora',
				//'Total',
				//'Imagen',
				'Observaciones'
			],
			headersMinWidth: [
				150, 150, 150, 150, 150, 150, 150, 150, 150,
			]
		});
		//this.table.data = tableDataMock;
		this.form = this.builder.group({
			selected: [''],
			opCode: [''],
			paymentChannel: [''],
			note: ['']

		});
		//Los demás controles se añadirán dinámicamente al obtener los datos de la API

	}

	public toggleRow(index: number) {
		this.expandedRows[index] = !this.expandedRows[index];
		this.cdr.detectChanges();
	}

	public isRowExpanded(index: number): boolean {
		return !!this.expandedRows[index];
	}


	ngOnInit(): void {
		const selectedControl = this.form.get('selected') as AbstractControl;
		const watcher = selectedControl.valueChanges.subscribe((idStr) => this.watchSelected(idStr));
		this.subs.push(watcher);

		this.route.queryParams.subscribe(params => {
			this.idSuscription = params['idSuscription'];
			this.idUser = params['idUser'];
			this.typePayments = params['typePayments']
			this.loadPaymentData();
		});
	}


	private loadPaymentData() {

		this.showLoadingModal();
		//Obtener datos de la API
		this.paymentService.getPaymentSchedule(this.idSuscription.toString()).subscribe(response => {
			if (response.result) {
				this.table.data = this.transformData(response.data);

				//Agregar controles para el nro de vouchers
				this.nVouchers = this.table.data[0]?.opCode.length || 0;
				for (let i = 0; i < this.nVouchers; i++) {
					this.form.addControl('opCode' + i, this.builder.control(''));
					this.form.addControl('paymentChannel' + i, this.builder.control(''));
				}
				this.hideLoadingModal();
				this.cdr.detectChanges();
			}
		});

		//Cargar tipos de pago
		this.paymentService.getPaymentType().subscribe(options => {
			this.paymentTypeOptions = options;
			this.cdr.detectChanges();
		});
	}


	ngOnDestroy(): void {
		this.subs.forEach((e) => e.unsubscribe());
	}

	/* === Watchers === */
	private watchSelected(idStr: string) {
		const id = Number(idStr);
		const row = this.table.data.find((t) => t.id === id);

		for (let i = 0; i < this.nVouchers; i++) {
			this.form.get('opCode' + i)?.setValue(row?.opCode[i]);
			let option = this.paymentTypeOptions.find(option => option.text === row?.paymentChannel[i]);
			this.form.get('paymentChannel' + i)?.setValue(option?.id || 1);
		}
		//this.form.get('note')?.setValue(row?.nota);
	}

	/* === Events === */
	public onConfirm(idPayment: number, numberQuotes: number) {

		let listpaymentsToValidate: Number[] = [];
		const index: number = this.table.data.findIndex(item => item.idPayment === idPayment);
		for (let i = 0; i < numberQuotes; i++) {
			if (index + i < this.table.data.length) {
				const payment: ITableValidatePayments = this.table.data[index + i];
				listpaymentsToValidate.push(payment.idPayment);
			}
			else {
				console.warn('El índice se salió del rango de la tabla.');
				break;
			}
		}

		if (this.typePayments == 3 && this.table.data[0].description[0] == 'P') {
			listpaymentsToValidate.push(this.table.data[0].idPayment);
		}


		const body = {
			idSuscription: this.idSuscription,
			listIdPaymentsValidate: listpaymentsToValidate,
			acceptedPayment: true,
			reasonRejection: {
				idReason: 1,
				reasonRejection: "Some reason",
				detail: "Some detail",
				typeReason: 2
			}
		};

		//Actualizar Voucher
		for (let i = 0; i < this.nVouchers; i++) {

			//Actualizar Op. Number
			const opCodeValue = this.form.get('opCode' + i)?.value;

			this.paymentService.modifyOperationNumber(opCodeValue, this.table.data[0].idPaymentVoucher[i].toString()).subscribe({
				next: (response) => {
				},
				error: (error) => {
					console.error('Error modifying operation number:', error);
				}
			});

			//Actualizar tipo de pago
			const methodPaymentSubTypeId = this.form.get('paymentChannel' + i)?.value;
			this.paymentService.modifyPaymentType(this.idUser.toString(), this.table.data[0].idPaymentVoucher[i], methodPaymentSubTypeId).subscribe({
				next: (response) => {
				},
				error: (error) => {
					console.error('Error modifying operation number:', error);
				}
			});

		}

		this.showLoadingModal();

		//Validar pago

		this.paymentService.validatePayment(body).subscribe({
			next: (response: any) => {
				this.hideLoadingModal();
				if (response === 'Pago validado correctamente') {
					this.paymentConfirmed.emit();
					this.modalService.open(ModalSuccessPaymentComponent, { centered: true, size: 'md' });
					this.navigateToPayments();
				} else {
					alert("ERROR: " + response);
				}
			},
			error: (error: any) => {
				this.hideLoadingModal();
				console.error('Error:', error);
				alert("ERROR en la respuesta del servidor");
			}
		});

	}


	public onReject(idPayment: number, numberQuotes: number) {


		let listpaymentsToValidate: Number[] = [];
		const index: number = this.table.data.findIndex(item => item.idPayment === idPayment);
		for (let i = 0; i < numberQuotes; i++) {
			if (index + i < this.table.data.length) {
				const payment: ITableValidatePayments = this.table.data[index + i];
				listpaymentsToValidate.push(payment.idPayment);
			}
			else {
				console.warn('El índice se salió del rango de la tabla.');
				break;
			}
		}

		if (this.typePayments == 3 && this.table.data[0].description[0] == 'P') {
			listpaymentsToValidate.push(this.table.data[0].idPayment);
		}


		for (let i = 0; i < this.nVouchers; i++) {

			//Actualizar Op. Number
			const opCodeValue = this.form.get('opCode' + i)?.value;
			this.paymentService.modifyOperationNumber(opCodeValue, this.table.data[0].idPaymentVoucher[i].toString()).subscribe({
				next: (response) => {
				},
				error: (error) => {
					console.error('Error modifying operation number:', error);
				}
			});

			//Actualizar tipo de pago
			const methodPaymentSubTypeId = this.form.get('paymentChannel' + i)?.value;
			this.paymentService.modifyPaymentType(this.idUser.toString(), this.table.data[0].idPaymentVoucher[i], methodPaymentSubTypeId).subscribe({
				next: (response) => {
				},
				error: (error) => {
					console.error('Error modifying type of payment:', error);
				}
			});

		}

		//this.instanceModal.close();

		const modalRef = this.modalService.open(ModalRejectPaymentComponent, { centered: true, size: 'md' });
		modalRef.componentInstance.idSuscription = this.idSuscription;
		modalRef.componentInstance.listIdPaymentsValidate = listpaymentsToValidate;
		modalRef.componentInstance.paymentRejected.subscribe(() => {
			this.paymentConfirmed.emit();
			this.navigateToPayments();
		});

	}

	/* === Helpers === */
	public getIsSelected(id: number) {
		const selectedControl = this.form.get('selected') as AbstractControl;

		return Number(selectedControl.value) === id;
	}

	/* === Transform Data === */
	private transformData(data: any[]): ITableValidatePayments[] {
		return data.map((item, index) => ({
			id: index + 1,
			description: item.quoteDescription,
			date: this.formatDate(item.payDate),
			capital: item.capitalBalanceUsd,
			amortization: item.amortizationUsd,
			interest: 0,
			cuota: item.quotaUsd,
			points: item.pts,
			observation: item.obs,
			numberQuotePay: item.numberQuotePay,
			state: item.statePaymentId === 1 ? 'Pagado' : (item.statePaymentId === 0 ? '' : 'Pendiente de validación'),
			opCode: item.paymentVouchers.map((v: { companyOperationNumber: number }) => v.companyOperationNumber),
			idPaymentVoucher: item.paymentVouchers.map((v: { idPaymentVoucher: number }) => v.idPaymentVoucher),
			paymentChannel: item.paymentVouchers.map((v: { nameMethodPaymentType: string, nameMethodPaymentSubType: string }) => `${v.nameMethodPaymentType} ${v.nameMethodPaymentSubType}`),
			nota: item.paymentVouchers.map((v: { note: string }) => v.note),
			currency: item.paymentVouchers.map(() => 'Dólar'),
			subtotal: item.paymentVouchers.map((v: { subTotalAmount: number }) => v.subTotalAmount),
			comission: item.paymentVouchers.map((v: { comissionPaymentSubType: number }) => v.comissionPaymentSubType),
			mora: item.paymentVouchers.map(() => 0),
			total: item.paymentVouchers.map((v: { totalAmount: number }) => v.totalAmount),
			imgUrl: item.paymentVouchers.map((v: { pathPicture: string }) => v.pathPicture),

			idPayment: item.idPayment
		}));
	}

	public formatDate(dateArray: number[]): string {
		if (!Array.isArray(dateArray) || dateArray.length < 3) {
			return 'No hay fecha';
		}
		const [year, month, day, hour = 0, minutes = 0, seconds = 0] = dateArray;
		const padNumber = (value: number): string => value.toString().padStart(2, '0');
		const formattedDay = padNumber(day);
		const formattedMonth = padNumber(month);
		const formattedHour = padNumber(hour);
		const formattedMinutes = padNumber(minutes);
		const formattedSeconds = padNumber(seconds);
		return `${formattedDay}/${formattedMonth}/${year} ${formattedHour}:${formattedMinutes}:${formattedSeconds}`;
	}
	

	public openImageModal(imageUrl: string): void {
		this.selectedImageUrl = imageUrl;
		this.modalService.open(this.imageModalRef, { centered: true, size: 'lg' });
	}

	public navigateToPayments(): void {
		if (this.typePayments == 1) {
			this.router.navigate(['/dashboard/payment-validate/initial-payments']);
		}
		else if (this.typePayments == 2) {
			this.router.navigate(['/dashboard/payment-validate/cuote-payments']);
		}
		else if (this.typePayments == 3) {
			this.router.navigate(['/dashboard/payment-validate/migration-payments']);
		}
		else {
			this.router.navigate(['/dashboard/payment-validate/initial-payments']);
		}
	}


	public refresh(): void {
		const selectedControl = this.form.get('selected') as AbstractControl;
		selectedControl.setValue('');
		this.cdr.detectChanges();
	}

	private showLoadingModal(): void {
		this.loadingModalRef = this.modal.open(ModalLoadingComponentManageBusiness, { centered: true, size: 'sm' });
	}

	private hideLoadingModal(): void {
		if (this.loadingModalRef) {
			this.loadingModalRef.close();
			this.loadingModalRef = null;
		}
	}

}
