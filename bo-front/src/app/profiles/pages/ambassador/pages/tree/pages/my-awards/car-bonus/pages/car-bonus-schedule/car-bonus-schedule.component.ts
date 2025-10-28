import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  ScheduleType,
  AssignedInfo,
  CountersGeneral,
  CountersInicial,
  DatesGeneral,
  DatesInicial
} from './car-bonus-schedule.types';
import { FilterGenericComponent, FilterExtraButton, FilterGenericConfig } from '@shared/components/filters/filter-generic/filter-generic.component';
import { TableGenericComponent } from '@shared/components/tables/table-generic/table-generic.component';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';
import { ModalNotifyComponent } from '@shared/components/modal/modal-notify/modal-notify.component';
import { PaymentsModalComponent } from '../../../componentes/modals/payments-modal/payments-modal.component';
import { WalletModalComponent } from 'src/app/init-app/pages/purchase-checkout/components/payment-modals/wallet-modal/wallet-modal.component';
import { TransferenciaModalComponent } from 'src/app/init-app/pages/purchase-checkout/components/payment-modals/transferencia-modal/transferencia-modal.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ModalPaymentPaypalComponent } from 'src/app/profiles/pages/ambassador/pages/new-partner/pages/new-partner-payment/commons/modals/modal-payment-paypal/modal-payment-paypal.component';

// Controlador de modales centralizado
import { createModalState, ModalsController, ModalState, BankMethod } from './car-bonus-schedule.modals';
import { CarBonusScheduleService } from '../service/car-bonus-schedule.service';
import { CarBonusPaymentService } from 'src/app/profiles/pages/ambassador/pages/tree/pages/my-awards/car-bonus/pages/service/car-bonus-payment.service';
import { MyAwardsService } from '../../../components/service/my-awards.service';
import { ICarBonusScheduleContent } from '../../interface/car-bonus-schedule';
import { PaymentStatus } from './data/paymentStatus';
import { ICarBonusScheduleExtraData, ICarBonusScheduleExtraResponse } from '../../interface/car-bonus-schedule-extra';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { BreadcrumbItem } from '@shared/interfaces/breadcrumb';
import { IRankBonusData } from '../../../interface/classification';
import { ClassificationsService } from '../../../components/service/classifications.service';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';
import { ModalCarBonusComponent } from '../../../components/modal-car-bonus/modal-car-bonus.component';
import { TablePaginatorComponent } from '@shared/components/tables/table-paginator/table-paginator.component';
import { IExchangeRate, ModalPaymentService } from 'src/app/profiles/pages/ambassador/pages/new-partner/pages/new-partner-payment/commons/sevices/modal-payment.service';
import { OperationTypeService } from 'src/app/init-app/pages/purchase-checkout/services/operation-type.service';
import { WalletService } from 'src/app/profiles/pages/ambassador/pages/wallet/commons/services/wallet.service';
import { finalize } from 'rxjs';

