import { ChangeDetectorRef, Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '@app/users/services/user.service';
import { ISelectOpt } from '@interfaces/form-control.interface';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EditableFields, PaymentVoucher, Register } from '@interfaces/partners.interface';
import { ModalConfirmationComponent } from '@shared/components/modal-confirmation/modal-confirmation.component';
import { ModalEditScheduleComissionComponent } from '../modal-edit-schedule-comission/modal-edit-schedule-commission.component';
import { ScheduleService } from '@app/schedule/services/schedule.service';
import { ToastService } from '@app/core/services/toast.service';
import { ModalLoadingComponentManageBusiness } from '@app/manage-business/components/modals/modal-loading/modal-loading.component';

@Component({
	selector: 'app-modal-edit-schedule',
	templateUrl: './modal-edit-schedule.component.html',
	styleUrls: ['./modal-edit-schedule.component.scss']
})
export class ModalEditScheduleComponent {
	@Input() idUser: any;
	@Input() userName: string;
	@Input() fullName: string;
	@Input() document: string;
	@Input() typeDocument: string;
	@Input() statusValue: string;
	@Input() subscriptionName: string;
	@Input() idSuscripcion: number;
	@Input() packages: any[] = [];
	@Input() packageCurrent: any;

	@ViewChild('imageModal') imageModalRef!: TemplateRef<any>;

	selectedImageUrl: string = '';
	registers: Register[] = [];
	listwithvoucher: string[] = [];
	loading = true;
	noData = false;
	noDataMessage = '';
	editCascade = true;
	editCasExchange = true;
	editCasQuoteUsd = true;
	editCasNextExp = true;
	calculateCheck = true;
	checkCalculateState: boolean[] = [];
	form: FormGroup;
	packageOpt: ISelectOpt[] = [];
	tempPayDates: string[] = [];
	buttonLoading: boolean = false;
	deletedPayments: number[] = [];

	private loadingModalRef: NgbModalRef | null = null;

	constructor(
		public activeModal: NgbActiveModal,
		private fb: FormBuilder,
		private cdr: ChangeDetectorRef,
		private userService: UserService,
		private modalService: NgbModal,
		private scheduleService: ScheduleService,
		private toastManager: ToastService,
		public modal: NgbModal
	) {
		this.form = this.fb.group({
			package: ['']
		});

		this.packageOpt = [];
	}

	ngOnInit(): void {
		this.getRegister();
	}

	getRegister(): void {
		this.loading = true;
		this.scheduleService.getSchedule(this.idSuscripcion).subscribe((response) => {
			this.loading = false;
			this.registers = response;
			this.checkCalculateState = this.registers.map(() => true);
		});
	}

	populateVoucherList(): void {
		this.listwithvoucher = [];
		let indexquote = 1;
		let indexinitial = 1;
		let indexmig = 1;

		this.registers.forEach((item) => {
			let txtdescription = item.quoteDescription.toLowerCase();
			let nvoucher = item.paymentVouchers.length;

			if (txtdescription.includes('cuota') && nvoucher > 0) {
				var regex = /(\d+)/g;
				indexquote = txtdescription.match(regex) as any;
				this.listwithvoucher.push('C' + indexquote);
				for (let j = 0; j < nvoucher; j++) {
					let subnum = String(j + 1);
					this.listwithvoucher.push('C' + indexquote + '-' + subnum);
				}
				indexquote += 1;
			} else if (txtdescription.includes('ini') && nvoucher > 0) {
				var regex = /(\d+)/g;
				indexinitial = txtdescription.match(regex) as any;
				this.listwithvoucher.push('I' + indexinitial);
				for (let j = 0; j < nvoucher; j++) {
					let subnum = String(j + 1);
					this.listwithvoucher.push('I' + indexinitial + '-' + subnum);
				}
				indexinitial += 1;
			} else if (txtdescription.includes('migra') && nvoucher > 0) {
				var regex = /(\d+)/g;
				indexmig = txtdescription.match(regex) as any;
				this.listwithvoucher.push('M' + indexmig);
				for (let j = 0; j < nvoucher; j++) {
					let subnum = String(j + 1);
					this.listwithvoucher.push('M' + indexmig + '-' + subnum);
				}
				indexmig += 1;
			}
		});
	}

