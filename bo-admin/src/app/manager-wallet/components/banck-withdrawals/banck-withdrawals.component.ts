import { ModalLoadingComponentManageBusiness } from '@app/manage-business/components/modals/modal-loading/modal-loading.component';
import { ModalsSolicitudRetiroComponent } from '../modals/modals-solicitud-retiro/modals-solicitud-retiro.component';
import { ModalsRegistroExitosoComponent } from '../modals/modals-registro-exitoso/modals-registro-exitoso.component';
import { ModalsDetalleRetiroComponent } from '../modals/modals-detalle-retiro/modals-detalle-retiro.component';
import { CommissionManagerService } from '@app/commission-manager/services/commission-manager.service';
import { EmptyStateComponent } from '@app/event/components/shared/empty-state/empty-state.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { RetirosService } from '@app/manager-wallet/services/retiros.service';
import { BankConfig, BankStatus, solicituRetiro } from '@app/manager-wallet/model/solicitudRetiro';
import { ALL_MONTHS } from '@constants/commission-affiliation.constant';
import { convertArrayToDate, formatDateToDDMMYYYY } from '@utils/date';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '@app/core/services/toast.service';
import { ISelectOpt } from '@interfaces/form-control.interface';
import { INavigationTab } from '@interfaces/shared.interface';
import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { merge, Subject } from 'rxjs';
import { formatDate } from '../../utils/utils';
import { ModalLoadingValidatorComponent } from '../modals/modal-loading-validator/modal-loading-validator.component';
import { ModalsBulkNotificationComponent } from '../modals/modals-bulk-notification/modals-bulk-notification.component';
import { InputFileOfWithdrawalComponent } from '../input-file/input-file.component';
import { TablePaginatorComponent } from "@shared/components/tables/table-paginator/table-paginator.component";
import { AuthService } from '@app/auth';
import { BankResponseTableComponent } from "../tables/bank-response-table/bank-response-table.component";
import { deepStrictEqual } from 'assert';
import { ModalsDownloadSuccessComponent } from '../modals/modals-download-success/modals-download-success.component';

interface IMonthOption {
  label: string;
  value: string;
  periods: ISelectOpt[];
}

export type TabType = 'rvalidar' | 'renvio' | 'rbanco' | 'rprocesados';

@Component({
  selector: 'app-banck-withdrawals',
  standalone: true,
  imports: [
    CommonModule,
    FormControlModule,
    EmptyStateComponent,
    FormsModule,
    ReactiveFormsModule,
    InputFileOfWithdrawalComponent,
    TablePaginatorComponent,
    BankResponseTableComponent
  ],
  templateUrl: './banck-withdrawals.component.html',
  styleUrls: ['./banck-withdrawals.component.scss']
})
export class BanckWithdrawalsComponent {

  @Input() bankConfig: BankConfig = {
    bankId: 1,
    bankName: 'BCP',
    filterLogic: (data: any[]) => data.filter(item => item.idBank === 1)
  };

  private currentBankStatusId: number[] = [1];

  loading = true;
  isLoading = false;
  isDataLoaded = false;
  buttonLoadingExcel: boolean = false;
  buttonLoadingTxt: boolean = false;
  refreshSelector = false;
  prevLoading: boolean = false;

  dataValidate: any;
  table: any[] = [];
  form: FormGroup;
  obj: solicituRetiro;
  dateFilter: string = '';

  pageIndex = 1;
  totalItems = { dol: 0, sol: 0 };
  totalValidateItems = 0;
  pagesPerBlock = 5;
  currentBlock = 1;
  pageSize = 6;

  activeTab: TabType = 'rvalidar';
  dateOpt: ISelectOpt[] = [];
  typeBonusOpt: ISelectOpt[] = [];
  monthOptions: IMonthOption[] = [];
  currentPage: number = 0;
  currentYear: number = new Date().getFullYear();

  statusOpt: ISelectOpt[] = [];
  reviewStatus: ISelectOpt[] = [];
  currencyOpt: ISelectOpt[] = [
    { id: '1', text: 'Dólares' },
    { id: '2', text: 'Soles' }
  ];
  allBankStatuses: BankStatus[] = [];

