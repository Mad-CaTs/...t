import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';

import { TableModel } from '@app/core/models/table.model';

import type { ITableValidatePayments } from '@interfaces/payment-validate.interface';

import { ModalSuccessPaymentComponent } from '../modal-success-payment/modal-success-payment.component';
import { ModalRejectPaymentComponent } from '../modal-reject-payment/modal-reject-payment.component';

import { TableService } from '@app/core/services/table.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

/* === Modules === */
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TablesModule } from '@shared/components/tables/tables.module';
import { Subscription } from 'rxjs';
import { PaymentScheduleService } from '@app/validation-payments/services/payment-schedule.service';
import { ModalLoadingComponent } from '../modal-loading/modal-loading.component';
import { PaymentOptions } from '@interfaces/payment-type.interface';

@Component({
	selector: 'app-modal-verificate',
	standalone: true,
	imports: [CommonModule, ModalComponent, FormControlModule, ReactiveFormsModule, TablesModule],
	templateUrl: './modal-verificate.component.html',
	styleUrls: ['./modal-verificate.component.scss'],
	providers: [CurrencyPipe]
})
export class ModalVerificateComponent implements OnInit, OnDestroy {

	@Input() idSuscription!: number;
	@Input() idUser!: number;
	@Output() paymentConfirmed = new EventEmitter<void>();

	@ViewChild('imageModal') imageModalRef!: TemplateRef<any>;
	selectedImageUrl: string = '';

	public readonly table: TableModel<ITableValidatePayments>;
	public nVouchers: number;
	public form: FormGroup;
	public paymentTypeOptions: PaymentOptions[] = [];
	private subs: Subscription[] = [];

	constructor(
		public instanceModal: NgbActiveModal,
		private modalService: NgbModal,
		private builder: FormBuilder,
		private tableService: TableService,
		private paymentService: PaymentScheduleService
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
				'Cód. Operación',
				'Medio de Pago',
				'Nota',
				'Moneda',
				'Sub total',
				'Comisión',
				'Mora',
				'Total',
				'Imagen',
				'Observaciones'
			],
			headersMinWidth: [
				150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150
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

	ngOnInit(): void {
		const selectedControl = this.form.get('selected') as AbstractControl;
		const wacher = selectedControl.valueChanges.subscribe((idStr) => this.watchSelected(idStr));

		this.subs.push(wacher);

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
			}
		});

		//Cargar tipos de pago
		this.paymentService.getPaymentType().subscribe(options => {
			this.paymentTypeOptions = options;
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
	public onConfirm(idPayment: number) {
		const body = {
			idSuscription: this.idSuscription,
			listIdPaymentsValidate: [idPayment],
			acceptedPayment: true,
			reasonRejection: {
				idReason: 1,
				reasonRejection: "Some reason",
				detail: "Some detail",
				typeReason: 2
			}
		};

		this.modalService.open(ModalLoadingComponent, { centered: true, size: 'md' });

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


		//Validar pago
		this.paymentService.validatePayment(body).subscribe({
			next: (response: any) => {
				if (response === 'Pago validado correctamente') {
					this.instanceModal.close();
					this.paymentConfirmed.emit();
					this.modalService.open(ModalSuccessPaymentComponent, { centered: true, size: 'md' });
				} else {
					alert("ERROR: " + response);
				}
			},
			error: (error: any) => {
				console.error('Error:', error);
				alert("ERROR en la respuesta del servidor");
			}
		});

	}


	public onReject(idPayment: number) {

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

		this.instanceModal.close();
		const modalRef = this.modalService.open(ModalRejectPaymentComponent, { centered: true, size: 'md' });
		modalRef.componentInstance.idSuscription = this.idSuscription;
		modalRef.componentInstance.listIdPaymentsValidate = [idPayment];
		modalRef.componentInstance.paymentRejected.subscribe(() => {
			this.paymentConfirmed.emit();
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
			state: 'Pendiente de validación',
			observation: item.obs,
			numberQuotePay: item.numberQuotePay,
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

	private formatDate(dateInput: string | number[]): string {
		if (!dateInput) return '';
		let date: Date;
		if (Array.isArray(dateInput)) {
			const [year, month, day, hour = 0, minute = 0, second = 0] = dateInput;
			date = new Date(year, month - 1, day, hour, minute, second);
		} else {
			date = new Date(dateInput);
		}
		const day = String(date.getDate()).padStart(2, '0');
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const year = String(date.getFullYear());
		const hours = String(date.getHours()).padStart(2, '0');
		const minutes = String(date.getMinutes()).padStart(2, '0');
		const seconds = String(date.getSeconds()).padStart(2, '0');
		return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
	}


	public openImageModal(imageUrl: string): void {
		this.selectedImageUrl = imageUrl;
		this.modalService.open(this.imageModalRef, { centered: true, size: 'lg' });
	}


}
