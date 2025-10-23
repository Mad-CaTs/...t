import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ModalConfirmationCommissionComponent } from '@app/commission-manager/components';
import { CommissionManagerService } from '@app/commission-manager/services/commission-manager.service';
import { TableModel } from '@app/core/models/table.model';
import { TableService } from '@app/core/services/table.service';
import { ToastService } from '@app/core/services/toast.service';
import { ModalLoadingComponentManageBusiness } from '@app/manage-business/components/modals/modal-loading/modal-loading.component';
import { UserService } from '@app/users/services/user.service';
import { commissionAffiliationConstant } from '@constants/commission-affiliation.constant';
import { IListMembershipByIdUserRequest, ITableCommissionType } from '@interfaces/commissions.interface';
import { ISelectOpt } from '@interfaces/form-control.interface';
import {
	ICreateMembershipBonusRequest,
	IDataCommissionAffiliation
} from '@interfaces/wallet-transaction-type.interface';
import { NgbModal, NgbModalRef, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { TablesModule } from '@shared/components/tables/tables.module';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
	selector: 'app-commission-type',
	standalone: true,
	imports: [CommonModule, FormControlModule, FormsModule, TablesModule, NgbTooltipModule, RouterModule],
	templateUrl: './commission-type.component.html',
	styleUrls: ['./commission-type.component.scss']
})
export class CommissionTypeComponent {
	readonly table: TableModel<ITableCommissionType>;
	private loadingModalRef: NgbModalRef | null = null;
	private originalValues: {
		[key: number]: {
			percentage: number;
			amount: number;
			isLevelQualified: boolean;
			isConditionQualified: boolean;
		};
	} = {};
	public form: FormGroup;
	public formTable: FormGroup;
	public canGenerateCommission = false;
	public searchLoading: boolean = false;
	private fullMembershipData: IListMembershipByIdUserRequest[] = [];
	private _allowedPercents: number[] = [];
	get allowedPercents(): number[] {
		return this._allowedPercents;
	}

	buttonLoading: boolean = false;
	buttonGenerateLoading: boolean = false;
	selectedRowId: number | null = null;
	selectedUser: ISelectOpt | null = null;

	// Selects OPTS
	users: ISelectOpt[] = [];
	typeBonusOpt: ISelectOpt[] = [];
	percentOpt: ISelectOpt[] = [];
	membershipOpt: ISelectOpt[] = [];
	selectedType: string | number | null = null;
	@ViewChild('confirmModal') confirmModal!: TemplateRef<any>;

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

		this.table.data = [];

		this.form = formBuilder.group({
			userId: [null],
			typeBonus: [null],
			membership: [{ value: null, disabled: true }]
		});

