import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SocioAssignmentComponent } from './socio-assignment/socio-assignment.component';

import { FilterGenericComponent, FilterGenericConfig, FilterExtraButton } from '@shared/components/filters/filter-generic/filter-generic.component';
import { TableGenericComponent } from '@shared/components/tables/table-generic/table-generic.component';
import { TablePaginatorComponent } from '@shared/components/tables/table-paginator/table-paginator.component';
import { EmptyStateComponent } from '@app/event/components/shared/empty-state/empty-state.component';
import { ModalNotifyComponent } from '@shared/components/modals/modal-notify/modal-notify.component';
import { CarScheduleModalComponent, ScheduleInitialData, SchedulePayload } from '@app/manage-prize/components/modals/bonus-type/bonus-card/car-schedule-modal/car-schedule-modal.component';
import { Router } from '@angular/router';

import { CarAssignmentService } from '@app/manage-prize/services/bonus-type/bonus-car/car-assignment.service';
import { ICarBonusSearchParams } from '@app/manage-prize/interface/car-bonus-search-params';
import { ICarAssignment } from '@app/manage-prize/interface/car-assignment';
import { Console } from 'console';
import { ICarBonusAmounts } from '@app/manage-prize/interface/car-bonus-amounts';
import { LogoSpinnerComponent } from '@shared/components/logo-spinner/logo-spinner.component';
import { CarModel } from '@app/manage-prize/models/bonus-type/bonus-car/create-car/car-model.model';


@Component({
  selector: 'app-car-assignment',
  standalone: true,
  imports: [CommonModule, FilterGenericComponent, TableGenericComponent,
    TablePaginatorComponent, EmptyStateComponent,
    CarScheduleModalComponent,
    ModalNotifyComponent, LogoSpinnerComponent],
  templateUrl: './car-assignment.component.html',
  styleUrls: ['./car-assignment.component.scss']
})
export class CarAssignmentComponent implements OnInit {
  private allRows: ICarAssignment[] = [];
  private filteredRows: ICarAssignment[] = [];
  private carAssingnmetId: string;
  private carModel: CarModel[];
  loading = true;
  constructor(
    private router: Router,
    private _carAssignmentService: CarAssignmentService,
    private cdr: ChangeDetectorRef
  ) { }

  genericFilters: FilterGenericConfig[] = [
    { type: 'search', key: 'query', label: 'Buscador', order: 1 },
    { type: 'select', key: 'model', label: 'Modelo de carro', order: 2, options: [] },
    { type: 'date', key: 'startDate', label: 'Fecha de inicio', order: 3 },
    { type: 'date', key: 'endDate', label: 'Fecha de límite', order: 4 },
  ];

  filterValues: Record<string, any> = {
    query: '',
    model: '',
    startDate: '',
    endDate: ''
  };

  extraButtons: FilterExtraButton[] = [
    { key: 'export', label: 'Exportar', variant: 'secondary', iconClass: 'bi bi-download' }
  ];

  ngOnInit(): void {
    this.getCarAssignment();
    const modelFilter = this.genericFilters.find(f => f.key === 'model' && f.type === 'select') as any;
    if (modelFilter) {
      const uniqueModels = Array.from(new Set((this.allRows || []).map(r => r.modelName))).sort();
      modelFilter.options = uniqueModels.map(v => ({ label: v, value: v }));
    }
    this.getCarModels();
  }

