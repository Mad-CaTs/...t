import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { RetirosService } from '@app/manager-wallet/services/retiros.service';
import { TableGenericComponent } from '@shared/components/tables/table-generic/table-generic.component';
import { TablePaginatorComponent } from '@shared/components/tables/table-paginator/table-paginator.component';
import { EmptyStateComponent } from '@app/event/components/shared/empty-state/empty-state.component';
import { TabViewModule } from 'primeng/tabview';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { ISelectOpt } from '@interfaces/form-control.interface';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { merge, Subject } from 'rxjs';
import { AuditFile, AuditFileRow } from '@app/manager-wallet/model/audit-record.model';
import { ModalLoadingComponentManageBusiness } from '@app/manage-business/components/modals/modal-loading/modal-loading.component';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { convertArrayToDate, formatDateToDDMMYYYY } from '@utils/date';
import { CommissionManagerService } from '@app/commission-manager/services/commission-manager.service';
import { ALL_MONTHS } from '@constants/commission-affiliation.constant';

interface IMonthOption {
	label: string;
	value: string;
	periods: ISelectOpt[];
}

@Component({
	selector: 'app-audit-record',
	standalone: true,
	imports: [
		CommonModule,
		TableGenericComponent,
		TablePaginatorComponent,
		ReactiveFormsModule,
		EmptyStateComponent,
		TabViewModule,
		FormsModule,
		FormControlModule
	],
	templateUrl: './audit-record.component.html',
	styleUrls: ['./audit-record.component.scss']
})
export class AuditRecordComponent implements OnInit, OnDestroy {
	private destroy$ = new Subject<void>();

	isLoading = false;
	data: any[] = [];
	dataOfFiles: AuditFileRow[] = [];

	loadingModalRef: NgbModalRef | null = null;
	columns = ['id', 'fecha', 'Usuario', 'Rol', 'Numero de operaciones', 'Acciones'];
	keys = ['id', 'fechaHora', 'userName', 'role', 'idSolicitudBank', 'actionDescription'];
	clmnWidth = ['10%', '15%', '20%', '15%', '20%', '20%'];
	prevValidatorModalRef: NgbModalRef | null = null;
	columnsOfFiles = [
		'Fecha y Hora',
		'Usuario',
		'Nombre de archivo',
		'Registros',
		'Acción',
		'Tamaño',
		'Formato'
	];
	keysOfFiles = [
		'fechaHora',
		'userName',
		'fileName',
		'registros',
		'actionDescription',
		'tamaño',
		'formato'
	];
	clmnWidthOfFiles = ['15%', '15%', '25%', '10%', '10%', '10%', '15%'];

	form!: FormGroup;
	statusReviewOptions: ISelectOpt[] = [];

	activeTabIndex = 0;
	isStateOfTab = true;

	totalItems = 0;
	pageIndex = 1;
	pageSize = 6;
	pagesPerBlock = 5;
	currentBlock = 1;
	dateOpt: ISelectOpt[] = [];
	typeBonusOpt: ISelectOpt[] = [];
	monthOptions: IMonthOption[] = [];
	currentPage: number = 0;
	currentYear: number = new Date().getFullYear();
	refreshSelector = false;
	private validationTimer: any;
	dateFilter: string = '';

	constructor(
		private retiroService: RetirosService,
		private fb: FormBuilder,
		private cd: ChangeDetectorRef,
		private commissionManagerService: CommissionManagerService,
		private cdr: ChangeDetectorRef,
		private modalService: NgbModal,
	) { }

	ngOnInit(): void {
		this.initForm();
		this.initializeMonthOptions();
		this.getListAccions();
		this.loadTabData(this.isStateOfTab);
		this.setupSearchFilter();
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}

	initForm(): void {
		this.form = this.fb.group({
			search: [''],
			createDate: [''],
			cicles: [null],
			actionId: [null],
			periods: [[]]
		});
	}

	loadTabData(isModificationTab: boolean): void {
		const type = isModificationTab ? 1 : 2;
		this.getModificationAudit(type);
	}

	onTabChange(isModificationTab: boolean): void {
		if (this.isStateOfTab !== isModificationTab) {
			this.isStateOfTab = isModificationTab;
			this.form.reset();
			this.pageIndex = 1;
			this.pageSize = 6;
			this.currentBlock = 1;
			this.totalItems = 0;
			this.dateFilter = '';
			this.loadTabData(isModificationTab);
		}
	}

