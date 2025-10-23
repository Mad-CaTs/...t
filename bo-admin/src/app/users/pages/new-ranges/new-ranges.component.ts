import { ChangeDetectorRef, Component } from '@angular/core';

import { tableDataMock } from './mock';

import type { ITableNewRanges, ITableReportNewRanges } from '@interfaces/users.interface';

import { TableModel } from '@app/core/models/table.model';

import { TableService } from '@app/core/services/table.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

/* === Modules === */
import { CommonModule } from '@angular/common';
import { TablesModule } from '@shared/components/tables/tables.module';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PeriodService } from '@app/manage-business/services/period-service.service';
import { catchError, switchMap } from 'rxjs/operators';
import { interval, Observable, of, Subscription } from 'rxjs';
import { ArrayDatePipe } from '@shared/pipes/array-date.pipe';
import { SelectMultipleDropdownComponent } from '@shared/components/form-control/select-multiple/select-multiple-dropdown/select-multiple-dropdown.component';
import { ISelectOpt } from '@interfaces/form-control.interface';
import { ModalConfirmationComponent } from '@shared/components/modal-confirmation/modal-confirmation.component';
import { ModalLoadingComponentManageBusiness } from '@app/manage-business/components/modals/modal-loading/modal-loading.component';

@Component({
	selector: 'app-new-ranges',
	standalone: true,
	imports: [
		CommonModule,
		TablesModule,
		InlineSVGModule,
		FormControlModule,
		ReactiveFormsModule,
		ArrayDatePipe
	],
	providers: [ArrayDatePipe],
	templateUrl: './new-ranges.component.html',
	styleUrls: ['./new-ranges.component.scss']
})
export class NewRangesComponent {
	public readonly table: TableModel<ITableReportNewRanges>;
	loading: boolean = false;
	public form: FormGroup;
	totalRecords: number = 0;
	row: number = 10;
	private allPeriods: any[] = [];
	refresh: boolean = false;
	private pollingSubscription: Subscription | undefined;
	initialPage: number = 1;
	public selectedId: number | null = null;
	selectedTypeId: string = '';
	public exportForm: FormGroup;
	noDataFound: boolean = false;
	private loadingModalRef: any;
	periodId: number;
	fechaInitPerid: any;
	/* 	typesOpt: any[] = [];
	 */ fechacOpt: any[] = [];

	responseData: any[] = [];

	public exportOptions: ISelectOpt[] = [
		{ id: '1', text: 'Compuesto' },
		{ id: '2', text: 'Residual' }
	];
	isLoading: boolean = false;
	constructor(
		private tableService: TableService,
		private modalService: NgbModal,
		private builder: FormBuilder,
		private periodService: PeriodService,
		private cdr: ChangeDetectorRef,
		private arrayDatePipe: ArrayDatePipe
	) {
		this.table = this.tableService.generateTable<ITableReportNewRanges>({
			headers: ['N°', 'Nombre', 'Apellido', 'Telefono', 'Rango', 'Estado'],
			noCheckBoxes: false
		});
		this.form = builder.group({
			cicles: [''],
			type: ['']
		});
		this.exportForm = builder.group({ exportType: [''] });
	}

	ngOnInit(): void {
		this.getPeriods();

		this.form.get('cicles')?.valueChanges.subscribe((value) => {
			if (value) {
				this.onPeriodChange();
			}
		});
	}

	onSelectChange(selectedId: string): void {
		if (!selectedId) return;

		const selectedPeriod = this.fechacOpt.find((period) => period.id.toString() === selectedId);

		if (selectedPeriod) {
			this.fechaInitPerid = selectedPeriod.initialDate;

			this.form.get('cicles')?.setValue(selectedPeriod.id);
		} else {
			console.warn('⚠️ No se encontró el período seleccionado.');
		}
	}

	ngOnDestroy(): void {
		this.getPeriods();
	}

	getPeriods(): void {
		this.periodService.getFechaPeriods().subscribe({
			next: (response) => {
				this.responseData = response.data;

				this.responseData.sort((a, b) => b.id - a.id); 

				this.fechacOpt = this.responseData.map((period) => {
					const label = `${this.arrayDatePipe.transform(
						period.initialDate
					)} Al ${this.arrayDatePipe.transform(period.endDate)}`;

					return {
						id: period.id.toString(),
						text: label,
						initialDate: period.initialDate
					};
				});

				this.cdr.detectChanges();
			},
			error: (err) => {
				console.error('❌ Error al obtener los datos:', err);
			}
		});
	}

