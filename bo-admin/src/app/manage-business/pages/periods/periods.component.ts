import { ChangeDetectorRef, Component } from '@angular/core';

import { TableService } from '@app/core/services/table.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

/* === Modules === */
import { CommonModule } from '@angular/common';
import { TablesModule } from '@shared/components/tables/tables.module';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { TableModel } from '@app/core/models/table.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalNewPeriodComponent } from '@app/manage-business/components/modals/modal-new-period/modal-new-period.component';
import { PeriodService } from '../../services/period-service.service';
import { ArrayDatePipe } from '@shared/pipes/array-date.pipe';
import { getCokkie } from '@utils/cokkies';
import { ModalPeriodsEditComponent } from '@app/manage-business/components/modals/modal-periods-edit/modal-periods-edit.component';
import { TreePointServiceService } from '@app/manage-business/services/tree-point-service.service';
import { interval, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ModalSecurityConfirmComponent } from '@app/manage-business/components/modals/modal-security-confirm/modal-security-confirm.component';
import { ITablePeriod } from '@interfaces/period';

@Component({
	selector: 'app-periods',
	standalone: true,
	imports: [CommonModule, TablesModule, InlineSVGModule, FormControlModule, ReactiveFormsModule, ArrayDatePipe],
	templateUrl: './periods.component.html',
	styleUrls: ['./periods.component.scss']
})
export class PeriodsComponent {
	readonly form: FormGroup;
	public readonly table: TableModel<ITablePeriod>;
	loading: boolean = false;
	loadingButtonDeactiveState: { [key: number]: boolean } = {};
	loadingButtonActivateState: { [key: number]: boolean } = {};
	loadingButtonPayBonus: { [key: number]: boolean } = {};
	totalRecords: number = 0;
	row: number = 10;
	initialPage: number = 1;
	refresh: boolean = false;
	private pollingSubscription: Subscription | undefined;

	constructor(private tableService: TableService, public modal: NgbModal, private builder: FormBuilder,
		private periodService: PeriodService, private treePointService: TreePointServiceService, private cdr: ChangeDetectorRef
	) {
		this.table = this.tableService.generateTable<ITablePeriod>({
			headers: [
				'Fecha de Inicio',
				'Fecha de Fin',
				'Fecha de Pago',
				'Estado',
				'Acciones',
				'Calcular rangos'
			],
			noCheckBoxes: true,
		});

		this.loadDataPeriod(this.initialPage, this.row);
	}

	ngOnInit(): void {
		this.startPolling();
	}

	ngOnDestroy(): void {
		this.stopPolling();
	}

	startPolling(): void {
		this.pollingSubscription = interval(300)
			.pipe(switchMap(() => this.periodService.getPeriods((this.initialPage - 1), this.row)))
			.subscribe({
				next: response => {
					this.table.data = response.data;
					this.totalRecords = response.total;
					this.loading = false;
					this.cdr.detectChanges();
					const hasActiveTransactions = this.table.data.some(item => item.isActive === 2);
					if (!hasActiveTransactions) {
						this.stopPolling();
					}
				},
				error: err => {
					console.error('Error loading data during polling', err);
					this.loading = false;
				}
			});
	}

	stopPolling(): void {
		if (this.pollingSubscription) {
			this.pollingSubscription.unsubscribe();
			this.pollingSubscription = undefined;
		}
	}

	showActionColumn(): boolean {
		return this.table.data.some(
			item => item.isActive === 1 && !this.isPastDate(item.initialDate) || !this.isPastDate(item.initialDate) || this.isToday(item.initialDate)
		);
	}

	loadDataPeriod(page: number, rows: number): void {
		this.loading = true;
		const offset = (page - 1);
		this.periodService.getPeriods(offset, rows).subscribe({
			next: (response) => {
				this.table.data = response.data;
				this.totalRecords = response.total;
				this.loading = false;
				this.cdr.detectChanges();
			},
			error: (err) => {
				console.error(err);
				this.loading = false;
			}
		});
	}

	isPastDate(dateArray: number[]): boolean {
		const [year, month, day, hour = 0, minute = 0] = dateArray;
		const itemDate = new Date(
			new Date(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00`).toLocaleString("en-US", {
				timeZone: "America/Lima"
			})
		);
		const limaToday = new Date(
			new Date().toLocaleString("en-US", { timeZone: "America/Lima" })
		);
		itemDate.setHours(0, 0, 0, 0);
		limaToday.setHours(0, 0, 0, 0);
		return itemDate < limaToday;
	}

	isFutureDate(dateArray: number[]): boolean {
		const [year, month, day, hour = 0, minute = 0] = dateArray;
		const itemDate = new Date(
			new Date(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00`).toLocaleString("en-US", {
				timeZone: "America/Lima"
			})
		);
		const limaToday = new Date(
			new Date().toLocaleString("en-US", { timeZone: "America/Lima" })
		);
		itemDate.setHours(0, 0, 0, 0);
		limaToday.setHours(0, 0, 0, 0);
		return itemDate > limaToday;
	}