		this.formTable = formBuilder.group({
			percentage: [null]
		});
	}

	ngOnInit(): void {
		const message = 'Ingresa el usuario del socio a buscar.';
		this.toastService.addToast(message, 'info');

		this.commissionManagerService.getWalletTransactionTypesAsOptions().subscribe(
			(typeCommission) => {
				this.typeBonusOpt = typeCommission;
				this.cdr.detectChanges();
			},
			(error) => {
				console.error('Error fetching states:', error);
			}
		);

		this.form.get('userId')?.valueChanges.subscribe((selectedUser: ISelectOpt) => {
			const membershipControl = this.form.get('membership');

			if (selectedUser?.id) {
				this.loadMembershipOptions(Number(selectedUser.id));
				if (this.canGenerateCommission) {
					membershipControl?.enable();
				} else {
					membershipControl?.disable();
				}
				membershipControl?.reset(null, { emitEvent: false });
			} else {
				membershipControl?.reset();
				membershipControl?.disable();
			}
		});
	}

	private reloadBonusData(): void {
		const formValues = this.form.value;
		const selectedBonus = formValues.typeBonus;
		let typeBonusIds: number[] = [];

		if (selectedBonus !== null && selectedBonus !== undefined) {
			typeBonusIds =
				selectedBonus == 3 ? [3, 7] : Array.isArray(selectedBonus) ? selectedBonus : [selectedBonus];
		}

		this.commissionManagerService
			.getListBonusByTypeBonus(typeBonusIds, formValues.userId.id, 10)
			.subscribe({
				next: (data) => {
					this.table.data = this.transformApiDataToTableFormat(data);
					this.cdr.detectChanges();
				},
				error: (error) => {
					console.error('Error al actualizar la tabla:', error);
				}
			});
	}

	private loadMembershipOptions(userId: number): void {
		this.commissionManagerService.getMembershipsByUserId(userId).subscribe({
			next: (memberships) => {
				this.fullMembershipData = memberships;
				const currentBonusId = this.form.get('typeBonus')?.value;

				if (currentBonusId) {
					this.onSelectCaseTypeWallet(currentBonusId);
				} else {
					this.membershipOpt = memberships.map((m) => ({
						id: m.idSuscription.toString(),
						text: m.nameSuscription
					}));
				}

				this.cdr.detectChanges();
			},
			error: (err) => {
				console.error('Error al obtener las membresías:', err);
				this.toastService.addToast('Error al cargar las membresías del usuario.', 'error');
			}
		});
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
			'9',
			'.'
		];

		if (!allowedKeys.includes(event.key)) {
			event.preventDefault();
		}
	}

	validatePercentValue(item: any): void {
		const numValue = Number(item.percentage);
		let allowedValues = this.percentOpt.map((opt) => parseFloat(opt.text)).filter((n) => !isNaN(n));

		if (item.levelSponsor === 1 && !allowedValues.includes(60)) {
			allowedValues.push(60);
		}

		if (!allowedValues.includes(numValue)) {
			const closest = allowedValues.reduce((prev, curr) =>
				Math.abs(curr - numValue) < Math.abs(prev - numValue) ? curr : prev
			);
			item.percentage = closest;
			this.calculateAmount(item);
		}
	}

	updateAllowedPercents(): void {
		this._allowedPercents = this.percentOpt.map((opt) => parseFloat(opt.text)).filter((n) => !isNaN(n));
	}

	onTypeBonusChange(selectedValue: any): void {
		this.selectedType = selectedValue;
		const membershipControl = this.form.get('membership');
		membershipControl?.disable({ emitEvent: false });
		membershipControl?.reset(null, { emitEvent: false });

		this.onSelectCaseTypeWallet(selectedValue);
	}

	onSelectCaseTypeWallet(selectedValue: any): void {
		const membershipControl = this.form.get('membership');

		if (!selectedValue) {
			this.percentOpt = [];
			this.membershipOpt = [];
			membershipControl?.reset(null, { emitEvent: false });
			membershipControl?.disable({ emitEvent: false });
			this.cdr.detectChanges();
			return;
		}

		const bonusId = Number(selectedValue);

		const bonusConfig: Record<
			number,
			{ idx: number; filter: (m: IListMembershipByIdUserRequest) => boolean }
		> = {
			3: { idx: 0, filter: (m) => m.typeCommision === 1 && m.isMigrated === 0 },
			7: { idx: 0, filter: (m) => m.typeCommision === 1 && m.isMigrated === 0 },
			22: { idx: 1, filter: (m) => m.typeCommision === 2 && m.isMigrated === 0 },
			29: { idx: 2, filter: (m) => m.typeCommision === 4 && m.isMigrated === 0 },
			23: { idx: 2, filter: (m) => m.isMigrated === 1 }
		};

		const config = bonusConfig[bonusId];
		if (!config) {
			this.percentOpt = [];
			this.membershipOpt = [];
			membershipControl?.reset(null, { emitEvent: false });
			membershipControl?.disable({ emitEvent: false });
			this.cdr.detectChanges();
			return;
		}

		const typeId = commissionAffiliationConstant[config.idx].typeId;
		this.handlePercentCommission(typeId);

		const filtered = this.fullMembershipData.filter(config.filter);

		if (filtered.length === 0) {
			this.membershipOpt = [{ id: '', text: 'No hay membresías para el tipo de bono seleccionado' }];
			membershipControl?.reset(null, { emitEvent: false });
			membershipControl?.disable({ emitEvent: false });
		} else {
			this.membershipOpt = filtered.map((m) => ({
				id: m.idSuscription.toString(),
				text: m.nameSuscription
			}));
			if (this.canGenerateCommission) {
				membershipControl?.enable({ emitEvent: false });
			} else {
				membershipControl?.disable({ emitEvent: false });
			}
			membershipControl?.reset(null, { emitEvent: false });
		}

		this.cdr.detectChanges();
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
		const formValues = this.form.value;
		this.showLoadingModal();
		const selectedBonus = formValues.typeBonus;
		let typeBonusIds: number[] = [];

		if (selectedBonus !== null && selectedBonus !== undefined) {
			if (selectedBonus == 3) {
				typeBonusIds = [3, 7];
			} else {
				typeBonusIds = Array.isArray(selectedBonus) ? selectedBonus : [selectedBonus];
			}
		}

		this.commissionManagerService
			.getListBonusByTypeBonus(typeBonusIds, formValues.userId.id, 10)
			.subscribe({
				next: (data) => {
					this.table.data = this.transformApiDataToTableFormat(data);
					this.canGenerateCommission = this.table.data.length === 0;

					const membershipControl = this.form.get('membership');
					if (this.canGenerateCommission) {
						membershipControl?.enable();
						this.toastService.addToast('Genera sus comisiones en el sistema.', 'info');
					} else if (formValues.userId?.id) {
						membershipControl?.disable();
					}
					this.buttonLoading = false;
					this.hideLoadingModal();
					this.cdr.detectChanges();
				},
				error: (error) => {
					this.buttonLoading = false;
					this.hideLoadingModal();
					this.cdr.detectChanges();
					console.error('Error al buscar bonos:', error);
				}
			});
	}

	private transformApiDataToTableFormat(apiData: any[]): ITableCommissionType[] {
		const mappedData = apiData.map((item) => ({
			id: item.id,
			idSponsor: item.idSponsor,
			idSlave: item.idSlave,
			levelSponsor: item.levelSponsor ?? 0,
			amount: item.amount?.toString() || '0',
			percentage: item.percentage || 0,
			description: item.description,
			typeBonus: item.typeBonus,
			membership: item.packageName || '',
			createDate: this.formatDate(item.registerDate),
			insertDate: item.insertDate,
			period: this.getPeriodDescription(item.initialDatePeriod, item.endDatePeriod),
			username: item.username || '',
			name: item.name || '',
			lastname: item.lastname || '',
			idPeriod: item.idPeriod || 0,
			points: item.points || 0,
			isLevelQualified: item.isLevelQualified,
			isConditionQualified: item.isConditionQualified,
			commissionCase: item.commissionCase || '',
			idSuscription: item.idSuscription,
			idStatus: item.idStatus,
			registerDate: item.registerDate,
			idTransaction: item.idTransaction || '',
			type: item.type || '',
			paidStatus: item.paidStatus,
			exchangeRate: item.exchangeRate,
			namesponsor: item.namesponsor || '',
			lastnamesponsor: item.lastnamesponsor || '',
			fullnameSponsor: `${item.namesponsor} ${item.lastnamesponsor}`.trim(),
			packageName: item.packageName || '',
			initialDatePeriod: item.initialDatePeriod || [],
			endDatePeriod: item.endDatePeriod || []
		}));

		return mappedData.sort((a, b) => a.levelSponsor - b.levelSponsor);
	}

	private formatDate(dateArray: number[]): string {
		if (!dateArray || dateArray.length < 5) return '';
		return `${dateArray[0]}-${dateArray[1].toString().padStart(2, '0')}-${dateArray[2]
			.toString()
			.padStart(2, '0')}`;
	}

	private getPeriodDescription(start: number[], end: number[]): string {
		if (!start || !end) return '';
		return `${this.formatDate(start)} a ${this.formatDate(end)}`;
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

	onRowSelect(item: any): void {
		if (this.selectedRowId !== null && this.selectedRowId !== item.id) {
			const prev = this.table.data.find((i) => i.id === this.selectedRowId);
			const orig = this.originalValues[this.selectedRowId!];

			if (prev && orig) {
				prev.percentage = orig.percentage;
				prev.amount = orig.amount;
				prev.isLevelQualified = orig.isLevelQualified;
				prev.isConditionQualified = orig.isConditionQualified;
			}
		}

		this.selectedRowId = item.id;

		if (!this.originalValues[item.id]) {
			this.originalValues[item.id] = {
				percentage: item.percentage,
				amount: item.amount,
				isLevelQualified: item.isLevelQualified,
				isConditionQualified: item.isConditionQualified
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
			item.percentage = parseFloat(this.percentOpt[0].text);
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

	onGenerateCommission(): void {
		const { userId, typeBonus, membership } = this.form.value;

		if (!membership) {
			this.toastService.addToast('Selecciona una membresía antes de continuar.', 'warning');
			return;
		}

		const raw = typeBonus;
		const selectedBonusId = typeof raw === 'object' ? Number(raw.id) : Number(raw);
		let typeBonusIds: number[];
		if (selectedBonusId === 3) {
			typeBonusIds = [3, 7];
		} else if (Array.isArray(typeBonus)) {
			typeBonusIds = typeBonus.map((tb) => (typeof tb === 'object' ? Number(tb.id) : Number(tb)));
		} else {
			typeBonusIds = [selectedBonusId];
		}
		console.log('typeBonusIds →', typeBonusIds);

		const membershipData =
			typeof membership === 'object'
				? { id: membership.id, name: membership.text }
				: {
						id: String(membership),
						name: this.membershipOpt.find((o) => o.id === String(membership))?.text || ''
				  };

		const fullMembership = this.fullMembershipData.find(
			(m) => String(m.idSuscription) === membershipData.id
		);
		if (!fullMembership) {
			this.toastService.addToast('No se encontró la información de la membresía.', 'error');
			return;
		}
		console.log('fullMembership', fullMembership);

		const d = fullMembership.creationDate;
		console.log('d', d);

		const pad2 = (n: number) => n.toString().padStart(2, '0');
		const pad3 = (n: number) => n.toString().padStart(3, '0');
		const createDateStr =
			`${d[0]}-${pad2(d[1])}-${pad2(d[2])}` +
			`T${pad2(d[3] || 0)}:${pad2(d[4] || 0)}:${pad2(d[5] || 0)}.${pad3(d[6] || 0)}`;

		const modalRef = this.modalService.open(ModalConfirmationCommissionComponent, { centered: true });
		modalRef.componentInstance.title = '¿Estás seguro de guardar?';
		modalRef.componentInstance.message =
			'La modificación se verá reflejada en el periodo más próximo a pagar.';
		modalRef.componentInstance.confirmButtonText = 'Sí, guardar';

		modalRef.componentInstance.confirmAction.subscribe(() => {
			this.showLoadingModal();

			const { typeCommision: typeCommission, isMigrated } = fullMembership;

			this.commissionManagerService
				.getLevelsAndCommissionsPanelAdmin(
					Number(userId.id),
					Number(membershipData.id),
					typeCommission,
					typeBonusIds,
					createDateStr,
					true
				)
				.subscribe({
					next: (levelsData) => {
						this.hideLoadingModal();
						this.router.navigate(['generate-commission'], {
							relativeTo: this.route,
							state: {
								user: { id: userId.id, name: userId.text },
								typeBonus: {
									id: typeBonus,
									text: this.typeBonusOpt.find((o) => o.id === typeBonus)?.text || ''
								},
								membership: membershipData,
								typeCommission,
								isMigrated,
								levelsData
							}
						});
					},
					error: (err) => {
						this.hideLoadingModal();
						this.toastService.addToast('Error al obtener niveles y comisiones.', 'error');
						console.error(err);
					}
				});
		});
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
				this.cdr.detectChanges();
				console.error('Error updating bonus:', error);
			}
		});
	}

	confirmEditPeriodTrue() {
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
				this.reloadBonusData();
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

	confirmEditPeriodFalse() {
		const selectedItem = this.table.data.find((item) => item.id === this.selectedRowId);
		if (!selectedItem) return;

		this.showLoadingModal();
		const orig = this.originalValues[selectedItem.id];
		const percentageToSend = selectedItem.percentage != null ? selectedItem.percentage : orig.percentage;
		const diffPercentage = percentageToSend - orig.percentage;
		const percentageField = diffPercentage !== 0 ? diffPercentage : percentageToSend;
		const amountToSend = diffPercentage !== 0 ? selectedItem.amount - orig.amount : selectedItem.amount;

		const createCommission: ICreateMembershipBonusRequest = {
			idSponsor: selectedItem.idSponsor,
			idSlave: selectedItem.idSlave,
			levelSponsor: selectedItem.levelSponsor,
			registerDate: selectedItem.registerDate,
			exchangeRate: selectedItem.exchangeRate,
			typeBonus: selectedItem.typeBonus,
			amount: amountToSend,
			isLevelQualified: selectedItem.isLevelQualified,
			isConditionQualified: selectedItem.isConditionQualified,
			commissionCase: selectedItem.commissionCase,
			idSuscription: selectedItem.idSuscription,
			idStatus: selectedItem.idStatus,
			percentage: percentageField,
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

		this.commissionManagerService.postUserMembershipBonus(createCommission).subscribe({
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
				this.reloadBonusData();
				this.cdr.detectChanges();
			},
			error: (error) => {
				this.hideLoadingModal();
				this.toastService.addToast('Error al actualizar el bono', 'error');
				console.error('Error updating bonus:', error);
				this.cdr.detectChanges();
			}
		});
	}
}