  getCarAssignment() {
    this.loading = true;
    this._carAssignmentService.searchCarAssignment(this.convertDataRequest()).subscribe({
      next: (res) => {
        this.allRows = res.data.content.map((item: ICarAssignment) => {
          item.modelName = `${item.modelName} / ${item.brandName}`;
          return item;
        });
        this.filteredRows = this.allRows.slice();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.allRows = [];
        this.filteredRows = [];
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }


  getCarAssignmentUpdate() {
    this.loading = true;
    this._carAssignmentService.update(this.carAssingnmetId, this.convertDataUpdate()).subscribe({
      next: (res) => {
        this.getCarAssignment();
        this.loading = false;
        this.cdr.detectChanges();

      },
      error: (err) => {
        this.cdr.detectChanges();
      },
    });
  }

  onFiltersChange(values: Record<string, any>) {
    this.filterValues = {
      query: values.query ?? '',
      model: values.model ?? '',
      startDate: values.startDate ?? '',
      endDate: values.endDate ?? ''
    };
    this.getCarAssignment();
  }

  onExtraAction(btn: FilterExtraButton) {
    if (btn.key === 'export') {
      this.downloadCarAssignments();
    }
  }


  // Tabla y paginación
  genericColumns: string[] = [
    'N°', 'Socio', 'Modelo de Carro/Marca', 'Precio del auto', 'Cuota', 'Cuotas pagadas', 'Bono asignado', 'Cuota mensual', 'Rango actual', 'Fecha de asignación'
  ];
  genericKeys: string[] = [
    'item', 'memberFullName', 'modelName', 'priceUsd', 'totalInitialInstallments', 'paidInitialInstallments', 'assignedMonthlyBonusUsd', 'totalMonthlyInstallments', 'currentRankName', 'assignedDate'
  ];
  genericWidths: string[] = [
    '5%', '15%', '15%', '10%', '10%', '10%', '10%', '10%', '10%', '10%'
  ];



  pageSize = 8;
  pageIndex = 1;

  get totalFiltered(): number { return this.filteredRows.length; }

  get pagedData() {
    const start = (this.pageIndex - 1) * this.pageSize;
    return this.filteredRows.slice(start, start + this.pageSize).map((row, idx) => ({
      ...row,
      item: start + idx + 1
    }));
  }

  onPageChange(index: number) { this.pageIndex = index; }
  onPageSizeChange(size: number) { this.pageSize = size; this.pageIndex = 1; }

  onViewRow(row: any) {
    const socioId = row?.item ?? null;
    if (socioId != null) {
      this.router.navigate(['/dashboard/manage-prize/bonus-type/car/car-assignment/socio', socioId]);
    } else {
      alert('No se encontró el ID del socio para esta fila.');
    }
  }
  onEditRow(row: ICarAssignment) {
    this.scheduleInitialData = this.mapRowToScheduleInitial(row);
    this.carAssingnmetId = row.carAssignmentId;
    this.lastSelectedSocioId = row?.memberId ?? null;
    this.showScheduleModal = true;

    // this.router.navigate(['/dashboard/manage-prize/bonus-type/car/car-assignment/socio', socioId]);
  }

  showScheduleModal = false;
  scheduleInitialData: ScheduleInitialData | null = null;
  lastSchedulePayload: SchedulePayload | null = null;
  lastSelectedSocioId: number | null = null;

  private mapRowToScheduleInitial(row: ICarAssignment): ScheduleInitialData {
    return {
      id: row?.memberId,
      partnerId: null,
      partnerName: row?.memberFullName ?? '',
      carId: null,
      carTitle: row?.modelName ?? '',
      priceUsd: row?.priceUsd ?? 0,
      monthlyBonusUsd: row?.assignedMonthlyBonusUsd ?? 0,
      installments: row?.totalInitialInstallments ?? 1,
      gpsUsd: 0,
      insuranceUsd: 0,
      soatUsd: 0,
    };
  }

  onScheduleSave(payload: SchedulePayload) {
    this.lastSchedulePayload = payload;
    this.showScheduleModal = false;
    // Abrir confirm
    this.openConfirmNotify();
  }
  onScheduleClose() {
    this.showScheduleModal = false;
  }

  showConfirmNotify = false;
  confirmTitle = '¿Confirmar acción?';
  confirmMessage = 'Al actualizar, se generará el cronograma de pagos general. Si estás seguro, confirma la acción; de lo contrario, cancela.';
  confirmIcon: 'success' | 'error' | 'info' | 'warning' = 'warning';
  confirmPrimaryText = 'Enviar';
  confirmSecondaryText = 'Cancelar';
  confirmCloseOnConfirm = false;

  private openConfirmNotify() { this.showConfirmNotify = true; }
  onNotifyCanceled() {

    this.showConfirmNotify = false;
    this.showScheduleModal = true;
  }
  onNotifyConfirmed() {
    this.showConfirmNotify = false;
    const socioId = this.lastSelectedSocioId ?? this.lastSchedulePayload?.id ?? null;
    this.getCarAssignmentUpdate();
    if (socioId != null) {
      this.router.navigate(['/dashboard/manage-prize/bonus-type/car/car-assignment/socio', socioId]);
    } else if (this.redirectUrlAfterConfirm) {
      this.router.navigateByUrl(this.redirectUrlAfterConfirm);
    }
  }
  onNotifyClose() { this.showConfirmNotify = false; }

  redirectUrlAfterConfirm = '/dashboard/manage-prize/bonus-type/car/car-assignment';

  // ----- Filtros -----
  // private applyFilters() {
  //   const q = (this.filterValues.query || '').toString().trim().toLowerCase();
  //   const model = (this.filterValues.model || '').toString().trim();
  //   const start = (this.filterValues.startDate || '').toString().trim();
  //   const end = (this.filterValues.endDate || '').toString().trim();

  //   const inRange = (dateStr: string) => {
  //     if ((!start && !end) || !dateStr) return true;
  //     // fechas en formato YYYY-MM-DD
  //     const d = dateStr;
  //     const okStart = !start || d >= start;
  //     const okEnd = !end || d <= end;
  //     return okStart && okEnd;
  //   };

  //   this.filteredRows = this.allRows.filter(row => {
  //     const socio = (row.memberFullName || '').toLowerCase();
  //     const rango = (row.currentRankName || '').toLowerCase();
  //     const okQuery = !q || socio.includes(q) || rango.includes(q);
  //     const okModel = !model || row.modelName === model;
  //     const okDate = inRange(row.assignedDate || '');
  //     return okQuery && okModel && okDate;
  //   });
  //   this.pageIndex = 1;
  // }

  convertDataRequest(): ICarBonusSearchParams {
    const dataRequest: ICarBonusSearchParams = {} as ICarBonusSearchParams;
    if (Array.isArray(this.carModel) && this.filterValues?.model) {
      const selectedModel = this.carModel.find(m => m.id === this.filterValues.model);

      if (selectedModel) {
        dataRequest.modelName = selectedModel.name;
      }
    }

    dataRequest.member = (this.filterValues.query || '').toString().trim();
    dataRequest.startDate = (this.filterValues.startDate || '').toString().trim();
    dataRequest.endDate = (this.filterValues.endDate || '').toString().trim();
    dataRequest.page = this.pageIndex - 1;
    dataRequest.size = this.pageSize;
    return dataRequest;
  }

  convertDataUpdate(): ICarBonusAmounts {
    const dataRequest: ICarBonusAmounts = {} as ICarBonusAmounts;

    dataRequest.gpsAmount = this.lastSchedulePayload?.gpsUsd || 0;
    dataRequest.insuranceAmount = this.lastSchedulePayload?.insuranceUsd || 0;
    dataRequest.mandatoryInsuranceAmount = this.lastSchedulePayload?.soatUsd || 0;
    return dataRequest;
  }

  downloadCarAssignments() {
    this._carAssignmentService.exportCarAssignments().subscribe({
      next: (blob) => {
        // Crear un objeto URL temporal para el archivo
        const url = window.URL.createObjectURL(blob);

        // Crear un enlace invisible para descargar
        const a = document.createElement('a');
        a.href = url;
        a.download = 'car-assignments.xlsx'; // Cambia extensión según tu backend
        a.click();

        // Liberar el objeto URL
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Error al exportar los datos:', err);
      },
    });
  }

  getCarModels() {
    this._carAssignmentService.searchCarModels().subscribe({
      next: (res) => {
        this.carModel = res.data;
        const modelFilter = this.genericFilters.find(f => f.key === 'model');
        if (modelFilter && modelFilter.type === 'select') {
          modelFilter.options = res.data.map((item: any) => ({
            label: item.name,
            value: item.id
          }));
        }
        this.cdr.detectChanges();
      },
      error: (err) => { console.error(err);         this.cdr.detectChanges(); },
    });
  }

}