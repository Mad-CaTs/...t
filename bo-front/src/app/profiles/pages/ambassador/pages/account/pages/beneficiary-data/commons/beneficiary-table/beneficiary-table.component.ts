import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PaginationNgPrimeComponent } from '@shared/components/pagination-ng-prime/pagination-ng-prime.component';
import { TableComponent } from '@shared/components/table/table.component';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PaginatorModule } from 'primeng/paginator';
import { TablePaginationService } from '@shared/services/table-pagination.service';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';
import { ITableBeneficiary } from '../../interfaces/beneficiary';
import { BeneficiaryCreationModalComponent } from '../../modals/beneficiary-creation-modal/beneficiary-creation-modal.component';
import { ModalAlertComponent } from 'src/app/profiles/commons/modals/modal-alert/modal-alert.component';
import { ModalSuccessComponent } from 'src/app/profiles/commons/modals/modal-success/modal-success.component';
import { BeneficiaryService } from '../../services/beneficiary-service.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { finalize, forkJoin } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { ISelect } from '@shared/interfaces/forms-control';
import { SelectComponent } from '@shared/components/form-control/select/select.component';

@Component({
	selector: 'app-beneficiary-table',
	standalone: true,
	imports: [
		CommonModule,
		PaginatorModule,
		TableComponent,
		DynamicDialogModule,
		ButtonModule,
		ProgressSpinnerModule,
	],
	templateUrl: './beneficiary-table.component.html',
	styleUrl: './beneficiary-table.component.scss'
})
export class BeneficiaryTableComponent {
	@Input() dataBody: ITableBeneficiary[] = [];
	@Input() totalRecords: number = 0;
	@Output() pageChange: EventEmitter<any> = new EventEmitter();
	@Output() refresh: EventEmitter<any> = new EventEmitter();
	@Input() preselectSid: number | null = null;
	isButtonLoading: { [key: number]: boolean } = {};
	public id: string = '';
	public rows: number = 10;
	public first: number = 0;
	dialogRef: DynamicDialogRef;
	isLoading: boolean = true;
	userInfo: any;
	align: string = 'right';
	public selected: FormControl = new FormControl(1);
	public disabledUser: boolean = this.userInfoService.disabled;
	public disabledAdd: boolean = true;
	public membershipList: any;
	public subscriptionId: number = 0;
	optMemberships: ISelect[] = [];
	private subscriptionNameById: Record<number, string> = {};
	private subscriptionIds: number[] = [];
	private capacidadBySubId: Record<number, number> = {};
	private usadosBySubId: Record<number, number> = {};
	private packageDetalBySubId: Record<number, number> = {};
	public atLimit = false;
	public usedSlots = 0;
	public maxSlots = 0;
	public freeSlots = 0;


	constructor(
		private dialogService: DialogService,
		private beneficiaryService: BeneficiaryService,
		public tableService: TablePaginationService,
		private userInfoService: UserInfoService
	) {
		this.id = tableService.addTable(this.dataBody, this.rows);
		this.userInfo = this.userInfoService.userInfo;
	}

