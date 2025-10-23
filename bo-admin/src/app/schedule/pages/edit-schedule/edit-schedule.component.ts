import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '@app/core/services/toast.service';
import { ModalLoadingComponentManageBusiness } from '@app/manage-business/components/modals/modal-loading/modal-loading.component';
import { ModalEditScheduleComissionComponent } from '@app/schedule/components/modals';
import { ScheduleModule } from '@app/schedule/schedule.module';
import { ScheduleService } from '@app/schedule/services/schedule.service';
import { UserService } from '@app/users/services/user.service';
import { ISelectOpt } from '@interfaces/form-control.interface';
import { PaymentVoucher, Register } from '@interfaces/partners.interface';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { ModalConfirmationComponent } from '@shared/components/modal-confirmation/modal-confirmation.component';
import { TablesModule } from '@shared/components/tables/tables.module';
import { SharedModule } from '@shared/shared.module';
import { formatDateToDDMMYYYYV2, parseDDMMYYYY } from '@utils/date';
import { InlineSVGModule } from 'ng-inline-svg-2';

type VoucherRow = { voucher: PaymentVoucher | null };

@Component({
	selector: 'app-edit-schedule',
	templateUrl: './edit-schedule.component.html',
	styleUrls: ['./edit-schedule.component.scss'],
	standalone: true,
	imports: [
		CommonModule,
		SharedModule,
		ReactiveFormsModule,
		TablesModule,
		InlineSVGModule,
		FormControlModule,
		ScheduleModule,
		FormsModule
	]
})
export class EditScheduleComponent {
	idUser: any;
	userName: string;
	fullName: string;
	document: string;
	typeDocument: string;
	statusValue: string;
	subscriptionName: string;
	idSuscripcion: number;
	packages: any[] = [];
	packageCurrent: any;
	pendingVoucherOperations: any[] = [];

	public selectOptions: {
		id: string;
		name: string;
		vouchers: PaymentVoucher[];
	}[] = [];
	selectedSource: Record<string, { paymentId: number; voucherId: number } | null> = {};

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
	tempPayDates: string[] = [];
	buttonLoading: boolean = false;
	deletedPayments: number[] = [];

	packageOpt: ISelectOpt[] = [];
	versionOpt: ISelectOpt[] = [];
	familyMigrateOpt: ISelectOpt[] = [];
	quotePayOpt: ISelectOpt[] = [];
	private loadingModalRef: NgbModalRef | null = null;
	deletedVouchers: number[] = [];

	constructor(
		// public activeModal: NgbActiveModal,
		private fb: FormBuilder,
		private cdr: ChangeDetectorRef,
		private userService: UserService,
		private modalService: NgbModal,
		private scheduleService: ScheduleService,
		private toastManager: ToastService,
		private route: ActivatedRoute,
		public modal: NgbModal,
		private router: Router
	) {
		this.form = this.fb.group({
			package: [''],
			version: [''],
			familyMigrate: ['']
		});

		this.packageOpt = [];
	}

	ngOnInit(): void {
		const id = Number(this.route.snapshot.paramMap.get('id'));
		this.idSuscripcion = id;

		const storedState = localStorage.getItem('suscription');
		if (storedState) {
			const dataParsed = JSON.parse(storedState);
			this.subscriptionName = dataParsed.suscription;
			this.idUser = dataParsed.idUser;
		}

		this.getRegister();
	}

	getSelectKey(rowIdx: number, voucherIdx: number) {
		return `${rowIdx}-${voucherIdx}`;
	}

	onSelectChange(
		rowIdx: number,
		voucherIdx: number,
		value: { paymentId: number; voucherId: number } | null
	) {
		const key = this.getSelectKey(rowIdx, voucherIdx);
		this.selectedSource[key] =
			value && Number.isFinite(value.paymentId) && Number.isFinite(value.voucherId) ? value : null;
	}

	isTargetChosen(rowIdx: number, voucherIdx: number): boolean {
		return !!this.selectedSource[this.getSelectKey(rowIdx, voucherIdx)];
	}

	hasTargetPayment(idx: number): boolean {
		return !!this.registers[idx]?.idPayment;
	}

	getRegister(): void {
		this.loading = true;
		this.scheduleService.getSchedule(this.idSuscripcion).subscribe((response) => {
			this.loading = false;
			this.registers = response;
			this.buildSelectOptions();
			this.checkCalculateState = this.registers.map(() => true);
			this.calculate();
			this.cdr.detectChanges();
		});
	}

