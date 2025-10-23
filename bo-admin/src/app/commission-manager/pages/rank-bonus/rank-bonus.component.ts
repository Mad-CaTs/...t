import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { CommissionManagerService } from '@app/commission-manager/services/commission-manager.service';
import { TableModel } from '@app/core/models/table.model';
import { TableService } from '@app/core/services/table.service';
import { ToastService } from '@app/core/services/toast.service';
import { ModalLoadingComponentManageBusiness } from '@app/manage-business/components/modals/modal-loading/modal-loading.component';
import { UserService } from '@app/users/services/user.service';
import { ITableBonusRank } from '@interfaces/commissions.interface';
import { ISelectOpt } from '@interfaces/form-control.interface';
import { NgbModal, NgbModalRef, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { TablesModule } from '@shared/components/tables/tables.module';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { convertArrayToDate, formatDateToDDMMYYYY, parsePeriodString } from '../../../utils/date';
import { ALL_MONTHS } from '@constants/commission-affiliation.constant';
import { ModalConfirmationCommissionComponent } from '@app/commission-manager/components';
import { ICreateMembershipBonusRangeRequest } from '@interfaces/wallet-transaction-type.interface';
import { ActivatedRoute, Router } from '@angular/router';

interface IMonthOption {
	label: string;
	value: string;
	periods: ISelectOpt[];
}
@Component({
	selector: 'app-rank-bonus',
	standalone: true,
	imports: [CommonModule, FormControlModule, FormsModule, NgbTooltipModule, TablesModule],
	templateUrl: './rank-bonus.component.html',
	styleUrls: ['./rank-bonus.component.scss']
})
export class RankBonusComponent {
	readonly table: TableModel<ITableBonusRank>;
	private loadingModalRef: NgbModalRef | null = null;
	public searchLoading: boolean = false;
	public form: FormGroup;
	public canGenerateCommission = false;
	buttonLoading: boolean = false;
	buttonGenerateLoading: boolean = false;
	selectedRowId: number | null = null;
	selectedUser: ISelectOpt | null = null;
	fechacOpt: ISelectOpt[] = [];
	users: ISelectOpt[] = [];
	monthOptions: IMonthOption[] = [];
	currentYear: number = new Date().getFullYear();
	refreshSelector = false;
	private originalValues: {
		[key: number]: {
			amount: number;
			regularization: number;
			difference: number;
			byStatus: boolean;
			byMembership: boolean;
		};
	} = {};

	constructor(
		private formBuilder: FormBuilder,
		private userService: UserService,
		private commissionManagerService: CommissionManagerService,
		private cdr: ChangeDetectorRef,
		private tableService: TableService,
		public modalService: NgbModal,
		private toastService: ToastService,
		private router: Router,
		private route: ActivatedRoute
	) {
		this.table = this.tableService.generateTable<ITableBonusRank>({
			headers: [
				'Username',
				'Tipo de bono',
				'Rango',
				'Monto',
				'Regularización',
				'Diferencia',
				'Por Nivel',
				'Por Condición',
				'Fecha de registro',
				'Ciclo de referencia',
				'Acciones'
			],
			noCheckBoxes: true
		});

		this.table.data = [];

		this.form = formBuilder.group({
			userId: [null],
			cicles: [null],
			periods: [[]]
		});
	}

	ngOnInit(): void {
		const message = 'Ingresa el usuario del socio a buscar.';
		this.toastService.addToast(message, 'info');
		this.initializeMonthOptions();
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

	private reloadRankBonusData(): void {
		const { userId } = this.form.value;
		const selectedIds: (string | number)[] = this.form.get('periods')?.value || [];
		const periodIds = selectedIds.map((id) => (typeof id === 'string' ? parseInt(id, 10) : id));

		this.showLoadingModal();
		this.commissionManagerService.getListRankBonus(userId.id, periodIds).subscribe({
			next: (data) => {
				this.table.data = this.transformApiDataToTableFormat(data);
				this.hideLoadingModal();
				this.cdr.detectChanges();
			},
			error: (error) => {
				console.error('Error al actualizar la tabla:', error);
				this.hideLoadingModal();
			}
		});
	}

	userSearchFn = (term: string): Observable<ISelectOpt[]> => {
		if (!term || term.length < 3) {
			return of([]);
		}

		return this.userService.searchUsersByQuery(term).pipe(
			catchError((err) => {
				console.error('error buscando usuario', err);
				return of([]);
			})
		);
	};

	onSearch() {
		if (this.form.invalid) {
			this.form.markAllAsTouched();
			return;
		}

		this.buttonLoading = true;
		const { userId } = this.form.value;
		this.showLoadingModal();
		const selectedIds: (string | number)[] = this.form.get('periods')?.value || [];

		if (selectedIds.length === 0) {
			this.toastService.addToast('Selecciona al menos un ciclo.', 'warning');
			this.hideLoadingModal();
			this.buttonLoading = false;
			return;
		}

		const periodIds = selectedIds.map((id) => (typeof id === 'string' ? parseInt(id, 10) : id));

		this.commissionManagerService.getListRankBonus(userId.id, periodIds).subscribe({
			next: (data) => {
				this.buttonLoading = false;
				this.hideLoadingModal();
				this.table.data = this.transformApiDataToTableFormat(data);
				this.canGenerateCommission = this.table.data.length === 0;
				if (this.canGenerateCommission) {
					this.toastService.addToast('Genera sus comisiones en el sistema.', 'info');
				}
				this.cdr.detectChanges();
			},
			error: (error) => {
				this.buttonLoading = false;
				this.hideLoadingModal();
				console.error('Error al buscar bonos:', error);
			}
		});
	}

	private transformPeriodToSelectOpt(period: any): ISelectOpt {
		const initialDateObj = convertArrayToDate(period.initialDate);
		const endDateObj = convertArrayToDate(period.endDate);

		return {
			id: period.id.toString(),
			text: `${formatDateToDDMMYYYY(initialDateObj)} al ${formatDateToDDMMYYYY(endDateObj)}`
		};
	}

	private transformApiDataToTableFormat(apiData: any[]): ITableBonusRank[] {
		if (!apiData || !Array.isArray(apiData)) {
			console.error('Datos del API no válidos:', apiData);
			return [];
		}

		const allPeriodOpts: ISelectOpt[] = this.monthOptions.reduce(
			(acc, month) => acc.concat(month.periods),
			[] as ISelectOpt[]
		);

		return apiData.map((item) => {
			const opt = allPeriodOpts.find((o) => o.id === String(item.idPeriod));
			const periodText = opt ? opt.text : String(item.idPeriod);

			return {
				id: item.id,
				username: item.username || '',
				rangeName: item.range || '',
				amount: item.amount || 0,
				bonusTypeName: item.description,
				byStatus: item.isLevelQualified || false,
				byMembership: item.isConditionQualified || false,
				createDate: this.formatDate(item.registerDate),
				period: periodText,
				idPeriod: item.idPeriod,
				idSponsor: item.idSponsor,
				idSlave: item.idSlave,
				levelSponsor: item.levelSponsor,
				registerDate: item.registerDate,
				typeBonus: item.typeBonus,
				exchangeRate: item.exchangeRate,
				description: item.description,
				isLevelQualified: item.isLevelQualified,
				isConditionQualified: item.isConditionQualified,
				commissionCase: item.commissionCase,
				idSuscription: item.idSuscription,
				idStatus: item.idStatus,
				idTransaction: item.idTransaction,
				percentage: item.percentage,
				points: item.points,
				insertDate: item.insertDate,
				paidStatus: item.paidStatus,
				type: item.type,
				regularization: item.amount,
				difference: 0,
				name: item.name || '',
				lastname: item.lastname || '',
				nameSponsor: item.nameSponsor || '',
				lastNameSponsor: item.lastNameSponsor || '',
				range: item.range || '',
				initialDatePeriod: item.initialDatePeriod || [],
				endDatePeriod: item.endDatePeriod || []
			};
		});
	}

	private formatDate(dateArray: number[]): string {
		if (!dateArray || dateArray.length < 5) return '';
		return `${dateArray[0]}-${dateArray[1].toString().padStart(2, '0')}-${dateArray[2]
			.toString()
			.padStart(2, '0')}`;
	}

	onRowSelect(item: ITableBonusRank): void {
		const prevId = this.selectedRowId;
		this.selectedRowId = item.id;

		if (prevId !== null && prevId !== item.id) {
			const prevItem = this.table.data.find((i) => i.id === prevId);
			const orig = this.originalValues[prevId];
			if (prevItem && orig) {
				prevItem.amount = orig.amount;
				prevItem.regularization = orig.regularization;
				prevItem.difference = orig.difference;
				prevItem.byStatus = orig.byStatus;
				prevItem.byMembership = orig.byMembership;
			}
		}

		if (!this.originalValues[item.id]) {
			this.originalValues[item.id] = {
				amount: item.amount,
				regularization: item.regularization || 0,
				difference: item.difference || 0,
				byStatus: item.byStatus,
				byMembership: item.byMembership
			};
		}

		item.regularization = item.regularization ?? 0;
		item.difference = item.difference ?? 0;
	}

	onAmountInput(event: Event, item: ITableBonusRank): void {
		const input = event.target as HTMLInputElement;
		const original = input.value;
		let val = original.replace(/[^0-9.]/g, '');

		const parts = val.split('.');
		if (parts.length > 1) {
			val = `${parts.shift()}.${parts.join('').slice(0, 2)}`;
		}
		if (val.startsWith('.')) val = '0' + val;

		if (val !== original) input.value = val;

		item.regularization = +val || 0;
		item.difference = +(item.regularization - item.amount).toFixed(2);
	}

	private showLoadingModal(): void {
		this.loadingModalRef = this.modalService.open(ModalLoadingComponentManageBusiness, {
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

	onEditBonus() {
		if (!this.selectedRowId) return;
		const selectedItem = this.table.data.find((item) => item.id === this.selectedRowId);
		if (!selectedItem) return;

		const periodId: number = selectedItem.idPeriod;
		this.showLoadingModal();

		this.commissionManagerService.getValidatePeriod(periodId).subscribe({
			next: (response) => {
				this.hideLoadingModal();

				if (response === true) {
					const modalRef = this.modalService.open(ModalConfirmationCommissionComponent, {
						centered: true
					});

					modalRef.componentInstance.title = '¿Estás seguro de guardar?';
					modalRef.componentInstance.message =
						'La modificación es referente al ciclo actual y el monto se reflejara en sus comisiones y se actualizará el dia de su pago mediante el wallet.';
					modalRef.componentInstance.confirmButtonText = 'Sí, guardar';

					modalRef.componentInstance.confirmAction.subscribe(() => {
						this.confirmEditPeriodTrue();
					});
				} else {
					const modalRef = this.modalService.open(ModalConfirmationCommissionComponent, {
						centered: true
					});

					modalRef.componentInstance.title = '¿Estás seguro de guardar?';
					modalRef.componentInstance.message =
						'Ten en cuenta, que el ciclo de referencia ya está cerrado. Las comisiones se generarán en el siguiente ciclo activo.';
					modalRef.componentInstance.confirmButtonText = 'Sí, guardar';

					modalRef.componentInstance.confirmAction.subscribe(() => {
						this.confirmEditPeriodFalse();
					});
				}
				this.cdr.detectChanges();
			},
			error: (error) => {
				this.hideLoadingModal();
				this.toastService.addToast('Error al actualizar el bono', 'error');
				console.error('Error updating bonus:', error);
			}
		});
	}

	confirmEditPeriodTrue() {
		const selectedItem = this.table.data.find((item) => item.id === this.selectedRowId);
		if (!selectedItem) return;
		const { initial, end } = parsePeriodString(selectedItem.period);
		this.showLoadingModal();

		const orig = this.originalValues[selectedItem.id];
		const regularizationToSend =
			selectedItem.regularization !== undefined && selectedItem.regularization !== null
				? selectedItem.regularization
				: orig.regularization;

		const updateData = {
			id: selectedItem.id,
			idSponsor: selectedItem.idSponsor,
			idSlave: selectedItem.idSlave,
			levelSponsor: selectedItem.levelSponsor,
			registerDate: selectedItem.registerDate,
			exchangeRate: selectedItem.exchangeRate,
			typeBonus: selectedItem.typeBonus,
			amount: regularizationToSend,
			isLevelQualified: selectedItem.byStatus,
			isConditionQualified: selectedItem.byMembership,
			commissionCase: selectedItem.commissionCase,
			idSuscription: selectedItem.idSuscription,
			idStatus: selectedItem.idStatus,
			percentage: selectedItem.percentage,
			points: selectedItem.points,
			insertDate: selectedItem.insertDate,
			idTransaction: selectedItem.idTransaction,
			type: selectedItem.type,
			idPeriod: selectedItem.idPeriod,
			paidStatus: selectedItem.paidStatus,
			description: selectedItem.description,
			name: selectedItem.name,
			lastname: selectedItem.lastname,
			username: selectedItem.username,
			nameSponsor: selectedItem.name,
			lastNameSponsor: selectedItem.lastname,
			range: selectedItem.range,
			initialDatePeriod: initial,
			endDatePeriod: end
		};

		this.commissionManagerService.updateUserMembershipBonusRank(updateData).subscribe({
			next: (response) => {
				this.hideLoadingModal();
				this.toastService.addToast('Bono actualizado correctamente.', 'success');
				if (this.selectedRowId) {
					delete this.originalValues[this.selectedRowId];
				}
				this.selectedRowId = null;
				this.reloadRankBonusData();
				this.cdr.detectChanges();
			},
			error: (error) => {
				this.hideLoadingModal();
				this.toastService.addToast('Error al actualizar el bono', 'error');
				console.error('Error updating bonus:', error);
			}
		});
	}

	confirmEditPeriodFalse() {
		const selectedItem = this.table.data.find((item) => item.id === this.selectedRowId);
		if (!selectedItem) return;
		const { initial, end } = parsePeriodString(selectedItem.period);
		this.showLoadingModal();

		const orig = this.originalValues[selectedItem.id];
		const regularizationToSend =
			selectedItem.regularization !== undefined && selectedItem.regularization !== null
				? selectedItem.regularization
				: orig.regularization;

		const diff = +(regularizationToSend - orig.amount).toFixed(2);
		const amountToSend = diff !== 0 ? diff : regularizationToSend;

		const createCommission: ICreateMembershipBonusRangeRequest = {
			idSponsor: selectedItem.idSponsor,
			idSlave: selectedItem.idSlave,
			levelSponsor: selectedItem.levelSponsor,
			registerDate: selectedItem.registerDate,
			exchangeRate: selectedItem.exchangeRate,
			typeBonus: selectedItem.typeBonus,
			amount: amountToSend,
			isLevelQualified: selectedItem.byStatus,
			isConditionQualified: selectedItem.byMembership,
			commissionCase: selectedItem.commissionCase,
			idSuscription: selectedItem.idSuscription,
			idStatus: selectedItem.idStatus,
			percentage: selectedItem.percentage,
			points: selectedItem.points,
			insertDate: selectedItem.insertDate,
			idTransaction: selectedItem.idTransaction,
			type: selectedItem.type,
			idPeriod: selectedItem.idPeriod,
			paidStatus: selectedItem.paidStatus,
			description: selectedItem.description,
			name: selectedItem.name,
			lastname: selectedItem.lastname,
			username: selectedItem.username,
			nameSponsor: selectedItem.name,
			lastNameSponsor: selectedItem.lastname,
			range: selectedItem.range,
			initialDatePeriod: initial,
			endDatePeriod: end
		};

		this.commissionManagerService.postUserMembershipBonusRange(createCommission).subscribe({
			next: (response) => {
				this.hideLoadingModal();
				this.toastService.addToast(
					'Bono actualizado correctamente. Se verá reflejado en su siguiente ciclo.',
					'success'
				);
				if (this.selectedRowId) {
					delete this.originalValues[this.selectedRowId];
				}
				this.selectedRowId = null;
				this.reloadRankBonusData();
				this.cdr.detectChanges();
			},
			error: (error) => {
				this.hideLoadingModal();
				this.toastService.addToast('Error al actualizar el bono', 'error');
				console.error('Error updating bonus:', error);
			}
		});
	}

	onGenerateCommission(): void {
		const user: ISelectOpt = this.form.get('userId')?.value;
		const selectedIds: (string | number)[] = this.form.get('periods')?.value || [];

		if (selectedIds.length === 0) {
			this.toastService.addToast('Selecciona al menos un ciclo.', 'warning');
			this.hideLoadingModal();
			return;
		}

		const modalRef = this.modalService.open(ModalConfirmationCommissionComponent, {
			centered: true
		});

		modalRef.componentInstance.title = '¿Estás seguro de guardar?';
		modalRef.componentInstance.message =
			'La modificación se verá reflejada en el periodo más próximo a pagar.';
		modalRef.componentInstance.confirmButtonText = 'Sí, guardar';

		modalRef.componentInstance.confirmAction.subscribe(() => {
			this.showLoadingModal();

			const userIdNumber = Number(user.id);
			const allPeriodOpts: ISelectOpt[] = this.monthOptions.reduce(
				(acc, m) => acc.concat(m.periods),
				[] as ISelectOpt[]
			);

			const periodObjects = selectedIds.map((id) => {
				const numId = typeof id === 'string' ? parseInt(id, 10) : id;
				const opt = allPeriodOpts.find((o) => o.id.toString() === id.toString());
				return { id: numId, text: opt?.text ?? String(numId) };
			});

			let hasError = false;

			const requests = periodObjects.map((p) =>
				this.commissionManagerService.postBonusRange(p.id, userIdNumber).pipe(
					catchError((err: any) => {
						const actualError = typeof err === 'function' ? err() : err;
						const msg =
							actualError instanceof Error
								? actualError.message
								: actualError?.toString() || 'Error al generar comisión';
						this.toastService.addToast(msg, 'error');
						hasError = true;
						return of(null);
					})
				)
			);

			forkJoin(requests).subscribe({
				next: (results) => {
					this.hideLoadingModal();

					if (hasError) {
						return;
					}

					this.toastService.addToast('Comisiones generadas correctamente.', 'success');
					this.router.navigate(['generate-commission-rank-bonus'], {
						relativeTo: this.route,
						state: {
							user: { id: user.id, name: user.text },
							periods: periodObjects.map((p) => ({ id: p.id, name: p.text }))
						}
					});
				},
				error: (err) => {
					console.error('Error generando comisiones:', err);
					this.hideLoadingModal();
					this.toastService.addToast(
						err instanceof Error ? err.message : 'Ocurrió un error inesperado.',
						'error'
					);
				}
			});
		});
	}
}