	ngOnInit(): void {

		// const sid = this.route.snapshot.queryParamMap.get('sid');
		// this.preselectSid = sid ? +sid : null;

		this.beneficiaryService.getMembershipsBySubscriptionId(this.userInfo.id).pipe(
			switchMap((response: any) => {
				const list = response.data ?? [];
				this.subscriptionIds = list.map((s: any) => s.id);


				this.subscriptionNameById = list.reduce((acc: any, s: any) => {
					acc[s.id] = s.nameSuscription;
					return acc;
				}, {});


				const perSubRequests = list.map((item: any) =>
					forkJoin({
						detail: this.beneficiaryService.getPackageById(item.idPackageDetail),
						people: this.beneficiaryService.getBeneFiciariesBySubscriptionId(item.id)
					}).pipe(
						map(({ detail, people }: any) => {
							const max = Number(detail?.numberBeneficiaries);
							const used = (people?.data ?? []).length;
							const free = Math.max(0, max - used);

							this.capacidadBySubId[item.id] = max;
							this.usadosBySubId[item.id] = used;
							this.packageDetalBySubId[item.id] = item.idPackageDetail;

							return {
								value: item.id,
								content: `${item.nameSuscription} (${used}/${max}) - (Puedes agregar +${free} personas)`
							} as ISelect;
						})
					)
				);

				return forkJoin(perSubRequests).pipe(
					map((opts: ISelect[]) => [
						{ value: 'ALL' as any, content: 'Todas las membresías' },
						...opts
					])
				);
			})
		).subscribe(opts => {
			this.optMemberships = opts;
			//this.onChangeMembership({ target: { value: 'ALL' } });
			if (this.preselectSid) {
				this.subscriptionId = this.preselectSid;
				this.onMembershipModelChange(this.subscriptionId);
			} else {
				this.onMembershipModelChange('ALL'); // comportamiento actual
			}
		});

	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['dataBody']) {
			if (this.dataBody) {
				this.selected.setValue(this.dataBody[0]?.id || 1);

				const rows = (this.dataBody ?? []).map((r: any) => ({
					...r,
					age: this.calcAge(r.ageDate),
					subscription: this.subscriptionNameById[r.idSubscription] ?? r.subscription ?? '-'
				}));
				this.tableService.updateTable(rows, this.id, this.rows);

				this.beneficiaryService.getBeneFiciariesBySubscriptionId(this.subscriptionId).subscribe(response => {
					const apiRows = (response.data ?? []).map((r: any) => ({
						...r,
						age: this.calcAge(r.ageDate),
						subscription: this.subscriptionNameById[r.idSubscription] ?? '-'
					}));
					this.tableService.updateTable(apiRows, this.id, this.rows);
				});

				this.isLoading = false;
			} else {
				setTimeout(() => {
					this.isLoading = false;
				}, 1000);
			}
		}
	}

	ngOnDestroy(): void {
		this.tableService.deleteTable(this.id);
	}

	get table() {
		return this.tableService.getTable<ITableBeneficiary>(this.id);
	}

	onPageChange(event: any): void {
		this.first = event.first;
		this.rows = event.rows;
		this.loadBeneficiariesBySubscription(this.subscriptionId);
	}

	onRefresh(event: any): void {
		this.rows = event.rows || this.rows;
		this.loadBeneficiariesBySubscription(this.subscriptionId);
	}

	private loadBeneficiariesBySubscription(id: number): void {
		this.isLoading = true;
		this.beneficiaryService.getBeneFiciariesBySubscriptionId(id)
			.pipe(finalize(() => (this.isLoading = false)))
			.subscribe((response: any) => {
				const data = response.data ?? [];


				const used = data.length;
				const max = this.capacidadBySubId[id] ?? 5;
				this.maxSlots = max;
				this.usedSlots = used;
				this.freeSlots = Math.max(0, max - used);
				this.atLimit = used >= max;
				this.disabledAdd = this.atLimit;

				const rows = data.map((r: any) => ({
					...r,
					age: this.calcAge(r.ageDate),
					subscription: this.subscriptionNameById[r.idSubscription] ?? '-'
				}));

				this.tableService.updateTable(rows, this.id, this.rows);
			});
	}

	private loadAllBeneficiaries(): void {
		if (this.subscriptionIds.length === 0) {
			this.tableService.updateTable([], this.id, this.rows);
			// reset aviso
			this.atLimit = false;
			this.usedSlots = 0;
			this.maxSlots = 0;
			this.freeSlots = 0;
			return;
		}
		this.isLoading = true;
		const reqs = this.subscriptionIds.map(id =>
			this.beneficiaryService.getBeneFiciariesBySubscriptionId(id)
		);

		forkJoin(reqs)
			.pipe(finalize(() => (this.isLoading = false)))
			.subscribe((responses: any[]) => {
				const rows = responses
					.flatMap(r => r?.data ?? [])
					.map((r: any) => ({
						...r,
						age: this.calcAge(r.ageDate),
						subscription: this.subscriptionNameById[r.idSubscription] ?? '-'
					}));
				this.tableService.updateTable(rows, this.id, this.rows);


				this.atLimit = false;
				this.usedSlots = 0;
				this.maxSlots = 0;
				this.freeSlots = 0;
				this.disabledAdd = true;
			});
	}

	private refreshCombo(): void {
		this.beneficiaryService.getMembershipsBySubscriptionId(this.userInfo.id).pipe(
			switchMap((response: any) => {
				const list = response.data ?? [];
				const perSubRequests = list.map((item: any) =>
					forkJoin({
						detail: this.beneficiaryService.getPackageById(item.idPackageDetail),
						people: this.beneficiaryService.getBeneFiciariesBySubscriptionId(item.id)
					}).pipe(
						map(({ detail, people }: any) => {
							const max = Number(detail?.numberBeneficiaries) || 5;
							const used = (people?.data ?? []).length;
							const free = Math.max(0, max - used);
							return {
								value: item.id,
								content: `${item.nameSuscription} (${used}/${max}) - (Puedes agregar +${free} personas)`
							} as ISelect;
						})
					)
				);
				return forkJoin(perSubRequests).pipe(
					map((opts: ISelect[]) => [
						{ value: 'ALL' as any, content: 'Todas las membresías' },
						...opts
					])
				);
			})
		).subscribe(opts => this.optMemberships = opts);
	}

	
	onChangeMembership(event: any): void {
		const val = event.target.value;

		if (val === 'ALL') {
			this.subscriptionId = 0;
			this.disabledAdd = true;

			this.atLimit = false;
			this.usedSlots = 0;
			this.maxSlots = 0;
			this.freeSlots = 0;

			this.loadAllBeneficiaries();
			return;
		}

		this.subscriptionId = +val;


		this.loadBeneficiariesBySubscription(this.subscriptionId);


		this.beneficiaryService.getBeneFiciariesBySubscriptionId(this.subscriptionId)
			.subscribe((res: any) => {
				const used = (res?.data ?? []).length;
				const max = this.capacidadBySubId[this.subscriptionId] ?? 5;

				this.usadosBySubId[this.subscriptionId] = used;


				this.maxSlots = max;
				this.usedSlots = used;
				this.freeSlots = Math.max(0, max - used);
				this.atLimit = used >= max;


				this.disabledAdd = this.atLimit;
			});
	}

	save() {

		this.dialogRef = this.dialogService.open(BeneficiaryCreationModalComponent, {
			header: '',
			closable: false,
			styleClass: 'beneficiary-dd',
			width: '750px',
			data: {
				userId: this.userInfo.id,
				idSubscription: this.subscriptionId,
				beneficiaryId: 0,

				selectSubscriptionId: this.subscriptionId,
				membershipOptions: this.optMemberships.filter(o => typeof o.value === 'number')
			}
		});

		this.dialogRef.onClose.subscribe((data) => {
			if (data === true) {
				const ref = this.dialogService.open(ModalSuccessComponent, {
					header: '',
					width: '450px',
					data: {
						title: 'Registro exitoso',
						text: 'Se ha registrado con éxito y será verificado. Le avisaremos y enviaremos toda la información necesaria a su correo electrónico.',
						icon: 'pi pi-check-circle'
					}
				});
				ref.onClose.pipe(take(1)).subscribe(() => {
					setTimeout(() => {
						this.onRefresh({ rows: this.rows });
						this.refreshCombo();
					}, 0);
				});
			} else if (data === false) {
				this.dialogService.open(ModalAlertComponent, {
					header: '',
					data: {
						message: 'El beneficiario no se pudo guardar.',
						title: '¡Error!',
						icon: 'pi pi-times-circle'
					}
				});
			}
		});
	}

	edit(id: number) {
		this.dialogRef = this.dialogService.open(BeneficiaryCreationModalComponent, {
			header: 'Editar beneficiario',
			width: '50%',
			height: '70%',
			data: {
				userId: this.userInfo.id,
				idSubscription: this.subscriptionId,
				beneficiaryId: id
			}
		});

		this.dialogRef.onClose.subscribe((data) => {
			if (data === true) {
				const ref = this.dialogService.open(ModalSuccessComponent, {
					header: '',
					data: {
						text: 'El beneficiario se guardo correctamente.',
						title: '¡Éxito!',
						icon: 'assets/icons/Inclub.png'
					}
				});
				ref.onClose.subscribe(() => {
					this.onRefresh({ rows: this.rows });
				});
			} else if (data === false) {
				this.dialogService.open(ModalAlertComponent, {
					header: '',
					data: {
						message: 'El beneficiario no se pudo guardar.',
						title: '¡Error!',
						icon: 'pi pi-times-circle'
					}
				});
			}
		});
	}

	deleteBeneficiary(id: number) {
		this.isButtonLoading[id] = true;
		this.beneficiaryService
			.deleteBeneficiary(id)
			.pipe(
				finalize(() => {
					this.isButtonLoading[id] = false;
				})
			)
			.subscribe({
				next: () => {
					const ref = this.dialogService.open(ModalSuccessComponent, {
						header: '',
						data: {
							text: 'El beneficiario se elimino correctamente.',
							title: '¡Éxito!',
							icon: 'assets/icons/Inclub.png'
						}
					});
					ref.onClose.subscribe(() => {
						this.onRefresh({ rows: this.rows });
					});
				},
				error: () => {
					this.dialogService.open(ModalAlertComponent, {
						header: '',
						data: {
							message: 'El beneficiario no se pudo eliminar.',
							title: '¡Error!',
							icon: 'pi pi-times-circle'
						}
					});
				}
			});
	}

	get headers() {
		const result = [
			'N°',
			'Nombres',
			'Apellidos',
			'N° documento',
			'Fecha de nacimiento',
			'Edad',
			'Correo',
			'Fecha de vencimiento',
			'Membresia'
		];
		return result;
	}

	get minWidthHeader() {
		const result = [5, 80, 80, 90, 110, 100, 240, 130, 110];
		return result;
	}

	private calcAge(value: string | Date | null | undefined): number | null {
		const dob = this.parseDate(value);
		if (!dob) return null;

		const today = new Date();
		let age = today.getFullYear() - dob.getFullYear();
		const m = today.getMonth() - dob.getMonth();
		if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;

		return age < 0 ? null : age;
	}

	private parseDate(value: string | Date | null | undefined): Date | null {
		if (!value) return null;
		if (value instanceof Date) return isNaN(value.getTime()) ? null : value;

		const s = String(value).trim();
		const m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
		const d = m ? new Date(+m[1], +m[2] - 1, +m[3]) : new Date(s);
		return isNaN(d.getTime()) ? null : d;
	}

	onMembershipModelChange(val: any): void {
		if (val === 'ALL' || val == null) {
			this.subscriptionId = 0;
			this.disabledAdd = true;
			this.atLimit = false; this.usedSlots = 0; this.maxSlots = 0; this.freeSlots = 0;
			this.loadAllBeneficiaries();
			return;
		}

		this.subscriptionId = +val;
		this.loadBeneficiariesBySubscription(this.subscriptionId);

		this.beneficiaryService.getBeneFiciariesBySubscriptionId(this.subscriptionId)
			.subscribe((res: any) => {
				const used = (res?.data ?? []).length;
				const max = this.capacidadBySubId[this.subscriptionId] ?? 5;
				this.maxSlots = max;
				this.usedSlots = used;
				this.freeSlots = Math.max(0, max - used);
				this.atLimit = used >= max;
				this.disabledAdd = this.atLimit;
			});
	}
}