	private buildSelectOptions(): void {
		const elegibles = this.registers
			.filter((r) => {
				const hasPaymentId = r.idPayment != null;
				const hasVouchers = (r.paymentVouchers?.length ?? 0) > 0;
				return hasPaymentId && hasVouchers;
			})
			.sort((a, b) => (a.positionOnSchedule ?? 0) - (b.positionOnSchedule ?? 0));

		const opts: { id: string; name: string; vouchers: PaymentVoucher[] }[] = [];

		for (const r of elegibles) {
			const base = (r.quoteDescription || '').trim();

			const vouchers = [...(r.paymentVouchers ?? [])]
				.filter((v) => v && v.idPaymentVoucher != null)
				.sort((v1, v2) => {
					const d1 = v1.creationDate ? new Date(v1.creationDate).getTime() : 0;
					const d2 = v2.creationDate ? new Date(v2.creationDate).getTime() : 0;
					return d1 - d2;
				});

			vouchers.forEach((v, idx) => {
				const compound = `${r.idPayment}:${v.idPaymentVoucher}`;
				opts.push({
					id: compound,
					name: `${base} - Voucher ${idx + 1}`,
					vouchers: [v]
				});
			});
		}

		this.selectOptions = opts;
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

	updateCascadingQuotes(startIndex: number): void {
		const startQuoteDescription = this.registers[startIndex].quoteDescription;
		const regex = /(\d+)/;

		const match = startQuoteDescription.match(regex);
		if (!match || match.length < 2) {
			console.error('Descripción inicial inválida:', startQuoteDescription);
			return;
		}

		let currentQuoteNumber = parseInt(match[1], 10);

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
		const startDate = parseDDMMYYYY(this.registers[startIndex].nextExpiration);
		if (!startDate) {
			return;
		}

		for (let i = startIndex + 1; i < this.registers.length; i++) {
			const nextDate = new Date(startDate);
			nextDate.setMonth(nextDate.getMonth() + (i - startIndex));
			this.registers[i].nextExpiration = formatDateToDDMMYYYYV2(nextDate);
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
				this.registers[i].amortization = dollar;
			}
		} else {
			(this.registers[id][field] as unknown as (typeof this.registers)[0][keyof Register]) = exchange;
			let dollar = Number(this.registers[id].quoteUsd);
			this.registers[id].amortization = dollar;
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
				this.registers[i].amortization = this.registers[i].quoteUsd;
			}
		} else {
			(this.registers[id][field] as unknown as (typeof this.registers)[0][keyof Register]) = quoteUsd;
			let exchange = Number(this.registers[id].dollarExchange);
			this.registers[id].amortization = this.registers[id].quoteUsd;
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
		buttons: { text: string; className: string; onClick?: () => void; confirm?: boolean }[]
	): Promise<boolean> {
		const modalRef = this.modalService.open(ModalConfirmationComponent);
		modalRef.componentInstance.title = title;
		modalRef.componentInstance.icon = icon;
		modalRef.componentInstance.body = body;

		modalRef.componentInstance.buttons = buttons.map((btn) => ({
			...btn,
			onClick: () => {
				btn.onClick?.();
				modalRef.close(!!btn.confirm);
			}
		}));

		return modalRef.result.then(
			(result: boolean) => !!result,
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

	getVoucherRows(item: Register): VoucherRow[] {
		const vouchers = item.paymentVouchers ?? [];
		return vouchers.length ? vouchers.map((v) => ({ voucher: v })) : [{ voucher: null }];
	}

	trackByVoucherRow = (i: number, r: VoucherRow) =>
		r.voucher ? `${r.voucher.paymentId}-${r.voucher.idPaymentVoucher}` : `placeholder-${i}`;

	onOpenImage(v: PaymentVoucher | null) {
		if (v?.pathPicture) this.openImageModal(v.pathPicture);
	}

	async copyVoucher(idx: number, _idv: number): Promise<void> {
		const key = this.getSelectKey(idx, _idv);
		const sel = this.selectedSource[key];
		const targetReg = this.registers[idx];
		const targetPaymentId = targetReg?.idPayment ?? null;
		if (!sel || !targetPaymentId) return;

		const sourceReg = this.registers.find((r) => r.idPayment === sel.paymentId);
		if (!sourceReg || !sourceReg.paymentVouchers?.length) return;

		const voucher = sourceReg.paymentVouchers.find((v) => v.idPaymentVoucher === sel.voucherId);
		if (!voucher) return;

		const confirmed = await this.openConfirmationModal(
			'Copiar Voucher',
			'fa fa-copy',
			`¿Copiar el voucher seleccionado al destino?`,
			[
				{ text: 'Cancelar', className: 'btn btn-secondary' },
				{ text: 'Copiar voucher', className: 'btn btn-danger', confirm: true }
			]
		);
		if (!confirmed) return;

		this.pendingVoucherOperations.push({
			sourceVoucherId: voucher.idPaymentVoucher,
			targetPaymentId: targetPaymentId,
			operationType: 'copy',
			voucherData: voucher
		});

		const clone = this.cloneForTarget(voucher, targetPaymentId);
		targetReg.paymentVouchers = [...(targetReg.paymentVouchers ?? []), clone];

		this.selectedSource[key] = null;
		this.cdr.detectChanges();
	}

	async moveVoucher(idx: number, _idv: number): Promise<void> {
		const key = this.getSelectKey(idx, _idv);
		const sel = this.selectedSource[key];
		const targetReg = this.registers[idx];
		const targetPaymentId = targetReg?.idPayment ?? null;
		if (!sel || !targetPaymentId) return;

		const sourceReg = this.registers.find((r) => r.idPayment === sel.paymentId);
		if (!sourceReg || !sourceReg.paymentVouchers?.length) return;

		const voucherIdx = sourceReg.paymentVouchers.findIndex((v) => v.idPaymentVoucher === sel.voucherId);
		if (voucherIdx < 0) return;

		const voucher = sourceReg.paymentVouchers[voucherIdx];

		const confirmed = await this.openConfirmationModal(
			'Mover Voucher',
			'fa fa-exchange-alt',
			`¿Mover el voucher seleccionado al destino?`,
			[
				{ text: 'Cancelar', className: 'btn btn-secondary' },
				{ text: 'Mover voucher', className: 'btn btn-danger', confirm: true }
			]
		);
		if (!confirmed) return;

		this.pendingVoucherOperations.push({
			sourceVoucherId: voucher.idPaymentVoucher,
			targetPaymentId: targetPaymentId,
			operationType: 'move',
			voucherData: voucher
		});

		sourceReg.paymentVouchers.splice(voucherIdx, 1);
		voucher.paymentId = targetPaymentId;
		targetReg.paymentVouchers = [...(targetReg.paymentVouchers ?? []), voucher];

		this.selectedSource[key] = null;
		this.cdr.detectChanges();
		this.toastManager.addToast('Voucher movido exitosamente.', 'success');
	}

	private cloneForTarget(v: PaymentVoucher, targetPaymentId: number): PaymentVoucher {
		const c: PaymentVoucher = {
			...v,
			paymentId: targetPaymentId
		};
		return c;
	}

	async showModaldeleteItemV(event: any, voucher: PaymentVoucher): Promise<void> {
		if (!voucher) return;

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
					confirm: true
				}
			]
		);

