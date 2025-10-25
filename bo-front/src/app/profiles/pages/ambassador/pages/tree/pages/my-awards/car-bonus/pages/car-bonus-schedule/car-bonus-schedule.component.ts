import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  ScheduleType,
  AssignedInfo,
  CountersGeneral,
  CountersInicial,
  DatesGeneral,
  DatesInicial
} from './car-bonus-schedule.types';
import { scheduleGeneralMock } from './data/schedule-general.mock';
import { scheduleInicialMock } from './data/schedule-inicial.mock';
import { FilterGenericComponent, FilterExtraButton, FilterGenericConfig } from '@shared/components/filters/filter-generic/filter-generic.component';
import { TableGenericComponent } from '@shared/components/tables/table-generic/table-generic.component';
import { mockCronogramaGeneral } from './mock/mockCronogramaGeneral';
import { mockCronogramaInicial } from './mock/mockCronogramaInicial';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';
import { ModalNotifyComponent } from '@shared/components/modal/modal-notify/modal-notify.component';

// Modales hijos
import { PaymentsModalComponent } from '../../../componentes/modals/payments-modal/payments-modal.component';
import { WalletModalComponent } from 'src/app/init-app/pages/purchase-checkout/components/payment-modals/wallet-modal/wallet-modal.component';
import { TransferenciaModalComponent } from 'src/app/init-app/pages/purchase-checkout/components/payment-modals/transferencia-modal/transferencia-modal.component';
import { DialogService } from 'primeng/dynamicdialog';
import { ModalPaymentPaypalComponent } from 'src/app/profiles/pages/ambassador/pages/new-partner/pages/new-partner-payment/commons/modals/modal-payment-paypal/modal-payment-paypal.component';

// Controlador de modales centralizado
import { createModalState, ModalsController, ModalState, BankMethod } from './car-bonus-schedule.modals';
import { CarBonusScheduleService } from '../service/car-bonus-schedule.service';
import { MyAwardsService } from '../../../components/service/my-awards.service';
import { ICarBonusScheduleContent } from '../../interface/car-bonus-schedule';
import { PaymentStatus } from './data/paymentStatus';
import { ICarBonusScheduleExtraData, ICarBonusScheduleExtraResponse } from '../../interface/car-bonus-schedule-extra';

import { IExchangeRate, ModalPaymentService } from 'src/app/profiles/pages/ambassador/pages/new-partner/pages/new-partner-payment/commons/sevices/modal-payment.service';
import { OperationTypeService } from 'src/app/init-app/pages/purchase-checkout/services/operation-type.service';

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
    TransferenciaModalComponent
  ],
  templateUrl: './car-bonus-schedule.component.html',
  styleUrls: ['./car-bonus-schedule.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService]
})
export class CarBonusScheduleComponent implements OnInit {
  proformaId!: number;
  tipo: ScheduleType = 'general';

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

  // Estado de modales 
  modalState: ModalState = createModalState();

  constructor(
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private dialogService: DialogService,
    private _carBonusScheduleService: CarBonusScheduleService,
    private _myAwardsService: MyAwardsService,
    private operationTypeService: OperationTypeService,
    private modalPaymentService: ModalPaymentService

  ) { }

  get isInicial() { return this.tipo === 'inicial'; }
  get isGeneral() { return this.tipo === 'general'; }
  get pageTitle() { return this.isInicial ? 'Cronograma Inicial' : 'Cronograma General'; }

  ngOnInit(): void {
    const pId = this.route.snapshot.paramMap.get('proformaId');
    const t = (this.route.snapshot.paramMap.get('tipo') || '').toLowerCase();
    this.proformaId = pId ? +pId : 0;
    this.tipo = (t === 'inicial' || t === 'general') ? (t as ScheduleType) : 'general';
    
    this.getScheduleExtra();
    this.filterValues = this.isGeneral ? { cuotas: '', estado: '' } : {};
    
    this.loadPaymentTypes();
    this.loadExchangeRate();
    
    this.loadData();
    this.cdr.markForCheck();
  }

