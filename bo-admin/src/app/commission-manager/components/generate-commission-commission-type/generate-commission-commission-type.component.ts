import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommissionManagerService } from '@app/commission-manager/services/commission-manager.service';
import { TableModel } from '@app/core/models/table.model';
import { TableService } from '@app/core/services/table.service';
import { ToastService } from '@app/core/services/toast.service';
import { ModalLoadingComponentManageBusiness } from '@app/manage-business/components/modals/modal-loading/modal-loading.component';
import { commissionAffiliationConstant } from '@constants/commission-affiliation.constant';
import { ITableCommissionType } from '@interfaces/commissions.interface';
import { ISelectOpt } from '@interfaces/form-control.interface';
import { IDataCommissionAffiliation } from '@interfaces/wallet-transaction-type.interface';
import { NgbModal, NgbModalRef, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TablesModule } from '@shared/components/tables/tables.module';

@Component({
	selector: 'app-generate-commission-commission-type',
	standalone: true,
	imports: [CommonModule, FormsModule, TablesModule, NgbTooltipModule],
	templateUrl: './generate-commission-commission-type.component.html',
	styleUrls: ['./generate-commission-commission-type.component.scss']
})
export class GenerateCommissionCommissionTypeComponent {
	readonly table: TableModel<ITableCommissionType>;
	private loadingModalRef: NgbModalRef | null = null;
	private originalValues: { [key: number]: { percentage: number; amount: number } } = {};
	private _allowedPercents: number[] = [];

	userId: number | null = null;
	userName: string = '';
	typeBonusId: number | null = null;
	typeBonusText: string = '';
	membershipId: number | null = null;
	membershipName: string = '';
	percentOpt: ISelectOpt[] = [];
	get allowedPercents(): number[] {
		return this._allowedPercents;
	}

	selectedRowId: number | null = null;

	constructor(
		private route: ActivatedRoute,
		private tableService: TableService,
		private commissionManagerService: CommissionManagerService,
		public modalService: NgbModal,
		private cdr: ChangeDetectorRef,
		private toastService: ToastService,
		private router: Router
	) {
		this.table = this.tableService.generateTable<ITableCommissionType>({
			headers: [
				'Nivel',
				'Monto',
				'%',
				'Tipo de bono',
				'Membresía',
				'Por Nivel',
				'Por Condición',
				'Fecha de registro',
				'Ciclo de referencia',
				'Usuario socio',
				'Socio',
				'Acciones'
			],
			noCheckBoxes: true,
			headersMinWidth: [50, 70, 70],
			headersMaxWidth: [50, 70, 70]
		});
	}

	ngOnInit(): void {
		const state = history.state as {
			user: { id: number; name: string };
			typeBonus: { id: number; text: string };
			membership: { id: number; name: string };
			typeCommission: number;
			isMigrated: number;
			levelsData: any[];
		};

		if (state && state.user && state.typeBonus && state.membership) {
			this.userId = state.user.id;
			this.userName = state.user.name;
			this.typeBonusId = state.typeBonus.id;
			this.typeBonusText = state.typeBonus.text;
			this.membershipId = state.membership.id;
			this.membershipName = state.membership.name;

			if (Array.isArray(state.levelsData)) {
				this.table.data = this.mapLevelsToTable(state.levelsData);
			}
		}
	}

	onRowSelect(item: any): void {
		if (this.selectedRowId !== null && this.selectedRowId !== item.id) {
			const previousItem = this.table.data.find((i) => i.id === this.selectedRowId);
			if (previousItem && this.originalValues[this.selectedRowId]) {
				previousItem.percentage = this.originalValues[this.selectedRowId].percentage;
				previousItem.amount = this.originalValues[this.selectedRowId].amount;
			}
		}

		this.selectedRowId = item.id;

		if (!this.originalValues[item.id]) {
			this.originalValues[item.id] = {
				percentage: item.percentage,
				amount: item.amount
			};
		}

		const itemType = item.typeBonus;
		const selectedLevel = item.levelSponsor ? parseInt(item.levelSponsor) : undefined;

		if (itemType && selectedLevel !== undefined) {
			const typeId = this.mapBonusTypeToCommissionType(itemType);
			if (typeId !== null) {
				this.handlePercentCommission(typeId, selectedLevel);
			}
		}

		if (!item.percentage && this.percentOpt.length > 0) {
			item.percentage = parseInt(this.percentOpt[0].text);
		}

		this.calculateAmount(item);
		this.cdr.detectChanges();
	}