	stopPolling(): void {
		if (this.pollingSubscription) {
			this.pollingSubscription.unsubscribe();
			this.pollingSubscription = undefined;
		}
	}

	onPageChange(event: any) {}

	changeCheckId(id: number): void {
		this.selectedId = id;
		this.table.data.forEach((item) => (item.isChecked = item.id === this.selectedId));
		this.cdr.detectChanges();
	}

	getChecked(id: number): boolean {
		return this.table.data.some((item) => item.id === id && item.isChecked);
	}

	isButtonEnabled(): boolean {
		return this.table.data.some((item) => item.isChecked);
	}

	onPeriodChange(): void {
		const selectedCicleId = this.form.get('cicles')?.value;

		if (!selectedCicleId) {
			console.warn('⚠️ No hay un ciclo seleccionado.');
			return;
		}

		const selectedPeriod = this.fechacOpt.find((opt) => opt.id === selectedCicleId);

		if (selectedPeriod && selectedPeriod.text) {
			const match = selectedPeriod.text.match(/^(\d{2})-(\d{2})-(\d{4})/);
			const firstDate = match ? `${match[3]}-${match[2]}-${match[1]}` : null;

			if (!firstDate) {
				console.warn('⚠️ No se pudo obtener la fecha correctamente.');
				return;
			}

			this.periodService.getPeriodIdByDate(firstDate).subscribe((response) => {
				this.periodId = response?.data?.id || null;

				if (!this.periodId) {
					console.warn('⚠️ No se encontró un período válido.');
					return;
				}

				const selectedType = this.form.get('type')?.value;

				if (!selectedType) {
					console.warn('⚠️ Por favor, selecciona un tipo antes de cambiar el período.');
					return;
				}

				if (selectedType === '1') {
					this.getCompuestoData();
				} else if (selectedType === '2') {
					this.getResidualData();
				}
			});
		}
	}

	formatDateFromCicles(dia: number, mes: number, anio: number): string {
		if (!dia || !mes || !anio) return '';

		const formattedMonth = mes.toString().padStart(2, '0');
		const formattedDay = dia.toString().padStart(2, '0');

		return `${anio}-${formattedMonth}-${formattedDay}`;
	}

	onOptionChange(event: Event): void {
		const selectedValue = (event.target as HTMLSelectElement).value;

		if (!this.periodId) {
			console.error('No ID selected');
			return;
		}

		if (selectedValue) {
			this.exportData(selectedValue, this.periodId);
		}
	}

	exportData(type: string, periodId: number): void {
		if (!periodId) {
			console.error('No ID selected');
			this.showErrorModal('No se ha seleccionado un ID válido');
			return;
		}

		this.showLoadingModal();
		const resetExportForm = () => {
			this.exportForm.reset();
			this.cdr.detectChanges();
		};

		const exportMethods: { [key: string]: (id: number) => Observable<Blob> } = {
			compuesto: this.periodService.exportCompoundData.bind(this.periodService),
			residual: this.periodService.exportResidualData.bind(this.periodService),
			compuestos: this.periodService.exportHistoricCompoundData.bind(this.periodService),
			residuals: this.periodService.exportHistoricResidualData.bind(this.periodService)
		};

		if (!exportMethods[type]) {
			console.error('Tipo de exportación no válido');
			this.closeLoadingModal();
			this.showErrorModal('Tipo de exportación no válido');
			resetExportForm();
			return;
		}

		exportMethods[type](periodId).subscribe(
			(blob) => {
				this.downloadFile(blob, type, periodId);
				this.closeLoadingModal();
				this.showSuccessModal();
				resetExportForm();
			},
			(error) => {
				console.error(`Error exporting ${type} data:`, error);
				this.closeLoadingModal();
				this.showErrorModal(`Error al exportar los datos de tipo ${type}`);
				resetExportForm();
			}
		);
	}