	handleCascade(event: Event, field: keyof this): void {
		const input = event.target as HTMLInputElement;
		const isChecked = input.checked;

		switch (field) {
			case 'editCascade':
				this.editCascade = isChecked;
				break;
			case 'editCasExchange':
				this.editCasExchange = isChecked;
				break;
			case 'editCasQuoteUsd':
				this.editCasQuoteUsd = isChecked;
				break;
			case 'editCasNextExp':
				this.editCasNextExp = isChecked;
				break;
			default:
				console.warn(`Campo no reconocido:`);
				break;
		}
	}

	private reorderQuotes(): void {
		console.log(this.registers);

		const initials: Register[] = [];
		const migrations: Register[] = [];
		const quotes: Register[] = [];

		this.registers.forEach((register) => {
			const description = register.quoteDescription.toLowerCase();

			if (description.includes('inicial')) {
				initials.push(register);
			} else if (description.includes('migración')) {
				migrations.push(register);
			} else if (description.includes('cuota')) {
				quotes.push(register);
			}
		});

		const sortByNumber = (a: Register, b: Register) => {
			const numA = parseInt(a.quoteDescription.match(/\d+/)?.[0] || '0', 10);
			const numB = parseInt(b.quoteDescription.match(/\d+/)?.[0] || '0', 10);
			return numA - numB;
		};

		initials.sort(sortByNumber);
		migrations.sort(sortByNumber);
		quotes.sort(sortByNumber);

		initials.forEach((item, index) => {
			item.quoteDescription = `Inicial N° : ${index + 1}`;
		});

		migrations.forEach((item, index) => {
			item.quoteDescription = `Migración N° : ${index + 1}`;
		});

		quotes.forEach((item, index) => {
			item.quoteDescription = `Cuota N° : ${index + 1}`;
		});

		this.registers = [...initials, ...quotes, ...migrations];
	}

	formatDateToDDMMYYYY(date: Date): string {
		const day = ('0' + date.getDate()).slice(-2);
		const month = ('0' + (date.getMonth() + 1)).slice(-2);
		const year = date.getFullYear();
		return `${day}-${month}-${year}`;
	}

	parseDDMMYYYY(dateString: string): Date | null {
		const parts = dateString.split('-');
		if (parts.length !== 3) {
			console.error('Invalid date format');
			return null;
		}
		const day = parseInt(parts[0], 10);
		const month = parseInt(parts[1], 10) - 1;
		const year = parseInt(parts[2], 10);

		const date = new Date(year, month, day);
		if (isNaN(date.getTime())) {
			console.error('Invalid date value');
			return null;
		}
		return date;
	}

	updateCascadingQuotes(startIndex: number): void {
		const startQuoteDescription = this.registers[startIndex].quoteDescription;
		const regex = /(\d+)/; // Buscar el número en la descripción

		const match = startQuoteDescription.match(regex);
		if (!match || match.length < 2) {
			console.error('Descripción inicial inválida:', startQuoteDescription);
			return;
		}

		let currentQuoteNumber = parseInt(match[1], 10); // Obtener el número inicial

		for (let i = startIndex; i < this.registers.length; i++) {
			const description = this.registers[i].quoteDescription.toLowerCase();

			if (description.includes('cuota') || description === '') {
				this.registers[i].quoteDescription = `Cuota N° : ${currentQuoteNumber}`;
				currentQuoteNumber++;
			}
		}
	}

	handleItemQuotes(value: any, field: keyof Register, id: number): void {
		if (id < 0 || id >= this.registers.length) {
			console.error('Índice fuera de rango:', id);
			return;
		}

		(this.registers[id][field] as unknown as (typeof this.registers)[0][keyof Register]) = value;

		if (this.editCascade && field === 'quoteDescription') {
			this.updateCascadingQuotes(id);
		}
	}