interface ScheduleState {
  tipo: ScheduleType;
  isInicial: boolean;
  isGeneral: boolean;
  pageTitle: string;
}
@Component({
  selector: 'app-car-bonus-schedule',
  standalone: true,
  imports: [
    CommonModule,
    FilterGenericComponent,
    TableGenericComponent,
    EmptyStateComponent,
    ModalNotifyComponent,
    PaymentsModalComponent,
    WalletModalComponent,
    TransferenciaModalComponent,
    BreadcrumbComponent,
    TablePaginatorComponent
  ],
  templateUrl: './car-bonus-schedule.component.html',
  styleUrls: ['./car-bonus-schedule.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService]
})
export class CarBonusScheduleComponent implements OnInit {
  schedule!: ScheduleState;
  proformaId!: number;
  tipo: ScheduleType = 'general';
  private dialogRef: DynamicDialogRef;
  assigned: AssignedInfo = {} as AssignedInfo;
  countersGeneral: CountersGeneral = {} as CountersGeneral;
  countersInicial: CountersInicial = {} as CountersInicial;
  datesGeneral: DatesGeneral = {} as DatesGeneral;
  datesInicial: DatesInicial = {} as DatesInicial;
  tableColumns: string[] = [];
  tableKeys: string[] = [];
  tableData: ICarBonusScheduleContent[] = [];
  tableColumnWidths: string[] = [];
  displayedTableData: ICarBonusScheduleContent[] = [];
  breadcrumbItems: BreadcrumbItem[] = [];
  totalElements = 0;
  pageSize = 10;
  pageIndex = 1;

  filtersGeneral: FilterGenericConfig[] = [
    {
      type: 'select',
      key: 'cuotas',
      label: 'Número de cuotas',
      options: [
        { label: '1', value: '1' },
        { label: '2', value: '2' },
        { label: '3', value: '3' },
        { label: '4', value: '4' },
        { label: '5', value: '5' },
        { label: '6', value: '6' },
        { label: '7', value: '7' },
        { label: '8', value: '8' },
        { label: '9', value: '9' },
      ]
    },
    {
      type: 'select',
      key: 'estado',
      label: 'Estado',
      options: [
        { label: 'Pagado', value: 'COMPLETED' },
        { label: 'Pendiente', value: 'PENDING' },
        { label: 'Pago Fallido', value: 'FAILED' },
        { label: 'Pendiente de Revisión', value: 'PENDING_REVIEW' },
        { label: 'Rechazado', value: 'REJECTED' },
      ]
    }
  ];
  filterValues: Record<string, any> = {};
  extraButtonsGeneral: FilterExtraButton[] = [{ key: 'exportar', label: 'Exportar', variant: 'primary' }];

  paymentTypes: any[] = []; 
  exchangeRateData: IExchangeRate | null = null;

  modalState: ModalState = createModalState();
  private userId: number;
  walletAvailable = 0;
  walletAccounting = 0;
  walletLoading = false;
  isSubmitting = false;

  rejectedPaymentData: any = null;

  constructor(
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private dialogService: DialogService,
    private _carBonusScheduleService: CarBonusScheduleService,
    private classificationsService: ClassificationsService,
    private userInfoService: UserInfoService,
    public _myAwardsService: MyAwardsService,
    private paymentService: CarBonusPaymentService,
    private operationTypeService: OperationTypeService,
    private modalPaymentService: ModalPaymentService,
    private walletService: WalletService

  
  ) { }

  get showGlobalSpinner(): boolean {
    return this.walletLoading || this.isSubmitting;
  }
  get isInicial() { return this.tipo === 'inicial'; }
  get isGeneral() { return this.tipo === 'general'; }
  get pageTitle() { return this.isInicial ? 'Cronograma Inicial' : 'Cronograma General'; }

  ngOnInit(): void {
    const pId = this.route.snapshot.paramMap.get('proformaId');
    const t = (this.route.snapshot.paramMap.get('tipo') || '').toLowerCase();
    this.proformaId = pId ? +pId : 0;
    this.tipo = (t === 'inicial' || t === 'general') ? (t as ScheduleType) : 'general';
    
    this.userId = this.userInfoService.userInfo.id;
    this.getScheduleExtra();
    
    this.isGeneralInicial();

    this.filterValues = this.schedule.isGeneral ? { cuotas: '', estado: '' } : {};

    this.loadPaymentTypes();
    this.loadExchangeRate();
    
    this.loadData();
    this.cdr.markForCheck();
    this.initBreadcrumb();
  }
  isGeneralInicial(): void {
    this._myAwardsService.getStatusSchedule().subscribe(t => {
      const tipo: ScheduleType = (t === 'inicial' || t === 'general') ? t : 'general';
      this.schedule = {
        tipo,
        isInicial: tipo === 'inicial',
        isGeneral: tipo === 'general',
        pageTitle: tipo === 'inicial' ? 'Cronograma Inicial' : 'Cronograma General'
      };
      this.filterValues = this.schedule.isGeneral ? { cuotas: '', estado: '' } : {};
      this.cdr.markForCheck();
      this.getScheduleExtra();
      this.loadData();
    });
  }

  private loadData() {
    if (this.schedule.isGeneral) {
      this.getCarBonusScheduleGene();
      this.tableColumns = [
        'Fecha registro de pago',
        'Concepto',
        'Cuota financiamiento (USD)',
        'Seguro (USD)',
        'Total cuota (USD)',
        'Bono inicial (USD)',
        'Bono mensual (USD)',
        'Monto a Pagar (USD)',
        'Fecha límite de pago',
        'Estado'
      ];
      this.tableKeys = [
        'paymentDate',
        'concepto',
        'financingInstallment', 
        'insurance',           
        'total',              
        'initialBonus',        
        'monthlyBonus',          
        'memberAssumedPayment',
        'dueDate',
        'statusName'
      ];
      this.tableColumnWidths = ['12%', '17%', '12%', '8%', '12%', '12%', '12%', '10%', '4%'];
      this.applyFilters();
    } else {
      this.getCarBonusSchedule();
      this.tableColumns = [
        'Fecha registro pago', 
        'Concepto', 
        'Monto a pagar (USD)', 
        'Fecha límite pago', 
        'Estado'
      ];
      this.tableKeys = [
        'paymentDate', 
        'concepto', 
        'memberAssumedPayment', 
        'dueDate', 
        'statusName'
      ];
      this.tableColumnWidths = ['20%', '22%', '20%', '20%', '12%'];
    }
  }

  public initBreadcrumb(): void {
    this.breadcrumbItems = [
      {
        label: 'Mis premios',
        action: () => this._myAwardsService.setRouterTap('')
      },
      {
        label: 'Bonos Auto',
        action: () => this.getClassification()
      },
      {
        label: 'Cronograma inicial',
        action: () => { }
      }
    ];
  }

  private loadPaymentTypes(): void {
    this.operationTypeService.getOperationTypes().subscribe({
      next: (types) => {
        this.paymentTypes = types;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error loading payment types:', err);
        this.paymentTypes = [];
      }
    });
  }
  private loadExchangeRate(): void {
    this.modalPaymentService.getTipoCambio().subscribe({
      next: (exchangeRate) => {
        this.exchangeRateData = exchangeRate;
        this.cdr.markForCheck();
      },
      error: () => {
        this.exchangeRateData = {
          idExchangeRate: 0,
          buys: 3.445,
          sale: 3.47,
          date: [],
          modificationDate: []
        };
        this.cdr.markForCheck();
      }
    });
  }

  private getCommissionForMethod(methodKey: string): { 
    commissionSoles: number; 
    commissionDollars: number; 
    ratePercentage: number;
    subTypeId: number;
  } {
    const methodMapping: Record<string, number> = {
      'bcp': 1,
      'interbank': 2,
      'paypal': 3,  
      'wallet': 4,
      'otros': 5
    };

    const paymentTypeId = methodMapping[methodKey];
    
    if (!paymentTypeId) {
      return { commissionSoles: 0, commissionDollars: 0, ratePercentage: 0, subTypeId: 0 };
    }

    const paymentType = this.paymentTypes.find(pt => pt.idPaymentType === paymentTypeId);
    
    if (!paymentType) {
      return { commissionSoles: 0, commissionDollars: 0, ratePercentage: 0, subTypeId: 0 };
    }

    const activeSubTypes = paymentType.paymentSubTypeList.filter(
      sub => sub.statusDollar === true 
    );
    
    const defaultSubType = activeSubTypes.length > 0 
      ? activeSubTypes[0] 
      : paymentType.paymentSubTypeList[0];
    
    if (!defaultSubType) {
      return { commissionSoles: 0, commissionDollars: 0, ratePercentage: 0, subTypeId: 0 };
    }

    return {
      commissionSoles: defaultSubType.commissionSoles || 0,
      commissionDollars: defaultSubType.commissionDollars || 0,
      ratePercentage: defaultSubType.ratePercentage || 0,
      subTypeId: defaultSubType.idPaymentSubType || 0
    };
  }
  private calculatePaymentDetails(row: ICarBonusScheduleContent, methodKey: string = 'bcp') {
    const amountUSD = row.memberAssumedPayment || row.total || 0;
    const exchangeRate = this.exchangeRateData?.sale || 3.47;
    const amountPEN = amountUSD * exchangeRate;
    
    const { commissionSoles, commissionDollars, ratePercentage, subTypeId } = 
      this.getCommissionForMethod(methodKey);
    
    let totalCommission = 0;
    
    if (commissionSoles > 0) {
      totalCommission = commissionSoles;
    } else if (commissionDollars > 0) {
      totalCommission = commissionDollars * exchangeRate;
    }
    
    if (ratePercentage > 0) {
      const rateFee = (amountUSD * ratePercentage) / 100;
      totalCommission += (rateFee * exchangeRate); 
    }
    
    const totalPEN = amountPEN + totalCommission;

    return {
      amountUSD: Number(amountUSD.toFixed(2)),
      amountPEN: Number(amountPEN.toFixed(2)),
      exchangeRate: Number(exchangeRate.toFixed(3)),
      commission: Number(totalCommission.toFixed(2)),
      totalPEN: Number(totalPEN.toFixed(2)),
      concept: row.concepto || `Inicial Fraccionada N° ${row.installmentNum}`,
      dueDate: row.dueDate,
      installmentNum: row.installmentNum,
      scheduleId: row.id,
      methodKey: methodKey,
      subTypeId: subTypeId,
    };
  }
  convertAssigned(assigned: ICarBonusScheduleExtraData): AssignedInfo {
    const converted: AssignedInfo = {
      marcaModelo: assigned.carBrand + ' / ' + assigned.carModel || '',
      precioAutoUSD: assigned.carPriceUsd || 0,
      cuotaInicialTotalUSD: assigned.remainingInitialInstallments || 0,
      precioTotalAutoUSD: assigned.carPriceUsd || 0,
      bonoMensualUSD: assigned.monthlyBonusUsd || 0,
    }
    return converted;
  }
  convertAssignedGene(assigned: ICarBonusScheduleExtraData): AssignedInfo {
    const converted: AssignedInfo = {
      marcaModelo: assigned.carBrand + ' / ' + assigned.carModel || '',
      precioAutoUSD: assigned.carPriceUsd || 0,
      cuotaInicialTotalUSD: assigned.remainingInitialInstallments || 0,
      precioTotalAutoUSD: assigned.carPriceUsd || 0,
      bonoMensualUSD: assigned.monthlyBonusUsd || 0,
    }
    return converted;
  }

  convertCounter(assigned: ICarBonusScheduleExtraData): CountersInicial {
    const converted: CountersInicial = {
      inicialTotalUSD: assigned.totalInitialInstallments || 0,
      inicialPrepagadaUSD: assigned.paidInitialInstallments || 0,
      cuotasRestantes: assigned.remainingInitialInstallments || 0,
      montoRestanteUSD: assigned.remainingInitialInstallmentsUsd || 0
    }
    return converted;
  }

  convertCounterGene(assigned: ICarBonusScheduleExtraData): CountersGeneral {
    const converted: CountersGeneral = {
      cuotasPagadas: assigned.paidMonthlyInstallments || 0,
      montoPagadoUSD: assigned.totalPaidMonthlyUsd || 0,
      cuotasRestantes: assigned.remainingMonthlyInstallments || 0,
      montoRestanteUSD: assigned.remainingMonthlyInstallmentsUsd || 0,
      cuotasTotales: assigned.totalMonthlyInstallments || 0,
      montoTotalUSD: assigned.totalMonthlyInstallmentsUsd || 0
    }
    return converted;
  }

  convertDatesDelivery(assigned: ICarBonusScheduleExtraData): DatesInicial {
    const converted: DatesInicial = {
      inicioPago: this.formatDateArrayToString(assigned.initialPaymentDate) || '',
      finPago: this.formatDateArrayToString(assigned.lastPaymentDate) || '',
      entregaEn: assigned.eventName || ''
    }
    return converted;
  }

  convertDatesDeliveryGene(assigned: ICarBonusScheduleExtraData): DatesGeneral {
    const converted: DatesGeneral = {
      inicioPago: this.formatDateArrayToString(assigned.initialPaymentDate) || '',
      finPago: this.formatDateArrayToString(assigned.lastPaymentDate) || '',
      interesPct: assigned.interestRate || 0,
    }
    return converted;
  }

  getCarBonusSchedule(): void {
    if (this._myAwardsService.getCarAssinmentId) {
      const id = this._myAwardsService.getCarAssinmentId;
      this._carBonusScheduleService
        .getCarBonusSchedule(id, this.pageIndex - 1, this.pageSize)
        .subscribe(response => {
          this.tableData = response.data.content.map(r => ({
            ...r,
            statusName: this.translate(r.status.name),
            concepto: this.getConcepto(r)
          }));
          this.applyFilters();

          this.totalElements = response.data.totalElements ?? this.tableData.length;
          this.pageSize = response.data.pageSize ?? this.pageSize;
          this.pageIndex = (response.data.currentPage ?? 0) + 1;
          this.cdr.markForCheck();
        });
    }
  }

  getCarBonusScheduleGene(): void {
    if (this._myAwardsService.getCarAssinmentId) {
      const id = this._myAwardsService.getCarAssinmentId;
      this._carBonusScheduleService
        .getCarBonusScheduleGene(id, this.pageIndex - 1, this.pageSize)
        .subscribe(response => {
          this.tableData = response.data.content.map(r => ({
            ...r,
            statusName: this.translate(r.status.name),
            concepto: this.getConcepto(r)
          }));
          this.applyFilters();

          this.totalElements = response.data.totalElements ?? this.tableData.length;
          this.pageSize = response.data.pageSize ?? this.pageSize;
          this.pageIndex = (response.data.currentPage ?? 0) + 1;
          this.cdr.markForCheck();
        });
    }
  }

  getScheduleExtra(): void {
    const id = this._myAwardsService.getCarAssinmentId;
    this._carBonusScheduleService.getScheduleExtra(id).subscribe(response => {
      if (this.schedule.isGeneral) {
        this.assigned = this.convertAssignedGene(response.data);
        this.countersGeneral = this.convertCounterGene(response.data);
        this.datesGeneral = this.convertDatesDeliveryGene(response.data);
      } else {
        this.assigned = this.convertAssigned(response.data);
        this.countersInicial = this.convertCounter(response.data);
        this.datesInicial = this.convertDatesDelivery(response.data);
      }

      this.cdr.markForCheck();
    });
  }
  onPageChange(p: number) {
    this.pageIndex = p;
    if (this.schedule?.isGeneral) {
      this.getCarBonusScheduleGene();
    } else {
      this.getCarBonusSchedule();
    }
  }

  onPageSizeChange(size: number) {
    this.pageSize = size;
    this.pageIndex = 1; 
    if (this.schedule?.isGeneral) {
      this.getCarBonusScheduleGene();
    } else {
      this.getCarBonusSchedule();
    }
  }
  private getCuotaNumero(concepto: string | undefined): number | null {
    if (!concepto) return null;
    const m = concepto.match(/Cuota\s*N°\s*(\d+)/i);
    if (!m) return null;
    const n = parseInt(m[1], 10);
    return isNaN(n) ? null : n;
  }

  public rowSelectableHook = (row: any): boolean => {
    const estado = (row?.statusName ?? '').toString();
    return !(estado === 'Pagado' || estado === 'Pendiente de Revisión');
  };
  private applyFilters(): void {
    if (this.schedule.isInicial) return;

    const { cuotas, estado } = this.filterValues || {};
    const hasCuotas = cuotas !== undefined && cuotas !== null && cuotas !== '';
    const hasEstado = !!estado;

    let filteredData = [...this.tableData];

    if (hasEstado || hasCuotas) {
      filteredData = this.tableData.filter(row => {
        const matchEstado = hasEstado ? row.status?.name === estado : true;
        const matchCuotas = hasCuotas ? row.installmentNum === Number(cuotas) : true;
        return matchEstado && matchCuotas;
      });
    }
    this.displayedTableData = filteredData;
    this.cdr.markForCheck();
  }

  onFilterChange(values: Record<string, any>) {
    this.filterValues = values;
    this.applyFilters();
    this.cdr.markForCheck();
  }

  onExtraAction(btn: FilterExtraButton) {
    if (btn.key === 'exportar') this.downloadSchedule();
    if (btn.key === 'limpiar') this.filterValues = {};
  }

  isPayable(row: ICarBonusScheduleContent): boolean {
    return row?.status?.name === 'PENDING' || row?.status?.name === 'REJECTED';
  }

  onPaySingle(scheduleId: string) {
    const row = this.displayedTableData.find(r => r.id === scheduleId);
    if (!row) return;
    
    this.modalState = ModalsController.openPayments(
      this.modalState, 
      [scheduleId]
    );
    this.cdr.markForCheck();
  }

  onPay(row: ICarBonusScheduleContent) {
    if (row?.status?.name === 'REJECTED') {
      this.rejectedPaymentData = {
        paymentId: row.id,
      };
      
      this.modalState = ModalsController.openTransfer(this.modalState, 'otrosMedios');
      this.cdr.markForCheck();
      return;
    }

    const paymentDetails = this.calculatePaymentDetails(row, 'bcp');
    this.modalState = ModalsController.openPayments(
      this.modalState,
      [row.id],
      paymentDetails
    );
    this.cdr.markForCheck();
  }

  // Escucha selección de método en el modal de pagos
  onMethodSelected(method: string) {
    const selectedId = this.modalState.selectedPaymentIds[0];
    const row = this.displayedTableData.find(r => r.id === selectedId);

    if (!row) {
      return;
    }

    const paymentDetails = this.calculatePaymentDetails(row, method);
        
    this.modalState = {
      ...this.modalState,
      paymentDetails: paymentDetails  
    };

    this.modalState = ModalsController.closePayments(this.modalState);

    if (method === 'wallet') {
      this.loadWalletBalances();
      this.modalState = ModalsController.openWallet(this.modalState);
    } else if (method === 'bcp') {
      this.modalState = ModalsController.openTransfer(this.modalState, 'bcp');
    } else if (method === 'interbank') {
      this.modalState = ModalsController.openTransfer(this.modalState, 'interbank');
    } else if (method === 'otros') {
      this.modalState = ModalsController.openTransfer(this.modalState, 'otrosMedios');
    } else if (method === 'paypal') {
      this.openPaypalModalAndProcess(paymentDetails);
    }

    this.cdr.markForCheck();
  }
  private openPaypalModalAndProcess(paymentDetails: any): void {
    const commissionData = this.getCommissionForMethod('paypal');
    const rateAmountUSD = (paymentDetails.amountUSD * commissionData.ratePercentage) / 100;
    
    const dataToModal: any = {
      description: paymentDetails.concept,
      amount: paymentDetails.amountUSD,
      ratePercentage: commissionData.ratePercentage, 
      commissionDollars: commissionData.commissionDollars,
      rateAmountUSD: rateAmountUSD,
      payTypeSelected: 1,
      fromLegalization: false,
      montoLegalizacionUSD: 0,
      montoApostilladoExtraUSD: 0,
      idPaymentSubType: commissionData.subTypeId
    };

    this.dialogService
      .open(ModalPaymentPaypalComponent, {
        header: 'Pago con Paypal',
        data: dataToModal,
        dismissableMask: true,
        styleClass: 'p-paypal-modal',
        width: '480px'
      })
      .onClose.subscribe((paypalPayload: any) => {
        if (paypalPayload && paypalPayload.operationNumber) {
          this.sendPaypalPayment(paymentDetails, paypalPayload);
        }
      });
  }

  onModalClosed(kind: keyof ModalState) {
    if (kind === 'showNotify') this.modalState = ModalsController.closeNotify(this.modalState);
    if (kind === 'showPayments') this.modalState = ModalsController.closePayments(this.modalState);
    if (kind === 'showWallet') {
      this.modalState = ModalsController.closeWallet(this.modalState);
    }
    if (kind === 'showTransfer') {
      this.modalState = ModalsController.closeTransfer(this.modalState);
      this.rejectedPaymentData = null; 
    }
    this.cdr.markForCheck();
  }

  private sendPaypalPayment(paymentDetails: any, paypalPayload: any): void {
    const formData = new FormData();
    
    formData.append('scheduleId', paymentDetails.scheduleId);
    formData.append('memberId', this.userId.toString());
    formData.append('bonusType', 'CAR');
    formData.append('paymentType', 'PAYPAL');
    formData.append('paymentSubTypeId', paymentDetails.subTypeId.toString());
    formData.append('currencyType', 'USD');
    
    const totalAmount = parseFloat(paypalPayload.amount?.toString() || paymentDetails.amountUSD.toString());
    formData.append('totalAmount', totalAmount.toString());

    formData.append('voucher.operationNumber', paypalPayload.operationNumber);
    formData.append('voucher.note', `Pago con PayPal - ${paymentDetails.concept} - Order: ${paypalPayload.operationNumber}`);

    formData.append('paypal.orderId', paypalPayload.operationNumber);
    formData.append('paypal.transactionId', paypalPayload.operationNumber);
    formData.append('paypal.status', 'COMPLETED');
    formData.append('paypal.amount', totalAmount.toString()); 
    formData.append('paypal.currency', 'USD');
    formData.append('paypal.createTime', new Date().toISOString());
    
    if (paypalPayload.paymentSubTypeId) {
      formData.append('paypal.paymentSubTypeId', paypalPayload.paymentSubTypeId.toString());
    }
    
    if (paypalPayload.montoLegalizacionUSD) {
      formData.append('paypal.montoLegalizacionUSD', paypalPayload.montoLegalizacionUSD.toString());
    }
    
    if (paypalPayload.apostillaUSD) {
      formData.append('paypal.apostillaUSD', paypalPayload.apostillaUSD.toString());
    }

    this.isSubmitting = true;
    this.cdr.markForCheck();

    this.paymentService.makePayment(formData)
      .pipe(
        finalize(() => {
          this.isSubmitting = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: (response) => {
          this.modalState = ModalsController.openNotify(
            this.modalState,
            'Éxito',
            'Pago con PayPal registrado correctamente. Será revisado por el equipo.'
          );
          if (this.isGeneral) {
            this.getCarBonusScheduleGene();
          } else {
            this.getCarBonusSchedule();
          }
          this.cdr.markForCheck();
        },
        error: (error) => {
          let errorMessage = 'Ocurrió un error al registrar el pago con PayPal. Intenta nuevamente.';
          
          if (error.error?.error) {
            errorMessage = error.error.error;
          } else if (error.error?.message) {
            errorMessage = error.error.message;
          } else if (Array.isArray(error.error?.errors)) {
            errorMessage = error.error.errors.map((e: any) => e.message).join('\n');
          }
          
          this.modalState = ModalsController.openNotify(
            this.modalState,
            'Error',
            errorMessage
          );
          
          this.cdr.markForCheck();
        }
      });
  }

  onWalletSuccess(event: { totalAmount: number; note: string } | undefined) {
    if (!event || !event.totalAmount || !event.note) {
      this.modalState = ModalsController.closeWallet(this.modalState);
      this.cdr.markForCheck();
      return;
    }

    const data = event;
    const formData = new FormData();
    const details = this.modalState.paymentDetails;
    
    if (!details) {
      this.modalState = ModalsController.closeWallet(this.modalState);
      this.modalState = ModalsController.openNotify(
        this.modalState,
        'Error',
        'No se encontraron los detalles del pago.'
      );
      this.cdr.markForCheck();
      return;
    }

    formData.append('scheduleId', details.scheduleId);
    formData.append('memberId', this.userId.toString());
    formData.append('bonusType', 'CAR');
    
    const walletCommission = this.getCommissionForMethod('wallet');
    formData.append('paymentSubTypeId', walletCommission.subTypeId.toString());
    formData.append('paymentType', 'WALLET');
    formData.append('currencyType', 'USD');
    
    const totalAmount = parseFloat(data.totalAmount.toString().replace(/,/g, ''));
    formData.append('totalAmount', totalAmount.toString());

    formData.append('voucher.operationNumber', 'wallet');
    formData.append('voucher.note', data.note);

    this.modalState = ModalsController.closeWallet(this.modalState);
    this.isSubmitting = true;
    this.cdr.markForCheck();

    this.paymentService.makePayment(formData)
      .pipe(
        finalize(() => {
          this.isSubmitting = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: (response) => {
          this.modalState = ModalsController.openNotify(
            this.modalState,
            'Éxito',
            'Pago con Wallet registrado correctamente. Será revisado por el equipo.'
          );
          
          if (this.isGeneral) {
            this.getCarBonusScheduleGene();
          } else {
            this.getCarBonusSchedule();
          }
          
          this.cdr.markForCheck();
        },
        error: (error) => {
          let errorMessage = 'Ocurrió un error al registrar el pago con Wallet. Intenta nuevamente.';
          
          if (error.error?.error && Array.isArray(error.error.error)) {
            const messages = error.error.error.map((e: any) => e.message).join('\n');
            errorMessage = messages;
          } else if (error.error?.message) {
            errorMessage = error.error.message;
          }
          
          this.modalState = ModalsController.openNotify(
            this.modalState,
            'Error',
            errorMessage
          );
          
          this.cdr.markForCheck();
        }
      });
  }

  private loadWalletBalances(): void {
    if (!Number.isFinite(this.userId)) {
      this.walletAvailable = 0;
      this.walletAccounting = 0;
      this.modalState = ModalsController.openWallet(this.modalState);
      this.cdr.markForCheck();
      return;
    }

    this.walletLoading = true;
    this.cdr.markForCheck();

    this.walletService.getWalletById(this.userId)
      .pipe(
        finalize(() => {
          this.walletLoading = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: (data) => {
          this.walletAvailable = Number(data?.availableBalance) || 0;
          this.walletAccounting = Number(data?.accountingBalance) || 0;
          
          this.modalState = ModalsController.openWallet(this.modalState);
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.walletAvailable = 0;
          this.walletAccounting = 0;
          this.modalState = ModalsController.openWallet(this.modalState);
          this.cdr.markForCheck();
        }
      });
  }

  onTransferenciaSuccess(payload: any) {
    if (payload.mode === 'correction') {
      const formData = new FormData();
      formData.append('operationNumber', payload.operationNumber);
      formData.append('note', payload.note);
      formData.append('voucherFile', payload.image, payload.image.name);

      this.isSubmitting = true;
      this.cdr.markForCheck();

      this.paymentService.correctPayment(payload.paymentId, formData)
        .pipe(
          finalize(() => {
            this.isSubmitting = false;
            this.rejectedPaymentData = null; 
            this.cdr.markForCheck();
          })
        )
        .subscribe({
          next: (response) => {
            this.modalState = ModalsController.closeTransfer(this.modalState);
            this.modalState = ModalsController.openNotify(
              this.modalState,
              'Éxito',
              'Pago corregido y enviado a revisión correctamente.'
            );
            
            if (this.isGeneral) {
              this.getCarBonusScheduleGene();
            } else {
              this.getCarBonusSchedule();
            }
            
            this.cdr.markForCheck();
          },
          error: (error) => {
            let errorMessage = 'Ocurrió un error al corregir el pago. Intenta nuevamente.';
            
            if (error.error?.error && Array.isArray(error.error.error)) {
              const messages = error.error.error.map((e: any) => e.message).join('\n');
              errorMessage = messages;
            } else if (error.error?.message) {
              errorMessage = error.error.message;
            }
            
            this.modalState = ModalsController.closeTransfer(this.modalState);
            this.modalState = ModalsController.openNotify(
              this.modalState,
              'Error',
              errorMessage
            );
            
            this.cdr.markForCheck();
          }
        });
      
      return;
    }

    const formData = new FormData();
    const details = this.modalState.paymentDetails;
    
    formData.append('scheduleId', details.scheduleId);
    formData.append('memberId', this.userId.toString());
    formData.append('bonusType', 'CAR');

    const paymentTypeMap: Record<string, string> = {
      'bcp': 'BCP',
      'interbank': 'INTERBANK',
      'otrosMedios': 'OTHERS'
    };
    const paymentType = paymentTypeMap[this.modalState.transferBank] || 'OTHERS';
    formData.append('paymentType', paymentType);
    formData.append('paymentSubTypeId', payload.paymentSubTypeId.toString());
    formData.append('currencyType', payload.currencyType);

    const totalAmount = parseFloat(payload.totalAmount.replace(/,/g, ''));
    formData.append('totalAmount', totalAmount.toString());

    formData.append('voucher.operationNumber', payload.operationNumber);
    formData.append('voucher.note', payload.note);
    formData.append('voucher.image', payload.image, payload.image.name);

    this.isSubmitting = true;
    this.cdr.markForCheck();

    this.paymentService.makePayment(formData)
      .pipe(
        finalize(() => {
          this.isSubmitting = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: (response) => {
          this.modalState = ModalsController.closeTransfer(this.modalState);
          this.modalState = ModalsController.openNotify(
            this.modalState,
            'Éxito',
            'Pago registrado correctamente. Será revisado por el equipo.'             
          );
          if (this.isGeneral) {
            this.getCarBonusScheduleGene();
          } else {
            this.getCarBonusSchedule();
          }
          this.cdr.markForCheck();
        },
        error: (error) => {
          let errorMessage = 'Ocurrió un error al registrar el pago. Intenta nuevamente.';
          
          if (error.error?.error && Array.isArray(error.error.error)) {
            const messages = error.error.error.map((e: any) => e.message).join('\n');
            errorMessage = messages;
          }
          
          this.modalState = ModalsController.closeTransfer(this.modalState);
          this.modalState = ModalsController.openNotify(
            this.modalState,
            'Error',
            errorMessage
          );
          this.cdr.markForCheck();
        }
      });
  }

  translate(status: string): string {
    switch (status) {
      case PaymentStatus.PENDING:
        return 'Pendiente';
      case PaymentStatus.COMPLETED:
        return 'Pagado';
      case PaymentStatus.FAILED:
        return 'Fallido';
      case PaymentStatus.PENDING_REVIEW:
        return 'Pendiente de Revisión';
      case PaymentStatus.REJECTED:
        return 'Rechazado';
      default:
        return 'Desconocido';
    }
  }

  getConcepto(row: ICarBonusScheduleContent): string {
    const text = row.isInitial === true ?
      `Inicial fraccionada ${row.installmentNum}` : `Cuota N° ${row.installmentNum}`;
    return text;
  }

  formatDateArrayToString(dateArray: number[] | null): string {
    if (!Array.isArray(dateArray) || dateArray.length < 3) return '';
    const [year, month, day] = dateArray;
    const dd = String(day).padStart(2, '0');
    const mm = String(month).padStart(2, '0');
    return `${dd}/${mm}/${year}`;
  }

  getClassification() {
    this._myAwardsService.completeCarBonusList();
    this.openModalCarBonus({} as IRankBonusData[]);
    const userId = this.userInfoService.userInfo.id;
    this.classificationsService.getClassification(userId).subscribe({
      next: (response) => {
        this._myAwardsService.setCarBonusList(response.data);
      },
      error: (error) => { console.error('Error fetching document:', error); }
    });
  }

  openModalCarBonus(data: IRankBonusData[]) {
    this.dialogRef = this.dialogService.open(ModalCarBonusComponent, {
      data: data
    });
    this.dialogRef.onClose.subscribe(() => {
    });
  }

  downloadSchedule() {
    const id = this._myAwardsService.getCarAssinmentId;
    this._carBonusScheduleService.exportSchedule(id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'cronograma_general.xlsx';
        a.click();

        // Liberar el objeto URL
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Error al exportar los datos:', err);
      },
    });
  }

}