	private downloadFile(blob: Blob, type: string, periodId: number): void {
		const a = document.createElement('a');
		const downloadUrl = window.URL.createObjectURL(blob);
		a.href = downloadUrl;
		a.download = `export-${type}-${periodId}.xlsx`;
		a.click();
		window.URL.revokeObjectURL(downloadUrl);
	}

	private showSuccessModal(): void {
		const modalRef = this.modalService.open(ModalConfirmationComponent);
		modalRef.componentInstance.title = 'Éxito';
		modalRef.componentInstance.icon = 'bi bi-check-circle';
		modalRef.componentInstance.body = 'La Data se exporto correctamente';
		modalRef.componentInstance.buttons = [
			{
				text: 'Cerrar',
				className: 'btn btn-primary',
				onClick: () => modalRef.close()
			}
		];
	}

	private showErrorModal(errorMessage: string): void {
		const modalRef = this.modalService.open(ModalConfirmationComponent);
		modalRef.componentInstance.title = 'Error';
		modalRef.componentInstance.icon = 'bi bi-exclamation-circle';
		modalRef.componentInstance.body = errorMessage;
		modalRef.componentInstance.buttons = [
			{
				text: 'Cerrar',
				className: 'btn btn-danger',
				onClick: () => modalRef.close()
			}
		];
	}

	isFutureDate(initialDate: string | number[] | null): boolean {
		if (!initialDate) {
			return false;
		}
		let parsedDate: Date;

		if (Array.isArray(initialDate)) {
			const [year, month, day] = initialDate;
			parsedDate = new Date(year, month - 1, day);
		} else if (typeof initialDate === 'string') {
			const [day, month, year] = initialDate.split('-').map(Number);
			parsedDate = new Date(year, month - 1, day);
		} else {
			console.error('Tipo de fecha no manejado:', initialDate);
			return false;
		}

		const today = new Date();
		today.setHours(0, 0, 0, 0);
		return parsedDate > today;
	}

	onTypeChange(event: any): void {
		if (!this.periodId) {
			console.warn('⚠️ Primero debes seleccionar un período');
			return;
		}
		const selectedType = this.form.get('type')?.value;
		if (!selectedType) {
			console.warn('⚠️ Por favor, selecciona un tipo');
			return;
		}
		this.selectedTypeId = selectedType;
		if (this.selectedTypeId === '1') {
			this.loading = true;
			this.getCompuestoData();
		} else if (this.selectedTypeId === '2') {
			this.loading = true;
			this.getResidualData();
		}
	}

	getCompuestoData(): void {
		this.loading = true;
		this.periodService.getCompuestoData(this.periodId).subscribe({
			next: (response) => {
				if (response && response.data && response.data.length > 0) {
					this.table.data = [...response.data];
					this.noDataFound = false;
				} else {
					console.warn('No se encontraron datos con los filtros aplicados.');
					this.noDataFound = true;
					this.table.data = [];
				}
			},
			error: (error) => {
				console.error('Error al obtener los datos:', error);
				this.noDataFound = true;
				this.table.data = [];
			},
			complete: () => {
				this.loading = false;
				this.cdr.detectChanges();
			}
		});
	}

	getResidualData(): void {
		this.loading = true;

		this.periodService.getResidualData(this.periodId).subscribe({
			next: (response) => {
				if (response && response.data && response.data.length > 0) {
					this.table.data = [...response.data];
					this.noDataFound = false;
				} else {
					console.warn('No se encontraron datos con los filtros aplicados.');
					this.noDataFound = true;
					this.table.data = [];
				}
			},
			error: (error) => {
				console.error('Error al obtener los datos:', error);
				this.noDataFound = true;
				this.table.data = [];
			},
			complete: () => {
				this.loading = false;
				this.cdr.detectChanges();
			}
		});
	}

	resetSearch(): void {
		this.form.reset();
	}

	private showLoadingModal(): void {
		this.loadingModalRef = this.modalService.open(ModalLoadingComponentManageBusiness, {
			centered: true,
			size: 'sm'
		});
	}

	private closeLoadingModal(): void {
		if (this.loadingModalRef) {
			this.loadingModalRef.close();
			this.loadingModalRef = null;
		}
	}

	typesOpt: ISelectOpt[] = [
		{ id: '1', text: 'Compuesto' },
		{ id: '2', text: 'Residual' }
	];
}