	updateCascadingDates(startIndex: number): void {
		const startDate = this.parseDDMMYYYY(this.registers[startIndex].nextExpiration);
		if (!startDate) {
			return;
		}

		for (let i = startIndex + 1; i < this.registers.length; i++) {
			const nextDate = new Date(startDate);
			nextDate.setMonth(nextDate.getMonth() + (i - startIndex));
			this.registers[i].nextExpiration = this.formatDateToDDMMYYYY(nextDate);
		}
	}

	handleItem(value: any, field: keyof Register, id: number): void {
		if (id < 0 || id >= this.registers.length) {
			console.error('Índice fuera de rango:', id);
			return;
		}

		(this.registers[id][field] as unknown as (typeof this.registers)[0][keyof Register]) = value;

		if (this.editCasNextExp && field === 'nextExpiration') {
			this.updateCascadingDates(id);
		}
	}

	handleItemNext(e: any, field: string, idx: number): void {}

	handleItemExchange(value: any, field: keyof Register, id: number): void {
		if (id < 0 || id >= this.registers.length) {
			console.error('Índice fuera de rango:', id);
			return;
		}

		const exchange = value;

		if (this.editCasExchange) {
			for (let i = id; i < this.registers.length; i++) {
				this.registers[i].dollarExchange = exchange;
				let dollar = Number(this.registers[i].quoteUsd);
				let total = Number(exchange) > 0 ? dollar * Number(exchange) : 0;
				total = Math.round((total + Number.EPSILON) * 100) / 100;
				this.registers[i].amortization = total;
			}
		} else {
			(this.registers[id][field] as unknown as (typeof this.registers)[0][keyof Register]) = exchange;
			let dollar = Number(this.registers[id].quoteUsd);
			let total = Number(exchange) > 0 ? dollar * Number(exchange) : 0;
			total = Math.round((total + Number.EPSILON) * 100) / 100;
			this.registers[id].amortization = total;
		}
	}

	handleItemV(value: any, field: keyof PaymentVoucher, idx: number, idv: number): void {
		if (
			idx < 0 ||
			idx >= this.registers.length ||
			idv < 0 ||
			idv >= this.registers[idx].paymentVouchers.length
		) {
			console.error('Índice fuera de rango:', idx, idv);
			return;
		}

		(this.registers[idx].paymentVouchers[idv][field] as any) = value;
	}

	handleItemQuoteUsd(value: any, field: keyof Register, id: number): void {
		if (id < 0 || id >= this.registers.length) {
			console.error('Índice fuera de rango:', id);
			return;
		}

		const quoteUsd = value;

		if (this.editCasQuoteUsd) {
			for (let i = id; i < this.registers.length; i++) {
				this.registers[i].quoteUsd = quoteUsd;
				let exchange = Number(this.registers[i].dollarExchange);
				let total = exchange > 0 ? Number(quoteUsd) * exchange : 0;
				total = Math.round((total + Number.EPSILON) * 100) / 100;
				this.registers[i].amortization = total;
			}
		} else {
			(this.registers[id][field] as unknown as (typeof this.registers)[0][keyof Register]) = quoteUsd;
			let exchange = Number(this.registers[id].dollarExchange);
			let total = exchange > 0 ? Number(quoteUsd) * exchange : 0;
			total = Math.round((total + Number.EPSILON) * 100) / 100;
			this.registers[id].amortization = total;
		}
	}

	handleCheckItem(event: any, idx: number): void {
		this.checkCalculateState[idx] = event.target.checked;
		this.calculateCheck = this.checkCalculateState.every((state) => state);
	}

	async openConfirmationModal(
		title: string,
		icon: string,
		body: string,
		buttons: { text: string; className: string; onClick: () => void }[]
	): Promise<boolean> {
		const modalRef = this.modalService.open(ModalConfirmationComponent);
		modalRef.componentInstance.title = title;
		modalRef.componentInstance.icon = icon;
		modalRef.componentInstance.body = body;
		modalRef.componentInstance.buttons = buttons.map((button) => ({
			...button,
			onClick: () => {
				button.onClick();
				modalRef.close(button.text.toLowerCase());
			}
		}));

		return modalRef.result.then(
			(result) => result === 'confirm',
			() => false
		);
	}

