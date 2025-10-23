import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommissionManagerService } from '@app/commission-manager/services/commission-manager.service';
import { TableModel } from '@app/core/models/table.model';
import { TableService } from '@app/core/services/table.service';
import { ModalLoadingComponentManageBusiness } from '@app/manage-business/components/modals/modal-loading/modal-loading.component';
import { ALL_MONTHS } from '@constants/commission-affiliation.constant';
import { ITableHistoricalCommissions } from '@interfaces/commissions.interface';
import { ISelectOpt } from '@interfaces/form-control.interface';
import { NgbModal, NgbModalRef, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { TablesModule } from '@shared/components/tables/tables.module';
import { ArrayDatePipe } from '@shared/pipes/array-date.pipe';
import { convertArrayToDate, formatDateToDDMMYYYY } from '@utils/date';
import { InlineSVGModule } from 'ng-inline-svg-2';

interface IMonthOption {
	label: string;
	value: string;
	periods: ISelectOpt[];
}

@Component({
	selector: 'app-commissions',
	standalone: true,
	imports: [
		CommonModule,
		TablesModule,
		InlineSVGModule,
		FormControlModule,
		ReactiveFormsModule,
		ArrayDatePipe,
		NgbPaginationModule
	],
	providers: [ArrayDatePipe],
	templateUrl: './commissions.component.html',
	styleUrls: ['./commissions.component.scss']
})
export class CommissionsComponent {
	public readonly table: TableModel<ITableHistoricalCommissions>;
	private originalData: ITableHistoricalCommissions[] = [];
	private loadingModalRef: NgbModalRef | null = null;
	private readonly initialFormValues = {
		month: null,
		typeBonus: null,
		search: ''
	};

	form: FormGroup;
	currentPage: number = 0;
	pageSize: number = 10;
	totalItems: number = 0;

	get totalPages(): number {
		return Math.ceil(this.totalItems / this.pageSize);
	}

	get visiblePages(): number[] {
		const pagesToShow = 5;
		const pages = [];

		let start = Math.max(this.currentPage - Math.floor(pagesToShow / 2), 0);
		let end = Math.min(start + pagesToShow, this.totalPages);

		if (end - start < pagesToShow) {
			start = Math.max(end - pagesToShow, 0);
		}

		for (let i = start; i < end; i++) {
			pages.push(i);
		}

		return pages;
	}

	goToPage(page: number): void {
		if (page < 0 || page >= this.totalPages) return;

		this.currentPage = page;

		if (this.hasLocalFilter()) {
			this.applyCurrentFilters();
		} else {
			const selectedPeriods: (string | number)[] = this.form.get('periods')?.value ?? [];

			const periodIds = selectedPeriods.map((id) => +id);

			this.fetchHistoricalData(periodIds, page);
		}
	}

	// Selects
	dateOpt: ISelectOpt[] = [];
	typeBonusOpt: ISelectOpt[] = [];
	monthOptions: IMonthOption[] = [];
	refreshSelector = false;
	currentYear: number = new Date().getFullYear();

	constructor(
		private tableService: TableService,
		private commissionManagerService: CommissionManagerService,
		private modalService: NgbModal,
		private fb: FormBuilder,
		private cdr: ChangeDetectorRef,
		private arrayDatePipe: ArrayDatePipe
	) {
		this.table = this.tableService.generateTable<ITableHistoricalCommissions>({
			headers: [
				'Fecha de ciclo',
				'Patrocinador',
				'Usuario socio',
				'Socio',
				'Nivel',
				'Tipo de bono',
				'Membresías',
				'%',
				'Puntos',
				'Monto'
			],
			noCheckBoxes: true
		});

		this.form = this.fb.group({
			cicles: [null],
			periods: [[]],
			typeBonus: [null],
			search: ['']
		});
	}

	ngOnInit(): void {
		this.initializeMonthOptions();
		this.commissionManagerService.getWalletTransactionTypesAsOptions().subscribe(
			(typeCommission) => {
				this.typeBonusOpt = [
					...typeCommission,
					{
						id: '28',
						text: 'Bono Logro de Rango'
					}
				];
				this.cdr.detectChanges();
			},
			(error) => {
				console.error('Error fetching states:', error);
			}
		);

		this.fetchHistoricalData();
	}

	private fetchHistoricalData(periodIds: number[] = [], page: number = 0): void {
		this.showLoadingModal();

		this.commissionManagerService.getHistoryBonus(periodIds, 0, 1000).subscribe({
			next: (res) => {
				this.originalData = this.transformApiDataToTableFormat(res.data);
				this.totalItems = this.originalData.length;
				this.currentPage = 0;

				this.applyCurrentFilters();
				this.hideLoadingModal();
				this.cdr.detectChanges();
			},
			error: (err) => {
				console.error('Error al cargar histórico:', err);
				this.hideLoadingModal();
			}
		});
	}

	onFilter(): void {
		const selectedPeriods: (string | number)[] = this.form.get('periods')?.value ?? [];
		if (!selectedPeriods.length) {
			this.applyCurrentFilters();
			return;
		}
		const periodIds = selectedPeriods.map((id) => +id);
		this.fetchHistoricalData(periodIds);
	}

	private applyCurrentFilters(): void {
		const searchTerm = this.normalize(this.form.get('search')?.value);
		const selectedBonusId = this.form.get('typeBonus')?.value;
		const selectedBonusLabel = selectedBonusId
			? this.typeBonusOpt.find((o) => o.id === selectedBonusId)?.text ?? ''
			: '';
		const normalizedBonus = this.normalize(selectedBonusLabel);
		const selectedPeriods = (this.form.get('periods')?.value as (string | number)[]) || [];
		const monthValue = this.form.get('cicles')?.value as string | null;

		const filtered = this.originalData.filter((item) => {
			const matchesText =
				!searchTerm ||
				[item.fullnameUser, item.userNameUser, item.fullnameSlave].some((f) =>
					this.normalize(f).includes(searchTerm)
				);

			const matchesBonus = !normalizedBonus || this.normalize(item.tipoBono) === normalizedBonus;
			const matchesPeriod = this.matchesMonthOrPeriods(item, selectedPeriods, monthValue);

			return matchesText && matchesBonus && matchesPeriod;
		});

		if (this.hasLocalFilter()) {
			this.totalItems = filtered.length;
			const start = this.currentPage * this.pageSize;
			const end = start + this.pageSize;
			this.table.data = filtered.slice(start, end);
		} else {
			this.table.data = filtered;
		}
	}

	private matchesMonthOrPeriods(
		item: ITableHistoricalCommissions,
		selectedPeriods: (string | number)[],
		monthValue: string | null
	): boolean {
		if (selectedPeriods && selectedPeriods.length > 0) {
			return selectedPeriods.map((id) => id.toString()).includes(item.idPeriod?.toString());
		}

		if (monthValue) {
			const [, month] = item.cycleDate.split('-');
			return month === monthValue.padStart(2, '0');
		}

		return true;
	}

	private hasLocalFilter(): boolean {
		return true;
	}

	onClear(): void {
		this.form.reset(this.initialFormValues);
		this.table.data = [];
		this.currentPage = 0;
		this.fetchHistoricalData();
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

		this.form.get('periods')?.setValue(event.periods);
	}

	private forceSelectorUpdate(): void {
		this.refreshSelector = !this.refreshSelector;
		this.cdr.detectChanges();

		setTimeout(() => {
			this.refreshSelector = !this.refreshSelector;
			this.cdr.detectChanges();
		}, 0);
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

	private normalize(value: string | null | undefined): string {
		return (value ?? '')
			.toLowerCase()
			.normalize('NFD')
			.replace(/\p{Diacritic}/gu, '')
			.trim();
	}

	private transformApiDataToTableFormat(apiData: any[]): ITableHistoricalCommissions[] {
		if (!Array.isArray(apiData)) return [];

		return apiData.map((item) => ({
			id: item.id,
			idBonus: item.idBonus,
			idUser: item.idUser,
			nameUser: item.nameUser,
			lastNameUser: item.lastNameUser,
			userNameUser: item.userNameUser,
			fullnameUser: `${item.nameUser} ${item.lastNameUser}`,
			idSlave: item.idSlave,
			nameSlave: item.nameSlave,
			lastNameSlave: item.lastNameSlave,
			fullnameSlave: `${item.nameSlave} ${item.lastNameSlave}`,
			levelSponsor: item.levelSponsor,
			tipoBono: item.tipoBono,
			membresia: item.membresia,
			amount: item.amount,
			percentage: item.percentage,
			points: item.points,
			cycleDate: this.formatDate(item.cycleDate),
			idPeriod: item.idPeriod
		}));
		// .sort((a, b) => b.idPeriod - a.idPeriod);
	}

	private formatDate(dateArray: number[]): string {
		if (!dateArray?.length) return '';
		const [y, m, d] = dateArray;
		return `${y}-${m.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;
	}

	onPageChange(page: number): void {
		const selectedPeriods: (string | number)[] = this.form.get('periods')?.value ?? [];
		const periodIds = selectedPeriods.map((id) => +id);

		this.fetchHistoricalData(periodIds, page - 1);
	}

	private showLoadingModal(): void {
		this.loadingModalRef = this.modalService.open(ModalLoadingComponentManageBusiness, {
			centered: true,
			size: 'sm'
		});
	}

	private hideLoadingModal(): void {
		this.loadingModalRef?.close();
		this.loadingModalRef = null;
	}
}