		if (!confirmed) return;

		this.softDeleteVoucher(voucher);
	}

	private softDeleteVoucher(voucher: PaymentVoucher): void {
		if (voucher.idPaymentVoucher && voucher.idPaymentVoucher > 0) {
			if (!this.deletedVouchers.includes(voucher.idPaymentVoucher)) {
				this.deletedVouchers.push(voucher.idPaymentVoucher);
			}
		}

		for (const reg of this.registers) {
			if (!reg.paymentVouchers || !reg.paymentVouchers.length) continue;

			const idx = reg.paymentVouchers.indexOf(voucher);

			if (idx > -1) {
				reg.paymentVouchers.splice(idx, 1);
				break;
			}
		}

		this.cdr.detectChanges();
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
		this.buttonLoading = true;

		if (this.pendingVoucherOperations.length > 0) {
			this.showLoadingModal();

			this.scheduleService.bulkVoucherOperations(this.pendingVoucherOperations).subscribe(
				(response) => {
					this.pendingVoucherOperations = [];
					this.hideLoadingModal();
					this.saveSchedule();
				},
				(error) => {
					console.error('Error en operaciones de voucher:', error);
					this.hideLoadingModal();
					this.buttonLoading = false;
					this.toastManager.addToast('Error en operaciones de voucher.', 'error');
				}
			);
		} else {
			this.saveSchedule();
		}
	}

	private saveSchedule() {
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
				paymentVouchers: register.paymentVouchers
			};
		});

		this.showLoadingModal();

		this.scheduleService.updateSchedule(this.idSuscripcion, payload).subscribe(
			(response) => {
				const doAfterDelete = () => {
					this.scheduleService.fixSchedule(this.idSuscripcion).subscribe(
						(fixResponse) => {
							this.buttonLoading = false;
							this.hideLoadingModal();
							this.toastManager.addToast(
								'Cronograma actualizado y corregido exitosamente.',
								'success'
							);
						},
						(fixError) => {
							console.error('Error al corregir el schedule:', fixError);
							this.buttonLoading = false;
							this.hideLoadingModal();
							this.toastManager.addToast(
								'Cronograma actualizado pero hubo un error al corregirlo.',
								'warning'
							);
						}
					);
				};

				const handleError = (err: any) => {
					console.error('Error posterior al update:', err);
					this.buttonLoading = false;
					this.hideLoadingModal();
					this.toastManager.addToast('Hubo un error al finalizar la actualización.', 'error');
				};

				const deletions: Promise<any>[] = [];

				if (this.deletedPayments.length > 0) {
					deletions.push(this.scheduleService.deletePayments(this.deletedPayments).toPromise());
				}
				if (this.deletedVouchers.length > 0) {
					deletions.push(this.scheduleService.deleteVouchers(this.deletedVouchers).toPromise());
				}

				if (deletions.length) {
					Promise.allSettled(deletions)
						.then(() => doAfterDelete())
						.catch(handleError);
				} else {
					doAfterDelete();
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

	onMigrate() {}

	onBack() {
		if (this.idUser) {
			this.router.navigate(['/dashboard/schedule/detail-schedule', this.idUser]);
		} else {
			this.router.navigate(['/dashboard/schedule/list-schedule']);
		}
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

	ngOnDestroy(): void {
		localStorage.removeItem('suscription');
	}
}