	async deleteItem(event: any, idx: number, item: Register): Promise<void> {
		if (item.paymentVouchers && item.paymentVouchers.length > 0) {
			const confirmed = await this.openConfirmationModal(
				'Aviso',
				'fa fa-exclamation-triangle',
				'Está por eliminar una cuota que contiene vouchers. Si elimina esta, se borrarán los vouchers que contenga la cuota. ¿Desea continuar?',
				[
					{
						text: 'Cancelar',
						className: 'btn btn-secondary',
						onClick: () => {}
					},
					{
						text: 'Eliminar',
						className: 'btn btn-danger',
						onClick: () => {}
					}
				]
			);

			if (confirmed) {
				if (item.idPayment != null) {
					this.deletedPayments.push(item.idPayment);
				}
				this.registers.splice(idx, 1);
				this.registers.forEach((item, index) => (item.positionOnSchedule = index + 1));
			}
		} else {
			if (item.idPayment != null) {
				this.deletedPayments.push(item.idPayment);
			}
			this.registers.splice(idx, 1);
			this.registers.forEach((item, index) => (item.positionOnSchedule = index + 1));
		}
	}

	handleCheck(event: any): void {
		const checked = event.target.checked;
		this.calculateCheck = checked;
		this.checkCalculateState = this.checkCalculateState.map(() => checked);
	}

	onBlurDes(e: any, field: keyof Register, idx: number): void {
		const value = e.target.value;
		(this.registers[idx][field] as any) = value;
	}

	addRegisterUp(e: any, idx: number): void {
		const register: Register = {
			...this.registers[idx],
			positionOnSchedule: this.registers.length + 1,
			quoteDescription: '',
			nextExpiration: '',
			dollarExchange: 0,
			quoteUsd: 0,
			amortization: 0,
			capitalBalance: 0,
			percentage: 0,
			// interested: 0,
			statePaymentId: 0,
			isQuoteInitial: 0,
			obs: '',
			payDate: '',
			pts: 0,
			paymentVouchers: []
		};

		this.registers.splice(idx, 0, register);
		this.registers.forEach((item, index) => (item.positionOnSchedule = index + 1));
	}

	calculate(): void {
		let totalQuote = 0;
		this.registers.forEach((a, index) => {
			if (this.checkCalculateState[index]) {
				totalQuote += a.quoteUsd;
			}
		});
		totalQuote = Math.round((totalQuote + Number.EPSILON) * 100) / 100;
		let acumulate = 0;
		for (let i = 0; i < this.registers.length; i++) {
			if (this.checkCalculateState[i]) {
				this.registers[i].capitalBalance =
					Math.round((totalQuote - acumulate + Number.EPSILON) * 100) / 100;
				acumulate += this.registers[i].quoteUsd;
				acumulate = Math.round((acumulate + Number.EPSILON) * 100) / 100;

				const porcentaje = acumulate / totalQuote;
				this.registers[i].percentage = Math.round((porcentaje + Number.EPSILON) * 100) / 100;
			}
		}
	}

	handleSelectCuota(e: any): void {
		const [chktypevoucher, chknumvoucher] = [e.target.value[0], e.target.value.substr(1)];
	}