	onDateChange(event: any): void {
		const dateValue = event.target.value;
		this.dateFilter = dateValue ? this.formatDateForService(dateValue) : '';
		this.form.get('createDate')?.setValue(dateValue, { emitEvent: false });
		this.pageIndex = 1;
		this.loadTabData(this.isStateOfTab);
	}

	private formatDateForService(date: string): string {
		const [year, month, day] = date.split('-');
		return `${year}-${month}-${day}T00:00:00`;
	}

	onPageChange(newPage: number): void {
		this.pageIndex = newPage;
		this.loadTabData(this.isStateOfTab);
	}

	onPageSizeChange(newSize: number): void {
		this.pageSize = newSize;
		this.pageIndex = 1;
		this.loadTabData(this.isStateOfTab);
	}

	onPeriodsSelected(event: { month: string; periods: (string | number)[] }) {

		if (event.month && event.periods.length === 0) {
			const selectedMonth = this.monthOptions.find((m) => m.value === event.month);
			if (selectedMonth && selectedMonth.periods.length === 0) {
				this.loadPeriodsForMonth(event.month);
			} else {
				setTimeout(() => {
					this.monthOptions = [...this.monthOptions];
					this.cdr.detectChanges();
				});
			}
		}

		this.form.get('periods')?.setValue(event.periods, { emitEvent: true });
	}

	private setupSearchFilter(): void {
		const search$ = this.form.get('search')!.valueChanges.pipe(
			debounceTime(300),
			distinctUntilChanged()
		);

		const filters$ = ['actionId', 'periods'].map(field =>
			this.form.get(field)!.valueChanges.pipe(distinctUntilChanged())
		);

		merge(search$, ...filters$)
			.pipe(takeUntil(this.destroy$))
			.subscribe(() => {
				this.pageIndex = 1;
				this.loadTabData(this.isStateOfTab);
			});
	}

	private loadPeriodsForMonth(selectedLabel: string): void {
		const selectedMonth = this.monthOptions.find((m) => m.value === selectedLabel);
		if (!selectedMonth) {
			console.error('Mes no encontrado:', selectedLabel);
			return;
		}

		const monthValue = selectedMonth.value;
		const initialDate = `${this.currentYear}-${monthValue}-01`;
		const endDate = this.getLastDayOfMonth(this.currentYear, parseInt(monthValue));
		this.showLoadingModal();

		this.commissionManagerService.getListPeriodsByDate(initialDate, endDate).subscribe({
			next: (periods: any[]) => {
				this.monthOptions = this.monthOptions.map((m) =>
					m.value === monthValue ? { ...m, periods: this.createPeriodOptions(periods) } : m
				);
				this.forceSelectorUpdate();
				this.hideLoadingModal();
			},
			error: (error) => {
				console.error('Error:', error);
				this.hideLoadingModal();
			}
		});
	}

	private hideLoadingModal(): void {
		if (this.validationTimer) {
			clearTimeout(this.validationTimer);
			this.validationTimer = null;
		}

		this.prevValidatorModalRef?.close();
		this.loadingModalRef?.close();
		this.loadingModalRef = null;
		this.prevValidatorModalRef = null;
	}

	private forceSelectorUpdate(): void {
		this.refreshSelector = !this.refreshSelector;
		this.cdr.detectChanges();

		setTimeout(() => {
			this.refreshSelector = !this.refreshSelector;
			this.cdr.detectChanges();
		}, 0);
	}

	private showLoadingModal(): void {
		this.loadingModalRef = this.modalService.open(ModalLoadingComponentManageBusiness, {
			centered: true,
			size: 'sm'
		});
	}

	private initializeMonthOptions(): void {
		this.monthOptions = ALL_MONTHS.map((month) => ({
			...month,
			periods: []
		}));
	}

	private getLastDayOfMonth(year: number, month: number): string {
		const lastDay = new Date(year, month, 0).getDate();
		const formattedMonth = month < 10 ? `0${month}` : month.toString();
		const formattedDay = lastDay < 10 ? `0${lastDay}` : lastDay.toString();
		return `${year}-${formattedMonth}-${formattedDay}`;
	}

	private createPeriodOptions(periods: any[]): ISelectOpt[] {
		const options: ISelectOpt[] = [];
		periods.forEach((period) => {
			options.push(this.transformPeriodToSelectOpt(period));
		});
		return options;
	}