  loadingModalRef: NgbModalRef | null = null;
  prevValidatorModalRef: NgbModalRef | null = null;
  notificationBulkModalRef: NgbModalRef | null = null;

  private currentStepIndex = 0;
  private validationTimer: any;

  viewDetailBound = this.viewDetail.bind(this);
  onPageChangeBound = this.onPageChange.bind(this);
  onPageSizeChangeBound = this.onPageSizeChange.bind(this);

  private readonly tabStatusIds = {
    rvalidar: ['1', '3'],
    renvio: ['2'],
    rbanco: ['4', '5'],
    rprocesados: ['4', '5']
  };

  private destroy$ = new Subject<void>();

  public readonly navigationData: INavigationTab[] = [
    { path: '/dashboard/manager-wallet/retiros/bcp', name: 'BCP' },
    { path: '/dashboard/manager-wallet/retiros/interbank', name: 'Interbank' }
  ];

  constructor(
    private builder: FormBuilder,
    private modalManager: NgbModal,
    private retiroService: RetirosService,
    private cdr: ChangeDetectorRef,
    private toastService: ToastService,
    private modalService: NgbModal,
    private commissionManagerService: CommissionManagerService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.initForm();
    this.getBankReviewAllStatus();
    this.getBankAllStatus();
    this.initializeMonthOptions();
    this.setActiveTab('rvalidar');
    this.setupSearchFilter();
  }

  get totalPages(): number {
    return Math.ceil((this.totalItems.sol + this.totalItems.dol) / this.pageSize);
  }

  pages: number[]
  get visiblePages(): number[] {
    const startPage = Math.max(1, (this.currentBlock - 1) * this.pagesPerBlock + 1);
    const endPage = Math.min(this.currentBlock * this.pagesPerBlock, this.totalPages);

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    this.pages = pages

    return this.pages;
  }

  initForm() {
    this.form = this.builder.group({
      search: [''],
      status: [null],
      reviewStatus: [null],
      currency: [null],
      cicles: [null],
      periods: [[]],
      fechaRegistro: ['']
    });
  }

  getBankReviewAllStatus() {
    this.retiroService.getBankReviewStatus().subscribe(
      (response) => {
        if (response != null) {
          this.reviewStatus = response
            .filter((b: { id: number }) => b.id == 1 || b.id == 2)
            .map((b: any) => ({
              id: b.id,
              text: b.description
            }));
        }
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching states:', error);
      }
    );
  }

  getBankStatusName(id: string) {
    const status = this.reviewStatus.find(item => item.id === id);
    return status ? status.text : 'Estado no encontrado';
  }

  getBankAllStatus() {
    this.retiroService.getBankStatus().subscribe({
      next: (response: BankStatus[]) => {
        if (response?.length > 0) {
          const allowedIds = this.tabStatusIds[this.activeTab] || [];
          this.allBankStatuses = response;
          this.statusOpt = response
            .filter((status) => allowedIds.includes(status.id.toString()))
            .map(status => ({
              id: status.id.toString(),
              text: status.name,
            }));
        }
      },
      error: (err) => console.error('Error:', err)
    });
  }

  getColorBankAllStatus(id: number): BankStatus | undefined {
    return this.allBankStatuses.find(i => i.id === id);
  }

  getBorderColor(idBankStatus: number): { color: string, background: string } {
    const status = this.getColorBankAllStatus(idBankStatus);
    if (!status) return { color: "", background: "" };
    return { color: status.fontColor, background: status.backgroundColor };
  }

  setActiveTab(tab: TabType): void {
    this.loading = true;
    this.activeTab = tab;
    this.pageIndex = 1;
    this.totalItems = { dol: 0, sol: 0 };
    this.pagesPerBlock = 5;
    this.currentBlock = 1;
    this.pageSize = 6;

    if (tab === 'rvalidar') {
      this.currentBankStatusId = [1, 3];
      this.dataValidate = null;
    } else if (tab === 'renvio') {
      this.currentBankStatusId = [2];
      this.dataValidate = null;
    } else if (tab === 'rbanco') {
      this.currentBankStatusId = [4, 5];
      this.dataValidate = null;
    } else if (tab === 'rprocesados') {
      this.currentBankStatusId = [4, 5];
      this.dataValidate = null;
    }

    this.onClear();
    this.getBankAllStatus();
    this.listPendingBancario();
  }