	async moveVoucher(event: any, itemV: PaymentVoucher, idx: number, idv: number): Promise<void> {
		const selectedElement = document.getElementById(`sel-${idx}-${idv}`) as HTMLSelectElement;
		if (selectedElement && selectedElement.value) {
			const confirmed = await this.openConfirmationModal(
				'Mover Voucher',
				'fa fa-exchange-alt',
				'¿Estás seguro de mover este voucher?',
				[
					{
						text: 'Cancelar',
						className: 'btn btn-secondary',
						onClick: () => {}
					},
					{
						text: 'Mover voucher',
						className: 'btn btn-danger',
						onClick: () => {}
					}
				]
			);

			if (confirmed) {
				const [chktypevoucher, chknumvoucher] = [
					selectedElement.value[0],
					selectedElement.value.substr(1)
				];
				const mainvalue = chknumvoucher.split('-')[0];
				const secvalue = Number(chknumvoucher.split('-')[1]) - 1;

				let IdPaymentVoucherSource: number[] = [];
				let IdPaymentTarget = itemV.paymentId;

				this.registers.forEach((register) => {
					if (register.quoteDescription.toLowerCase().includes(mainvalue)) {
						if (!isNaN(secvalue)) {
							IdPaymentVoucherSource = [register.paymentVouchers[secvalue].idPaymentVoucher];
						} else {
							IdPaymentVoucherSource = register.paymentVouchers.map(
								(voucher) => voucher.idPaymentVoucher
							);
						}
						this.moveVouchertoOtherQuote(IdPaymentVoucherSource, IdPaymentTarget);
					}
				});
			}
		} else {
			await this.openConfirmationModal(
				'Error',
				'fa fa-exclamation-triangle',
				'Debe seleccionar un voucher',
				[
					{
						text: 'Cerrar',
						className: 'btn btn-secondary',
						onClick: () => {}
					}
				]
			);
		}
	}

	async copyVoucher(event: any, itemV: PaymentVoucher, idx: number, idv: number): Promise<void> {
		const selectedElement = document.getElementById(`sel-${idx}-${idv}`) as HTMLSelectElement;
		if (selectedElement && selectedElement.value) {
			const confirmed = await this.openConfirmationModal(
				'Copiar Voucher',
				'fa fa-copy',
				'¿Estás seguro de copiar este voucher?',
				[
					{
						text: 'Cancelar',
						className: 'btn btn-secondary',
						onClick: () => {}
					},
					{
						text: 'Copiar voucher',
						className: 'btn btn-danger',
						onClick: () => {}
					}
				]
			);

			if (confirmed) {
				const [chktypevoucher, chknumvoucher] = [
					selectedElement.value[0],
					selectedElement.value.substr(1)
				];
				const mainvalue = chknumvoucher.split('-')[0];
				const secvalue = Number(chknumvoucher.split('-')[1]) - 1;

				let IdPaymentVoucherSource: number[] = [];
				let IdPaymentTarget = itemV.paymentId;

				this.registers.forEach((register) => {
					if (register.quoteDescription.toLowerCase().includes(mainvalue)) {
						if (!isNaN(secvalue)) {
							IdPaymentVoucherSource = [register.paymentVouchers[secvalue].idPaymentVoucher];
						} else {
							IdPaymentVoucherSource = register.paymentVouchers.map(
								(voucher) => voucher.idPaymentVoucher
							);
						}
						this.copyVouchertoOtherQuote(IdPaymentVoucherSource, IdPaymentTarget);
					}
				});
			}
		} else {
			await this.openConfirmationModal(
				'Error',
				'fa fa-exclamation-triangle',
				'Debe seleccionar un voucher',
				[
					{
						text: 'Cancelar',
						className: 'btn btn-secondary',
						onClick: () => {}
					}
				]
			);
		}
	}

	async UpdateVoucher(event: any, voucher: PaymentVoucher): Promise<void> {
		if (voucher.idPaymentVoucher) {
			const confirmed = await this.openConfirmationModal(
				'Actualizar Voucher',
				'fa fa-sync',
				'¿Estás seguro de actualizar este voucher?',
				[
					{
						text: 'Cancelar',
						className: 'btn btn-secondary',
						onClick: () => {}
					},
					{
						text: 'Actualizar voucher',
						className: 'btn btn-danger',
						onClick: () => {}
					}
				]
			);

			if (confirmed) {
				const data = {
					idPaymentVoucher: voucher.idPaymentVoucher,
					paymentId: voucher.paymentId,
					operationNumber: voucher.operationNumber,
					methodSubTipoPagoId: voucher.methodPaymentSubTypeId,
					note: voucher.note,
					paymentCoinCurrencyId: voucher.paymentCoinCurrencyId,
					subTotalAmount: voucher.subTotalAmount,
					comissionSubTipoPago: voucher.comissionPaymentSubType,
					totalAmount: voucher.totalAmount,
					creationDate: voucher.creationDate,
					namePicture: voucher.namePicture
				};
				this.SUpdateVoucher(data);
			}
		} else {
			await this.openConfirmationModal(
				'Error',
				'fa fa-exclamation-triangle',
				'No existe voucher para actualizar',
				[
					{
						text: 'Cerrar',
						className: 'btn btn-secondary',
						onClick: () => {}
					}
				]
			);
		}
	}