	private transformPeriodToSelectOpt(period: any): ISelectOpt {
		const initialDateObj = convertArrayToDate(period.initialDate);
		const endDateObj = convertArrayToDate(period.endDate);

		return {
			id: period.id.toString(),
			text: `${formatDateToDDMMYYYY(initialDateObj)} al ${formatDateToDDMMYYYY(endDateObj)}`
		};
	}

	getActionDescription(actionId: number): string {
		const action = this.statusReviewOptions.find(opt => +opt.id === actionId);
		console.log(action, 'action')
		return action?.text || 'Sin descripción';
	}

	private getModificationAudit(type: number): void {
		this.isLoading = true;

		const search = this.form.get('search')?.value || '';
		const actionId = this.form.get('actionId')?.value || null;
		const selectedPeriods: (string | number)[] = this.form.get('periods')?.value ?? [];
		const periodIds = selectedPeriods.map((id) => +id);

		console.log('🔍 Filtros enviados al backend:', {
			pageIndex: this.pageIndex - 1,
			pageSize: this.pageSize,
			type,
			periodIds,
			dateFilter: this.dateFilter,
			search,
			actionId
		});

		this.retiroService
			.getModificationAudit(
				this.pageIndex - 1,
				this.pageSize,
				type,
				periodIds,
				this.dateFilter,
				search,
				actionId
			)
			.pipe(takeUntil(this.destroy$))
			.subscribe({
				next: (response) => {
					console.log('✅ Respuesta del backend:', response);

					this.totalItems = response.totalElements || 0;
					console.log(response, 'response')
					if (type === 1) {
						if (Array.isArray(response.content) && response.content.length > 0) {
							this.data = response.content.map((item: any) => ({
								...item,
								fechaHora: item.createDate
									? `${item.createDate[2].toString().padStart(2, '0')}/${item.createDate[1]
										.toString()
										.padStart(2, '0')}/${item.createDate[0]} ${item.createDate[3]
											.toString()
											.padStart(2, '0')}:${item.createDate[4]
												.toString()
												.padStart(2, '0')}`
									: '',
								userName: `${item.name} ${item.lastName}`.trim(),
								actionDescription: this.getActionDescription(item.actionId)
							}));
						} else {
							this.data = [];
						}
					} else {
						if (Array.isArray(response.content) && response.content.length > 0) {
							this.dataOfFiles = response.content.map(this.mapAuditFileToRow.bind(this));
						} else {
							this.dataOfFiles = [];
						}
					}

					this.isLoading = false;
					this.cd.detectChanges();
				},
				error: (err) => {
					this.isLoading = false;
					this.cd.detectChanges();

					if (type === 1) {
						this.data = [];
					} else {
						this.dataOfFiles = [];
					}
					this.totalItems = 0;
				}
			});
	}

	private mapAuditFileToRow(item: AuditFile): AuditFileRow {
		const fechaHora = item.createDate
			? `${item.createDate[2].toString().padStart(2, '0')}/${item.createDate[1]
				.toString()
				.padStart(2, '0')}/${item.createDate[0]} ${item.createDate[3]
					.toString()
					.padStart(2, '0')}:${item.createDate[4].toString().padStart(2, '0')}`
			: '';

		return {
			fechaHora,
			userName: `${item.name} ${item.lastName}`,
			fileName: item.fileName.split('-').pop() ?? '',
			url: item.fileName,
			registros: item.recordsCount,
			actionId: item.actionId,
			actionDescription: this.getActionDescription(item.actionId),
			tamano: AuditRecordComponent.formatSize(item.size),
			formato: item.fileName.split('.').pop() ?? ''
		};
	}

	private static formatSize(size: string): string {
		const bytes = Number(size);
		if (isNaN(bytes)) return size;
		if (bytes < 1024) return `${bytes} B`;
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
		return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
	}

	onDownloadFile(row: AuditFileRow): void {
		if (row.url) {
			window.open(row.url, '_blank');
		} else {
			console.warn('No se encontró URL de descarga para:', row);
		}
	}

	private getListAccions(): void {
		this.retiroService
			.getBankReviewStatus()
			.pipe(takeUntil(this.destroy$))
			.subscribe({
				next: (response) => {
					if (response != null) {
						this.statusReviewOptions = response?.map((item: any) => ({
							id: item.id,
							text: item.description
						}));
						console.log('📋 statusReviewOptions:', this.statusReviewOptions);
					}
				},
				error: (err) => console.error('Error al obtener estados de revisión:', err)
			});
	}
}