	private mapBonusTypeToCommissionType(bonusType: number): number | null {
		const commissionTypes = commissionAffiliationConstant;

		if (bonusType === 3 || bonusType === 7) {
			return commissionTypes[0].typeId;
		} else if (bonusType === 22) {
			return commissionTypes[1].typeId;
		} else if (bonusType === 23 || bonusType === 29) {
			return commissionTypes[2].typeId;
		}
		return null;
	}

	private handlePercentCommission(type: any, selectedLevel?: number): void {
		this.commissionManagerService.getPercentCommissionAffiliation(type).subscribe(
			(response: IDataCommissionAffiliation[]) => {
				const filteredData =
					selectedLevel !== undefined
						? response.filter((item) => item.levelUser === selectedLevel)
						: response;

				this.percentOpt = filteredData.reduce((acc, item) => {
					acc.push(
						{
							id: `${item.id}-less`,
							text: `${item.pointsLess}`
						},
						{
							id: `${item.id}-higher`,
							text: `${item.pointsHigher}`
						}
					);
					return acc;
				}, [] as ISelectOpt[]);

				this.updateAllowedPercents();
				this.cdr.detectChanges();
			},
			(error) => {
				console.error('Error fetching commission data:', error);
			}
		);
	}

	onPercentChange(item: any): void {
		this.validatePercentValue(item);
		this.calculateAmount(item);
	}

	calculateAmount(item: any): void {
		if (item.points && item.percentage) {
			item.amount = (item.points * item.percentage) / 100;
			item.amount = parseFloat(item.amount.toFixed(2));
		} else {
			item.amount = 0;
		}
	}

	validatePercentInput(event: KeyboardEvent): void {
		const allowedKeys = [
			'Backspace',
			'Delete',
			'Tab',
			'ArrowLeft',
			'ArrowRight',
			'Home',
			'End',
			'0',
			'1',
			'2',
			'3',
			'4',
			'5',
			'6',
			'7',
			'8',
			'9'
		];

		if (!allowedKeys.includes(event.key)) {
			event.preventDefault();
		}
	}

	validatePercentValue(item: any): void {
		const numValue = Number(item.percentage);
		const allowedValues = this.percentOpt.map((opt) => parseInt(opt.text)).filter((n) => !isNaN(n));

		if (!allowedValues.includes(numValue)) {
			const closest = allowedValues.reduce((prev, curr) =>
				Math.abs(curr - numValue) < Math.abs(prev - numValue) ? curr : prev
			);
			item.percentage = closest;
			this.calculateAmount(item);
		}
	}

	updateAllowedPercents(): void {
		this._allowedPercents = this.percentOpt.map((opt) => parseInt(opt.text, 10)).filter((n) => !isNaN(n));
	}