	isToday(dateArray: number[]): boolean {
		const [year, month, day] = dateArray;
		const nowInLima = new Date();
		const limaToday = new Intl.DateTimeFormat('en-US', {
			timeZone: 'America/Lima',
			year: 'numeric',
			month: '2-digit',
			day: '2-digit'
		}).formatToParts(nowInLima);
		const limaYear = parseInt(limaToday.find(part => part.type === 'year')?.value ?? '');
		const limaMonth = parseInt(limaToday.find(part => part.type === 'month')?.value ?? '');
		const limaDay = parseInt(limaToday.find(part => part.type === 'day')?.value ?? '');
		return year === limaYear && month === limaMonth && day === limaDay;
	}


	/* === Events === */

	deactivate(id: number) {
		this.loadingButtonDeactiveState[id] = true;
		let username = getCokkie('USERNAME') ?? 'master';
		this.periodService.deactivatePeriod(id, username).subscribe({
			next: (data) => {
				this.loadingButtonDeactiveState[id] = false;
				this.loadDataPeriod(1, this.row);
			},
			error: () => {
				alert('Error al desactivar, intente de nuevo.');
				this.loadingButtonDeactiveState[id] = false;
			}
		});
	}

	activate(data: any) {
		this.loadingButtonActivateState[data.id] = true;
		let username = getCokkie('USERNAME') ?? 'master';
		data.isActive = 2;
		this.periodService.updatePeriod(data, username).subscribe({
			next: (response) => {
				this.loadingButtonDeactiveState[data.id] = false;
				this.treePointService.getAllThreePointsById(data.id).subscribe({
					next: () => {
						console.log("Paso");
					}, error: () => {
						console.log("Error");
					}
				});
			},
			error: () => {
				alert('Error al desactivar, intente de nuevo.');
				this.loadingButtonDeactiveState[data.id] = false;
			}
		});
	}

	payBonus(data: any): void {
		const username = getCokkie('USERNAME') ?? 'master';
		const isTodayPayDate = this.isToday(data.payDate);

		const handleUpdatePeriod = () => {
			data.status = 2;
			this.periodService.updatePeriod(data, username).subscribe({
				next: () => {
					this.startPolling();
					this.loadingButtonPayBonus[data.id] = false;
				},
				error: () => {
					alert('Error al pagar bonus, contáctese.');
					this.loadingButtonPayBonus[data.id] = false;
				}
			});
		};

		const handlePayBonus = () => {
			this.treePointService.payBonus(data.id).subscribe({
				next: () => handleUpdatePeriod(),
				error: () => {
					alert('Error al ejecutar el pago del bonus.');
					this.loadingButtonPayBonus[data.id] = false;
				}
			});
		};

		this.loadingButtonPayBonus[data.id] = true;

		if (!isTodayPayDate) {
			const modalRef = this.modal.open(ModalSecurityConfirmComponent, {
				centered: true,
				ariaLabelledBy: 'modal-title',
				ariaDescribedBy: 'modal-description',
			});
			modalRef.componentInstance.payDate = data.payDate;

			modalRef.result.then(
				(confirmed) => {
					if (confirmed) handlePayBonus();
					else this.loadingButtonPayBonus[data.id] = false;
				},
				() => {
					this.loadingButtonPayBonus[data.id] = false;
				}
			);
		} else {
			handlePayBonus();
		}
	}


	onPageChange(event: any) {
		this.initialPage = event;
		this.loadDataPeriod(event, this.row);
	}

	onModify(data: any) {
		const modalRefSecurity = this.modal.open(ModalSecurityConfirmComponent, {
			centered: true,
			ariaLabelledBy: 'modal-title',
			ariaDescribedBy: 'modal-description',
		});
		modalRefSecurity.componentInstance.title = 'Editar Periodo';
		modalRefSecurity.result.then(
			(result) => {
				if (result) {
					const modalRef = this.modal.open(ModalPeriodsEditComponent, {
						centered: true,
						ariaLabelledBy: 'modal-title',
						ariaDescribedBy: 'modal-description',
					});
					modalRef.componentInstance.data = data;
					modalRef.result.then(
						() => {
							this.loadDataPeriod(this.initialPage, this.row);
						},
						() => {
						}
					);
				}
			},
			() => {
			}
		);

	}
}