  private shouldSortByBankStatus(): boolean {
    return this.currentBankStatusId.length === 2 &&
      this.currentBankStatusId.includes(4) &&
      this.currentBankStatusId.includes(5);
  }

  private sortByBankStatus(data: any[]): any[] {
    return data.sort((a, b) => {
      const indexA = this.currentBankStatusId.indexOf(a.idBankStatus);
      const indexB = this.currentBankStatusId.indexOf(b.idBankStatus);

      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB;
      }

      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;

      return 0;
    });
  }

  goToPage(page: number): void {
    this.pageIndex = page;
    this.listPendingBancario();
  }

  onPageChange(newPage: number) {
    this.pageIndex = newPage;
    this.listPendingBancario();
  }

  onPageSizeChange(newSize: number) {
    this.pageSize = newSize;
    this.pageIndex = 1;
    this.listPendingBancario();
  }

  prevPage(): void {
    if (this.pageIndex > 1) {
      this.pageIndex--;

      if ((this.pageIndex) % this.pagesPerBlock === 0 && this.currentBlock > 1) {
        this.currentBlock--;
      }

      this.listPendingBancario();
    }
  }

  nextPage(): void {
    if (this.pageIndex < this.totalPages) {
      this.pageIndex++;

      if (this.pageIndex > this.currentBlock * this.pagesPerBlock &&
        this.currentBlock < Math.ceil(this.totalPages / this.pagesPerBlock)) {
        this.currentBlock++;
      }

      this.listPendingBancario();
    }
  }

  onSearchAutomatic(): void {
    this.isLoading = true;
    this.pageIndex = 1;
    this.listPendingBancario();
  }

  private formatDateForService(date: string): string {
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  }

  formatDate(fechaOriginal: number[]): string {
    return formatDate(fechaOriginal);
  }

  onDateChange(event: any): void {
    const dateValue = event.target.value;
    this.dateFilter = dateValue ? this.formatDateForService(dateValue) : '';
    this.form.get('fechaRegistro')?.setValue(dateValue);
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

  viewDetail(row: any) {
    const ref = this.modalManager.open(ModalsDetalleRetiroComponent, {
      centered: true,
      size: 'md'
    });
    const modal = ref.componentInstance as ModalsDetalleRetiroComponent;
    modal.title = 'Detalle del retiro';
    modal.subtitle = 'Informacion detallada del retiro';
    modal.icon = "assets/media/svg/retiro/coins.svg";
    modal.data = row;
    modal.getColorBackground = this.getBorderColor(row['idBankStatus']).background
    modal.getColorFont = this.getBorderColor(row['idBankStatus']).color
    modal.typeOfTab = this.activeTab;

    this.updateReview(row['idsolicitudebank'], row['reviewStatusId']);
  }

  viewModelSolicitud(modo: string, row: any) {
    const ref = this.modalManager.open(ModalsSolicitudRetiroComponent, {
      centered: true,
      size: 'md'
    });
    const modal = ref.componentInstance as ModalsSolicitudRetiroComponent;
    modal.modo = modo;
    modal.title = modo === 'confirmar' ?
      '¿Deseas aceptar la solicitud?' :
      '¿Deseas rechazar la solicitud?';
    modal.subtitle = modo === 'confirmar' ?
      'La solicitud de retiro será confirmada.' :
      'La solicitud de retiro será rechazada.';
    modal.icon = "assets/media/svg/retiro/warrinng.svg";

    ref.result.then((result) => {
      if (!result.success) return;

      this.loading = true;
      if (result.data) {
        this.solicitudeConfirmar(row);
      }
      this.cdr.detectChanges();
    });
  }

  solicitudeConfirmar(row: any) {
    this.obj = {
      idsolicitudebank: row['idsolicitudebank'],
      namePropio: row['nameOrigen'],
      lastnamePropio: row['lastNameOrigen'],
      status: 2
    };

    this.retiroService.updateAprobado(this.obj).subscribe({
      next: (aprobado) => {
        if (aprobado['data']) {
          const ref = this.modalManager.open(ModalsRegistroExitosoComponent, {
            centered: true,
            size: 'md'
          });
          const modal = ref.componentInstance as ModalsRegistroExitosoComponent;
          this.listPendingBancario();
          this.cdr.detectChanges();
        } else {
          this.loading = false;
          this.cdr.detectChanges();
          this.toastService.addToast('Saldo insuficiente del usuario', 'warning');
        }
      },
      error: (error) => {
        this.loading = false;
        this.cdr.detectChanges();
        this.toastService.addToast('Error al Aprobar retiro bancario', 'error');
      }
    });
  }

  getNameOfStates(id: number) {
    return this.statusOpt.find(state => +state.id === id)?.text || '';
  }

  updateReview(id: number, reviewStatusId: number) {
    if (reviewStatusId == 2) return;
    this.retiroService.onViewDetail(id, this.authService.getUsernameOfCurrentUser()).subscribe({
      next: () => {
        this.listPendingBancario();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  total: number
  listPendingBancario() {
    this.isLoading = true;
    const search = this.form.get('search')?.value || '';
    const status = this.form.get('status')?.value === '-1' ? '' : this.form.get('status')?.value || '';
    const currency = this.form.get('currency')?.value === '-1' ? '' : this.form.get('currency')?.value || '';
    const reviewStatus = this.form.get('reviewStatus')?.value === '-1' ? '' : this.form.get('reviewStatus')?.value || '';

    const selectedPeriods: (string | number)[] = this.form.get('periods')?.value ?? [];
    const periodIds = selectedPeriods.map((id) => +id);

    this.retiroService.getListPendingBacancario(
      this.pageIndex - 1,
      this.pageSize,
      search,
      status,
      currency,
      reviewStatus,
      this.dateFilter,
      this.bankConfig.bankId,
      periodIds,
      this.currentBankStatusId
    ).subscribe({
      next: (data: any) => {
        if (data && data.data) {
          console.log(data.total, 'total')
          this.total = data.total
          const response = data?.data;
          const solesData = response.soles?.data || [];
          const dolaresData = response.dolares?.data || [];

          this.totalItems.sol = response.soles?.total || 0;
          this.totalItems.dol = response.dolares?.total || 0;
          this.totalValidateItems = response.soles?.total + response.dolares?.total;
          const currencyFilter = this.form.get('currency')?.value;

          if (!currencyFilter || currencyFilter === '' || currencyFilter === '-1') {
            this.table = [...solesData, ...dolaresData];
          } else if (currencyFilter === '1') {
            this.table = dolaresData;
          } else if (currencyFilter === '2') {
            this.table = solesData;
          } else {
            this.table = solesData;
          }

          if (this.shouldSortByBankStatus()) {
            this.table = this.sortByBankStatus(this.table);
          }

        } else {
          this.table = [];
        }

        this.loading = false;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.loading = false;
        this.isLoading = false;
        this.table = [];
        this.cdr.detectChanges();
      }
    });
  }

  get isValid(): boolean {
    return this.table.some(item => item.idBankStatus === 3)
  }

  onClear(): void {
    this.form.reset({
      search: '',
      status: null,
      reviewStatus: null,
      currency: null,
      cicles: null,
      periods: [],
      fechaRegistro: ''
    });
    this.dateFilter = '';
    this.pageIndex = 1;
    this.listPendingBancario();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeMonthOptions(): void {
    this.monthOptions = ALL_MONTHS.map((month) => ({
      ...month,
      periods: []
    }));
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

  private forceSelectorUpdate(): void {
    this.refreshSelector = !this.refreshSelector;
    this.cdr.detectChanges();

    setTimeout(() => {
      this.refreshSelector = !this.refreshSelector;
      this.cdr.detectChanges();
    }, 0);
  }

  loadingPrevValidator(): void {
    this.currentStepIndex = 0;
    this.startValidationFlow();
  }

  private startValidationFlow(): void {
    this.showLoadingModalPreValidator();
    this.processNextValidationStep();
  }

  private showLoadingModalPreValidator(): void {
    this.prevValidatorModalRef = this.modalService.open(ModalLoadingValidatorComponent, {
      centered: true,
      size: 'md',
      backdrop: 'static',
      keyboard: false
    });
    this.prevValidatorModalRef.componentInstance.currentStepIndex = this.currentStepIndex;
    this.prevValidatorModalRef.componentInstance.data = this.totalValidateItems;
    this.prevValidatorModalRef.componentInstance.totalWithdrawals = this.total
  }

  private processNextValidationStep(): void {
    if (this.currentStepIndex < 2) {

      this.preValidateWithdrawal(() => {
        this.currentStepIndex++;
        if (this.currentStepIndex > 2) {
          this.processNextValidationStep();
        } else {
          this.finishValidationProcess();
        }
      });

      if (this.prevValidatorModalRef?.componentInstance) {
        this.prevValidatorModalRef.componentInstance.typeOfTab = this.activeTab;
        this.prevValidatorModalRef.componentInstance.currentStepIndex = this.currentStepIndex;
      }

    }
  }

  preValidateWithdrawal(onComplete?: () => void) {
    this.retiroService.preValidateWithdrawals(this.authService.getUsernameOfCurrentUser()).subscribe({
      next: (response) => {
        if (response != null) {
          this.dataValidate = response;
          if (this.dataValidate?.allValid === true) {
            this.currentBankStatusId = [3];
          }
        }
        this.isDataLoaded = true;
        this.listPendingBancario();
        this.cdr.detectChanges();

        onComplete?.();
      },
      error: (err) => {
        console.log(err);
        this.isDataLoaded = true;
        onComplete?.();
      }
    });
  }

  sendBulkNotification(): void {
    const modalRef = this.showModalNoticationBulk();

    modalRef.result.then(
      (result) => {
        if (result && result.success) {
          this.listPendingBancario();
          this.cdr.detectChanges();

        }
      },
      () => {
        console.log('Modal cancelado');
      }
    ).finally(() => {
      this.table = []
      this.cdr.detectChanges();

    });
  }

  private finishValidationProcess(): void {
    this.hideLoadingModal();
    this.showValidationResultModal();
  }

  private showValidationResultModal(): void {
    const ref = this.modalService.open(ModalLoadingValidatorComponent, {
      centered: true,
      size: 'md'
    });
    const modal = ref.componentInstance as ModalLoadingValidatorComponent;
    modal.totalWithdrawals = this.total;
    modal.data = this.dataValidate?.dateSubscriptionResult?.data;
    modal.currentStepIndex = 1;
    modal.title = 'Proceso finalizado';
    modal.subtitle = 'Los registros han sido validados correctamente';

    ref.result.then(() => {
      console.log('Modal cerrado');
    }).catch(() => {
      console.log('Modal cancelado');
    });
  }

  private showLoadingModal(): void {
    this.loadingModalRef = this.modalService.open(ModalLoadingComponentManageBusiness, {
      centered: true,
      size: 'sm'
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

  private showModalNoticationBulk(): NgbModalRef {
    this.notificationBulkModalRef = this.modalService.open(ModalsBulkNotificationComponent, {
      centered: true,
      size: 'sm',
      backdrop: 'static',
      keyboard: true
    });

    const modal = this.notificationBulkModalRef.componentInstance;

    if (modal) {
      modal.body = this.table;
      modal.config = 'rejectionall'
    }

    return this.notificationBulkModalRef;
  }

  private setupSearchFilter(): void {
    const search$ = this.form.get('search')!.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged()
    );

    const filters$ = ['status', 'currency', 'reviewStatus', 'fechaRegistro', 'periods']
      .map(field => this.form.get(field)!.valueChanges.pipe(
        distinctUntilChanged()
      ));

    merge(search$, ...filters$)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.onSearchAutomatic();
      });
  }

  modalDownnloadSuccess: any;
  downloadExcelFile(): void {
    if (!this.table || this.table.length === 0) {
      this.toastService.addToast('No hay datos para descargar', 'warning');
      return;
    }

    this.showModalDownloadFileSuccess();

    setTimeout(() => {
      this.retiroService.downloadExcel(this.authService.getUsernameOfCurrentUser()).subscribe({
        next: (response: Blob) => {
          if (!response || !(response instanceof Blob) || response.size === 0) {
            this.modalDownnloadSuccess?.close();
            this.toastService.addToast('Error: archivo inválido', 'error');
            return;
          }

          try {
            const url = window.URL.createObjectURL(response);
            const link = document.createElement('a');
            link.href = url;
            link.download = `retiros_${this.bankConfig.bankName}_${this.getCurrentDateTime()}.xlsm`;
            document.body.appendChild(link);
            link.click();

            setTimeout(() => {
              document.body.removeChild(link);
              window.URL.revokeObjectURL(url);
            }, 100);

            setTimeout(() => {
              if (this.modalDownnloadSuccess?.componentInstance) {
                this.modalDownnloadSuccess.componentInstance.currentStepIndex = false;
                this.modalDownnloadSuccess.componentInstance.cdr.detectChanges();
              }
            }, 100);

          } catch (error) {
            this.modalDownnloadSuccess?.close();
            this.toastService.addToast('Error al descargar el archivo', 'error');
          }

          this.buttonLoadingExcel = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          this.buttonLoadingExcel = false;
          this.modalDownnloadSuccess?.close();
          this.toastService.addToast('Error al descargar el archivo Excel', 'error');
        }
      });
    }, 200);
  }

  downloadTxtFile(): void {
    if (!this.table || this.table.length === 0) {
      this.toastService.addToast('No hay datos para descargar', 'warning');
      return;
    }

    this.showModalDownloadFileSuccess();

    setTimeout(() => {
      this.retiroService.downloadTxt(this.authService.getUsernameOfCurrentUser()).subscribe({
        next: (response: Blob) => {
          if (!response || !(response instanceof Blob) || response.size === 0) {
            this.modalDownnloadSuccess?.close();
            this.toastService.addToast('Error: archivo inválido', 'error');
            return;
          }

          try {
            const url = window.URL.createObjectURL(response);
            const link = document.createElement('a');
            link.href = url;
            link.download = `retiros_${this.bankConfig.bankName}_${this.getCurrentDateTime()}.txt`;
            document.body.appendChild(link);
            link.click();

            setTimeout(() => {
              document.body.removeChild(link);
              window.URL.revokeObjectURL(url);
            }, 100);

            setTimeout(() => {
              if (this.modalDownnloadSuccess?.componentInstance) {
                this.modalDownnloadSuccess.componentInstance.currentStepIndex = false;
                this.modalDownnloadSuccess.componentInstance.cdr.detectChanges();
              }
            }, 100);

          } catch (error) {
            this.modalDownnloadSuccess?.close();
            this.toastService.addToast('Error al descargar el archivo', 'error');
          }

          this.buttonLoadingTxt = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          this.buttonLoadingTxt = false;
          this.modalDownnloadSuccess?.close();
          this.toastService.addToast('Error al descargar el archivo TXT', 'error');
        }
      });
    }, 200);
  }

  private showModalDownloadFileSuccess() {
    this.modalDownnloadSuccess = this.modalService.open(ModalsDownloadSuccessComponent, {
      centered: true,
      size: 'md',
      backdrop: 'static',
      keyboard: false
    });

    this.modalDownnloadSuccess.componentInstance.recordCount = this.total || 0;
    this.modalDownnloadSuccess.componentInstance.currentStepIndex = true;
  }

  private downloadFile(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  private getCurrentDateTime(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}${month}${day}_${hours}${minutes}`;
  }

  onDataImported(): void {
    this.listPendingBancario();
  }
}