	async ShowModaldeleteItemV(event: any, voucher: PaymentVoucher): Promise<void> {
		if (voucher.idPaymentVoucher) {
			const confirmed = await this.openConfirmationModal(
				'Eliminar Voucher',
				'fa fa-trash',
				'¿Estás seguro de eliminar este voucher? El Voucher ya no podrá ser recuperado',
				[
					{
						text: 'Cancelar',
						className: 'btn btn-secondary',
						onClick: () => {}
					},
					{
						text: 'Eliminar',
						className: 'btn btn-danger',
						onClick: () => {}
					}
				]
			);

			if (confirmed) {
				this.DeleteVoucher(voucher);
			}
		} else {
			await this.openConfirmationModal(
				'Error',
				'fa fa-exclamation-triangle',
				'No existe voucher para eliminar',
				[
					{
						text: 'Cerrar',
						className: 'btn btn-secondary',
						onClick: () => {}
					}
				]
			);
		}
	}

	moveVouchertoOtherQuote(IdPaymentVoucherSource: number[], IdPaymentTarget: number): void {
		const data = {
			ListIdsPaymentVouchers: IdPaymentVoucherSource,
			IdPaymentTarget: IdPaymentTarget
		};
	}

	copyVouchertoOtherQuote(IdPaymentVoucherSource: number[], IdPaymentTarget: number): void {
		const data = {
			ListIdsPaymentVouchers: IdPaymentVoucherSource,
			IdPaymentTarget: IdPaymentTarget
		};
	}

	SUpdateVoucher(data: any): void {}

	DeleteVoucher(voucher: PaymentVoucher): void {
		const data = {
			ListIdsPaymentVouchers: [voucher.idPaymentVoucher]
		};
	}

	public openImageModal(imageUrl: string): void {
		this.selectedImageUrl = imageUrl;
		this.modalService.open(this.imageModalRef, { centered: true, size: 'lg' });
	}

	onCommission(user: any) {
		const modalRef = this.modalService.open(ModalEditScheduleComissionComponent, {
			centered: true,
			size: 'm'
		});
		const modal = modalRef.componentInstance as ModalEditScheduleComissionComponent;
		modal.idUser = user.idUser;
		modal.userName = user.username;
		modal.fullName = user.fullname;
	}

	addNewRow(): void {
		const lastRegister = this.registers[this.registers.length - 1];

		const newRegister: Register = {
			idPayment: null,
			idSuscription: lastRegister.idSuscription,
			positionOnSchedule: this.registers.length + 1,
			quoteDescription: '',
			nextExpiration: '',
			dollarExchange: lastRegister ? lastRegister.dollarExchange : 0,
			quoteUsd: lastRegister ? lastRegister.quoteUsd : 0,
			statePaymentId: 0,
			amortization: lastRegister ? lastRegister.amortization : 0,
			capitalBalance: 0,
			percentage: 0,
			// interested: 0,
			isQuoteInitial: 0,
			obs: '',
			payDate: '',
			pts: 0,
			numberQuotePay: 0,
			totalOverdue: '',
			paymentVouchers: []
		};
		this.registers.push(newRegister);
		this.checkCalculateState.push(true);
		this.cdr.detectChanges();
	}

