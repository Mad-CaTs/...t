import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommissionManagerService } from '@app/commission-manager/services/commission-manager.service';
import { TableModel } from '@app/core/models/table.model';
import { TableService } from '@app/core/services/table.service';
import { ToastService } from '@app/core/services/toast.service';
import { ModalLoadingComponentManageBusiness } from '@app/manage-business/components/modals/modal-loading/modal-loading.component';
import { ITableBonusRank } from '@interfaces/commissions.interface';
import { NgbModal, NgbModalRef, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TablesModule } from '@shared/components/tables/tables.module';
import { ModalConfirmationCommissionComponent } from '../modal-confirmation/modal-confirmation-commission.component';
import { parsePeriodString } from '@utils/date';
import { ISelectOpt } from '@interfaces/form-control.interface';
import { ICreateMembershipBonusRangeRequest } from '@interfaces/wallet-transaction-type.interface';

interface IMonthOption {
	label: string;
	value: string;
	periods: ISelectOpt[];
}
@Component({
	selector: 'app-generate-commission-rank-bonus',
	standalone: true,
	imports: [CommonModule, FormsModule, TablesModule, NgbTooltipModule],
	templateUrl: './generate-commission-rank-bonus.component.html',
	styleUrls: ['./generate-commission-rank-bonus.component.scss']
})
export class GenerateCommissionRankBonusComponent {
	readonly table: TableModel<ITableBonusRank>;
	private loadingModalRef: NgbModalRef | null = null;
	private originalValues: { [key: number]: { amount: number } } = {};

	selectedRowId: number | null = null;
	userId: number = 0;
	userName: string = '';
	selectedPeriods: { id: string | number; name: string }[] = [];
	monthOptions: IMonthOption[] = [];
	get formattedPeriods(): string {
		return this.selectedPeriods.map((p) => p.name).join(', ');
	}

	constructor(
		private route: ActivatedRoute,
		private tableService: TableService,
		private commissionManagerService: CommissionManagerService,
		public modalService: NgbModal,
		private cdr: ChangeDetectorRef,
		private toastService: ToastService,
		private router: Router
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
	}

	ngOnInit(): void {
		const state = history.state as {
			user: { id: number; name: string };
			periods: { id: number; name: string }[];
		};

		if (state?.user && state?.periods) {
			this.userId = state.user.id;
			this.userName = state.user.name;
			this.selectedPeriods = state.periods;
		}

		this.reloadRankBonusData();
	}

	private reloadRankBonusData(): void {
		const today = new Date();
		const formattedDate = today.toISOString().split('T')[0];
		this.showLoadingModal();

		this.commissionManagerService.getLastPeriodToPay(formattedDate).subscribe({
			next: (periodData) => {
				const idPeriod = +periodData.id;

				this.commissionManagerService.getListRankBonus(this.userId, [idPeriod]).subscribe({
					next: (data) => {
						this.table.data = this.transformApiDataToTableFormat(data);
						this.hideLoadingModal();
						this.cdr.detectChanges();
					},
					error: (err) => {
						this.hideLoadingModal();
						this.toastService.addToast('Error al obtener los bonos.', 'error');
						console.error('Error en getListRankBonus:', err);
					}
				});
			},
			error: (err) => {
				this.hideLoadingModal();
				this.toastService.addToast('Error al obtener el periodo actual.', 'error');
				console.error('Error en getPeriodDate:', err);
			}
		});
	}

	onEditBonus() {
		if (!this.selectedRowId) return;
		const selectedItem = this.table.data.find((item) => item.id === this.selectedRowId);
		if (!selectedItem) return;

		if (selectedItem.difference === 0) {
			this.toastService.addToast(
				'El monto a regularizar no puede ser igual al monto actual.',
				'warning'
			);
			return;
		}

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

		const updateData = {
			id: selectedItem.id,
			idSponsor: selectedItem.idSponsor,
			idSlave: selectedItem.idSlave,
			levelSponsor: selectedItem.levelSponsor,
			registerDate: selectedItem.registerDate,
			exchangeRate: selectedItem.exchangeRate,
			typeBonus: selectedItem.typeBonus,
			amount: selectedItem.regularization,
			isLevelQualified: selectedItem.isLevelQualified,
			isConditionQualified: selectedItem.isConditionQualified,
			commissionCase: selectedItem.commissionCase,
			idSuscription: selectedItem.idSuscription,
			idStatus: selectedItem.idStatus,
			percentage: null,
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

		const createCommission: ICreateMembershipBonusRangeRequest = {
			idSponsor: selectedItem.idSponsor,
			idSlave: selectedItem.idSlave,
			levelSponsor: selectedItem.levelSponsor,
			registerDate: selectedItem.registerDate,
			exchangeRate: selectedItem.exchangeRate,
			typeBonus: selectedItem.typeBonus,
			amount: selectedItem.difference,
			isLevelQualified: selectedItem.isLevelQualified,
			isConditionQualified: selectedItem.isConditionQualified,
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
				regularization: 0,
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
		const previousId = this.selectedRowId;
		this.selectedRowId = item.id;

		if (previousId !== null && previousId !== item.id) {
			const previousItem = this.table.data.find((i) => i.id === previousId);
			if (previousItem && this.originalValues[previousId]) {
				previousItem.amount = this.originalValues[previousId].amount;
				previousItem.regularization = 0;
				previousItem.difference = 0;
			}
		}

		if (!this.originalValues[item.id]) {
			this.originalValues[item.id] = { amount: item.amount };
		}

		if (item.amount == null || item.amount < 0) {
			item.amount = 0;
		}

		if (item.regularization == null) item.regularization = 0;
		if (item.difference == null) item.difference = 0;
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

	public navigateToBack(): void {
		this.router.navigate(['/dashboard/commission-manager/rank-bonus']);
	}
}