	private mapLevelsToTable(data: any[]): ITableCommissionType[] {
		const mappedData = data.map((item) => ({
			id: item.id,
			idSponsor: item.idSponsor,
			idSlave: item.idSlave,
			levelSponsor: item.levelSponsor ?? 0,
			amount: (item.amount ?? 0).toString(),
			percentage: item.percentage ?? 0,
			membership: item.packageName ?? '',
			createDate: this.formatDate(item.registerDate),
			registerDate: item.registerDate ?? [],
			period: this.getPeriodDescription(item.initialDatePeriod, item.endDatePeriod),
			username: item.username ?? '',
			name: item.name ?? '',
			lastname: item.lastname ?? '',
			fullnameSponsor: `${item.namesponsor ?? ''} ${item.lastnamesponsor ?? ''}`.trim(),
			idPeriod: item.idPeriod ?? 0,
			points: item.points ?? 0,
			exchangeRate: item.exchangeRate ?? 0,
			description: item.description ?? '',
			typeBonus: item.typeBonus ?? 0,
			isLevelQualified: item.isLevelQualified ?? false,
			isConditionQualified: item.isConditionQualified ?? false,
			commissionCase: item.commissionCase ?? '',
			idSuscription: item.idSuscription ?? 0,
			idStatus: item.idStatus ?? 0,
			insertDate: item.insertDate ?? [],
			idTransaction: item.idTransaction ?? '',
			type: item.type ?? '',
			paidStatus: item.paidStatus ?? 0,
			namesponsor: item.namesponsor ?? '',
			lastnamesponsor: item.lastnamesponsor ?? '',
			packageName: item.packageName ?? '',
			initialDatePeriod: item.initialDatePeriod ?? [],
			endDatePeriod: item.endDatePeriod ?? []
		}));

		return mappedData.sort((a, b) => a.levelSponsor - b.levelSponsor);
	}

	private formatDate(dateArray: number[]): string {
		if (!dateArray || dateArray.length < 3) return '';
		return `${dateArray[0]}-${(dateArray[1] + '').padStart(2, '0')}-${(dateArray[2] + '').padStart(
			2,
			'0'
		)}`;
	}

	private getPeriodDescription(start: number[], end: number[]): string {
		if (!start || !end) return '';
		return `${this.formatDate(start)} a ${this.formatDate(end)}`;
	}

	onSaveBonus() {
		if (!this.selectedRowId) return;
		const selectedItem = this.table.data.find((item) => item.id === this.selectedRowId);
		if (!selectedItem) return;
		this.showLoadingModal();
		const orig = this.originalValues[selectedItem.id];
		const percentageToSend =
			selectedItem.percentage !== null && selectedItem.percentage !== undefined
				? selectedItem.percentage
				: orig.percentage;

		const updateData = {
			id: selectedItem.id,
			idSponsor: selectedItem.idSponsor,
			idSlave: selectedItem.idSlave,
			levelSponsor: selectedItem.levelSponsor,
			registerDate: selectedItem.registerDate,
			exchangeRate: selectedItem.exchangeRate,
			typeBonus: selectedItem.typeBonus,
			amount: selectedItem.amount,
			isLevelQualified: selectedItem.isLevelQualified,
			isConditionQualified: selectedItem.isConditionQualified,
			commissionCase: selectedItem.commissionCase,
			idSuscription: selectedItem.idSuscription,
			idStatus: selectedItem.idStatus,
			percentage: percentageToSend,
			points: selectedItem.points,
			insertDate: selectedItem.insertDate,
			idTransaction: selectedItem.idTransaction,
			type: selectedItem.type,
			idPeriod: selectedItem.idPeriod,
			paidStatus: selectedItem.paidStatus,
			description: selectedItem.description,
			name: selectedItem.name || '',
			lastname: selectedItem.lastname || '',
			username: selectedItem.username || '',
			nameSponsor: selectedItem.namesponsor || '',
			lastNameSponsor: selectedItem.lastnamesponsor || '',
			packageName: selectedItem.packageName || '',
			initialDatePeriod: selectedItem.initialDatePeriod || [],
			endDatePeriod: selectedItem.endDatePeriod || []
		};

		this.commissionManagerService.updateUserMembershipBonus(updateData).subscribe({
			next: (response) => {
				this.hideLoadingModal();
				this.toastService.addToast('Bono actualizado correctamente.', 'success');
				if (this.selectedRowId) {
					delete this.originalValues[this.selectedRowId];
				}
				this.selectedRowId = null;
				// this.reloadBonusData();
				this.cdr.detectChanges();
			},
			error: (error) => {
				this.hideLoadingModal();
				this.toastService.addToast('Error al actualizar el bono', 'error');
				this.cdr.detectChanges();
				console.error('Error updating bonus:', error);
			}
		});
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
		this.router.navigate(['/dashboard/commission-manager/commission-type']);
	}
}