  private loadData() {
    if (this.isGeneral) {
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
        'Estado',
        'Acciones'
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

      // this.tableData = mockCronogramaGeneral.map(r => ({ ...r }));
      this.tableColumnWidths = ['12%', '17%', '12%', '8%', '12%', '12%', '12%', '10%', '4%'];
      this.applyFilters();
    } else {
      // this.assigned = scheduleInicialMock.assigned;
      // this.countersInicial = scheduleInicialMock.counters;
      // this.datesInicial = scheduleInicialMock.dates;
      this.getCarBonusSchedule();
      this.tableColumns = [
        'Fecha registro pago', 
        'Concepto', 
        'Monto a pagar (USD)', 
        'Fecha límite pago', 
        'Estado',
        'Acciones'
      ];
      this.tableKeys = [
        'paymentDate', 
        'concepto', 
        'memberAssumedPayment', 
        'dueDate', 
        'statusName'
      ];
      this.tableColumnWidths = ['20%', '20%', '15%', '15%', '15%', '15%'];
    }
  }

  private loadPaymentTypes(): void {
    console.log('🔵 Cargando tipos de pago...');
    this.operationTypeService.getOperationTypes().subscribe({
      next: (types) => {
        this.paymentTypes = types;
      },
      error: (err) => {
        console.error('Error al cargar tipos de pago:', err);
      }
    });
  }
  private loadExchangeRate(): void {
    console.log('🔵 Cargando tipo de cambio...');
    this.modalPaymentService.getTipoCambio().subscribe({
      next: (exchangeRate) => {
        this.exchangeRateData = exchangeRate;
        this.cdr.markForCheck();
      },
      error: (err) => {
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
  private get currentExchangeRate(): number {
    return this.exchangeRateData?.sale || 3.47;
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
    const activeSubTypes = paymentType.paymentSubTypeList.filter(sub => sub.statusSoles === true);
    const defaultSubType = activeSubTypes.length > 0 ? activeSubTypes[0] : paymentType.paymentSubTypeList[0];
    
    return {
      commissionSoles: defaultSubType.commissionSoles || 0,
      commissionDollars: defaultSubType.commissionDollars || 0,
      ratePercentage: defaultSubType.ratePercentage || 0,
      subTypeId: defaultSubType.idPaymentSubType || 0
    };
  }
  private calculatePaymentDetails(row: ICarBonusScheduleContent, methodKey: string = 'bcp') {
    const amountUSD = row.memberAssumedPayment || row.total || 0;
    const exchangeRate = this.exchangeRateData?.buys || 3.445;
    const amountPEN = amountUSD * exchangeRate;
    
    const { commissionSoles, commissionDollars, ratePercentage, subTypeId } = this.getCommissionForMethod(methodKey);
    
    let totalCommission = 0;
    
    if (commissionSoles > 0) {
      totalCommission = commissionSoles;
    } else if (commissionDollars > 0) {
      totalCommission = commissionDollars * exchangeRate;
    }
    
    if (ratePercentage > 0) {
      totalCommission += (amountPEN * ratePercentage) / 100;
    }
    
    const totalPEN = amountPEN + totalCommission;

    return {
      amountUSD: Number(amountUSD.toFixed(2)),
      amountPEN: Number(amountPEN.toFixed(2)),
      exchangeRate: Number(exchangeRate.toFixed(3)),
      commission: Number(totalCommission.toFixed(2)),
      totalPEN: Number(totalPEN.toFixed(2)),
      concept: row.concepto || `Cuota N° ${row.installmentNum}`,
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
      this._carBonusScheduleService.getCarBonusSchedule(id, 0, 10).subscribe(response => {
        this.tableData = response.data.content;
        this.displayedTableData = response.data.content.map(r => ({
          ...r,
          statusName: this.translate(r.status.name),
          concepto: this.getConcepto(r)
        }));
        this.cdr.markForCheck();
      });
    }
  }

  getCarBonusScheduleGene(): void {
    if (this._myAwardsService.getCarAssinmentId) {
      const id = this._myAwardsService.getCarAssinmentId;
      this._carBonusScheduleService.getCarBonusScheduleGene(id, 0, 10).subscribe(response => {
        this.tableData = response.data.content;
        this.displayedTableData = response.data.content.map(r => ({
          ...r,
          statusName: this.translate(r.status.name),
          concepto: this.getConcepto(r)
        }));
        this.cdr.markForCheck();
      });
    }
  }

  getScheduleExtra(): void {
    const id = this._myAwardsService.getCarAssinmentId;
    this._carBonusScheduleService.getScheduleExtra(id).subscribe(response => {
      if (this.isGeneral) {
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
  private getCuotaNumero(concepto: string | undefined): number | null {
    if (!concepto) return null;
    const m = concepto.match(/Cuota\s*N°\s*(\d+)/i);
    if (!m) return null;
    const n = parseInt(m[1], 10);
    return isNaN(n) ? null : n;
  }

  private applyFilters(): void {
    if (this.isInicial) return;

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
    if (btn.key === 'exportar') alert('Exportando datos...');
    if (btn.key === 'limpiar') this.filterValues = {};
  }

  private createPayButton(row: ICarBonusScheduleContent): string {
    const isDisabled = row.statusName === 'Pagado' || row.statusName === 'Pendiente de Revisión';
    const disabledAttr = isDisabled ? 'disabled' : '';
    const disabledClass = isDisabled ? 'disabled' : '';
    
    return `
      <button 
        class="btn-pagar ${disabledClass}" 
        ${disabledAttr}
        onclick="window.paymentAction('${row.id}')">
        <i class="bi bi-credit-card-fill"></i> PAGAR
      </button>
    `;
  }

  isPayable(row: ICarBonusScheduleContent): boolean {
    return row?.status?.name === 'PENDING';
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
    const paymentDetails = this.calculatePaymentDetails(row, 'bcp');

    this.modalState = ModalsController.openPayments(
      this.modalState,
      [row.id],
      paymentDetails
    );
    
    this.cdr.markForCheck();
  }
  
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
      this.modalState = ModalsController.openWallet(this.modalState);
    } else if (method === 'bcp') {
      this.modalState = ModalsController.openTransfer(this.modalState, 'bcp');
    } else if (method === 'interbank') {
      this.modalState = ModalsController.openTransfer(this.modalState, 'interbank');
    } else if (method === 'otros') {
      this.modalState = ModalsController.openTransfer(this.modalState, 'otrosMedios');
    } else if (method === 'paypal') {
      const commissionData = this.getCommissionForMethod(method);
      
      const dataToModal: any = {
        description: paymentDetails.concept,
        amount: paymentDetails.amountUSD,
        ratePercentage: commissionData.ratePercentage,
        commissionDollars: commissionData.commissionDollars,
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
          if (paypalPayload) {
            this.modalState = ModalsController.openNotify(
              this.modalState,
              'Éxito',
              'Pago con PayPal registrado correctamente.'
            );
            this.cdr.markForCheck();
          }
        });
    }
    
    this.cdr.markForCheck();
  }
    onModalClosed(kind: keyof ModalState) {
    if (kind === 'showNotify') this.modalState = ModalsController.closeNotify(this.modalState);
    if (kind === 'showPayments') this.modalState = ModalsController.closePayments(this.modalState);
    if (kind === 'showWallet') this.modalState = ModalsController.closeWallet(this.modalState);
    if (kind === 'showTransfer') this.modalState = ModalsController.closeTransfer(this.modalState);
    this.cdr.markForCheck();
  }

  // Éxitos
  onWalletSuccess() {
    this.modalState = ModalsController.closeWallet(this.modalState);
    this.modalState = ModalsController.openNotify(this.modalState, 'Éxito', 'Pago con Wallet registrado correctamente.');
    this.cdr.markForCheck();
  }

  onTransferenciaSuccess(payload: any) {
    this.modalState = ModalsController.closeTransfer(this.modalState);
    this.modalState = ModalsController.openNotify(this.modalState, 'Éxito', 'Pago por transferencia registrado correctamente.');
    this.cdr.markForCheck();
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
    const text = row.installmentNum === 1 && row.isInitial === true ?
      `Inicial fraccionada ${row.installmentNum}` : `Cuota N° ${row.installmentNum}`;
    return text;
  }

  formatDateArrayToString(dateArray: number[]): string {
    if (!Array.isArray(dateArray) || dateArray.length < 3) return '';

    const [year, month, day] = dateArray;
    const dd = String(day).padStart(2, '0');
    const mm = String(month).padStart(2, '0');
    return `${dd}/${mm}/${year}`;
  }

}