	save() {
		console.log('Deleted payments: ', this.deletedPayments);

		this.buttonLoading = true;
		const payload: any[] = this.registers.map((register, index) => {
			const parseDate = (date: string): string | null => {
				const dateParts = date.split('-');
				if (dateParts.length === 3) {
					const day = parseInt(dateParts[0], 10);
					const month = parseInt(dateParts[1], 10) - 1;
					const year = parseInt(dateParts[2], 10);

					const parsedDate = new Date(year, month, day);

					if (!isNaN(parsedDate.getTime())) {
						return parsedDate.toISOString();
					} else {
						console.error(`Fecha inválida: ${date}`);
						return null;
					}
				} else {
					console.error(`Formato de fecha inválido: ${date}`);
					return null;
				}
			};

			return {
				idPayment: register.idPayment,
				idSuscription: register.idSuscription,
				quoteDescription: register.quoteDescription,
				nextExpiration: register.nextExpiration
					? parseDate(register.nextExpiration)
					: register.nextExpiration,
				dollarExchange: register.dollarExchange,
				quotaUsd: register.quoteUsd,
				percentage: register.percentage,
				statePaymentId: register.statePaymentId,
				obs: register.obs,
				payDate: register.payDate ? parseDate(register.payDate) : register.payDate,
				pts: register.pts,
				isQuoteInitial: register.isQuoteInitial,
				positionOnSchedule: register.positionOnSchedule,
				numberQuotePay: register.numberQuotePay,
				amortizationUsd: register.amortization,
				capitalBalanceUsd: register.capitalBalance,
				totalOverdue: register.totalOverdue,
				percentOverdueDetailId: null,
				// interested: register.interested, // Comentado ya que no está en el response
				paymentVouchers: []
			};
		});

		this.showLoadingModal();

		this.scheduleService.updateSchedule(this.idSuscripcion, payload).subscribe(
			(response) => {
				this.activeModal.close();
				this.buttonLoading = false;
				this.toastManager.addToast('Cronograma actualizado exitosamente.', 'success');
				if (this.deletedPayments.length > 0) {
					this.deletePayments(); // Llamar al método para eliminar pagos
				} else {
					this.hideLoadingModal();
				}
			},
			(error) => {
				console.error('Error al actualizar el schedule:', error);
				this.hideLoadingModal();
				this.buttonLoading = false;
				this.toastManager.addToast('Hubo un error al actualizar el cronograma.', 'error');
			}
		);
	}

	deletePayments(): void {
		this.scheduleService.deletePayments(this.deletedPayments).subscribe(
			(response) => {
				console.log('Pagos eliminados correctamente:', response);
				this.hideLoadingModal();
			},
			(error) => {
				console.error('Error al eliminar los pagos:', error);
				this.hideLoadingModal();
				this.buttonLoading = false;
				this.toastManager.addToast('Hubo un error al eliminar los pagos.', 'error');
			}
		);
	}

	onUpdate(idUser: string) {
		this.showLoadingModal();
		this.userService.updateJobStatus(idUser).subscribe(
			(response: string) => {
				if (response === 'Estado del trabajo actualizado correctamente') {
					this.hideLoadingModal();
					this.toastManager.addToast('Estado del trabajo actualizado exitosamente.', 'success');
				} else {
					this.hideLoadingModal();
					this.toastManager.addToast('Hubo un error al actualizar el estado del trabajo.', 'error');
					console.error('Error al actualizar el estado del trabajo:', response);
				}
			},
			(error) => {
				this.hideLoadingModal();
				this.toastManager.addToast('Hubo un error al actualizar el estado del trabajo.', 'error');
				console.error('Error al actualizar el estado del trabajo:', error);
			}
		);
	}

	private showLoadingModal(): void {
		this.loadingModalRef = this.modal.open(ModalLoadingComponentManageBusiness, {
			centered: true,
			size: 'sm'
		});
	}

	private hideLoadingModal(): void {
		if (this.loadingModalRef) {
			this.loadingModalRef.close();
			this.loadingModalRef = null;
		}
	}
}
