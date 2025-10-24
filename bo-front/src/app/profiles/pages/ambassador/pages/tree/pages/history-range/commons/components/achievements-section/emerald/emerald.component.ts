import { Component, EventEmitter, Input, Output, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { PaginationNgPrimeComponent } from '@shared/components/pagination-ng-prime/pagination-ng-prime.component';
import { TableComponent } from '@shared/components/table/table.component';
import { TablePaginationService } from '@shared/services/table-pagination.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalDetailScheduleAutoBonusComponent } from './modals/modal-detail-schedule-auto-bonus/modal-detail-schedule-auto-bonus.component';
import { ModalDetailViewAwardComponent } from './modals/modal-detail-view-award/modal-detail-view-award.component';
import { PaymentScheduleApiService } from '../../../services/payment-schedule.service';
import { PartnerBonusApiService } from '../../../services/partner-bonus.service';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';
import { PaymentSchedule } from '../../../interfaces/payment-schedule.interface';
import { PartnerBonus } from '../../../interfaces/partner-bonus.interface';
import { Subscription } from 'rxjs';
import type { IResponseData } from '@shared/interfaces/api-request';

@Component({
  selector: 'app-emerald',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    PaginationNgPrimeComponent,
    TableComponent,
    ReactiveFormsModule
  ],
  templateUrl: './emerald.component.html',
  styleUrl: './emerald.component.scss'
})
export class EmeraldComponent implements OnInit, OnDestroy, OnChanges {
  @Input() bonusData: PartnerBonus | null = null; // Input to receive bonusData from parent
  @Output() goBack = new EventEmitter<void>();
  @Output() pageChange = new EventEmitter<any>();
  @Output() refresh = new EventEmitter<any>();
  @Output() refreshTreeEvent = new EventEmitter<void>();
  @Output() openValueChange = new EventEmitter<boolean>();

  tableData: PaymentSchedule[] = [];
  displayedTableData: PaymentSchedule[] = [];
  totalRecords: number = 0;
  rows: number = 10;
  currentPage: number = 1;
  isLoading: boolean = true;
  paymentSchedulesLoaded: boolean = false;
  id: string = '';
  selected: FormControl = new FormControl(null);
  partnerBonus: PartnerBonus | null = null;
  headers: string[] = [
    'Fecha',
    'Concepto',
    'Valor de Cuota / Financiamiento Neto',
    'Seguro (USD)',
    'Inicial Fraccionada',
    'Inicial Empresa',
    'Gps (USD)',
    'Bono Rango',
    'Pago Asumido Por el Socio',
    'Estado'
  ];
  minWidthHeaders: number[] = [80, 110, 160, 40, 100, 110, 50, 50, 120, 10];
  private subscription: Subscription = new Subscription();

  constructor(
    private tableService: TablePaginationService,
    private modalService: NgbModal,
    private paymentScheduleApiService: PaymentScheduleApiService,
    private partnerBonusApiService: PartnerBonusApiService,
    private userInfoService: UserInfoService
  ) {
    this.id = this.tableService.addTable(this.displayedTableData, this.rows);
  }

  ngOnInit(): void {
    const fullName = this.userInfoService.userInfo.headerName || 'Unknown User';
    // Use bonusData if provided, otherwise fetch partnerBonus
    if (this.bonusData) {
      this.partnerBonus = this.bonusData;
      this.fetchPaymentSchedules(this.partnerBonus.id);
    } else {
      this.fetchGetByFullName(fullName);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tableData']) {
      this.updateDisplayedData();
      this.tableService.updateTable(this.displayedTableData, this.id, this.rows);
      this.isLoading = false;
    }
    if (changes['bonusData'] && this.bonusData) {
      this.partnerBonus = this.bonusData;
      this.fetchPaymentSchedules(this.bonusData.id);
    }
  }

  ngOnDestroy(): void {
    this.tableService.deleteTable(this.id);
    this.subscription.unsubscribe();
  }

  private fetchGetByFullName(fullName: string): void {
    this.isLoading = true;
    this.paymentSchedulesLoaded = false;
    this.currentPage = 1;
    this.subscription.add(
      this.partnerBonusApiService.fetchGetByFullName(fullName).subscribe({
        next: (response: IResponseData<PartnerBonus[]>) => {
          const partnerBonuses = response.data || [];
          if (partnerBonuses.length === 0) {
            console.warn('No PartnerBonus found for fullName:', fullName);
            this.tableData = [];
            this.displayedTableData = [];
            this.totalRecords = 0;
            this.partnerBonus = null;
            this.isLoading = false;
            this.paymentSchedulesLoaded = true;
            return;
          }

          this.partnerBonus = partnerBonuses[0];
          this.fetchPaymentSchedules(this.partnerBonus.id);
        },
        error: (error) => {
          console.error('Error fetching partner bonus by full name:', error);
          this.tableData = [];
          this.displayedTableData = [];
          this.totalRecords = 0;
          this.partnerBonus = null;
          this.isLoading = false;
          this.paymentSchedulesLoaded = true;
        }
      })
    );
  }

  private fetchPaymentSchedules(partnerBonusId: number): void {
    this.subscription.add(
      this.paymentScheduleApiService.fetchGetByPartnerBonusId(partnerBonusId).subscribe({
        next: (response: IResponseData<PaymentSchedule[]>) => {
          const rawData = response.data || [];
          this.tableData = rawData
            .sort((a, b) => {
              const aDesc = a.description.toLowerCase();
              const bDesc = b.description.toLowerCase();
              if (aDesc === 'inicial fraccionada 1') return -1;
              if (bDesc === 'inicial fraccionada 1') return 1;
              if (aDesc === 'inicial fraccionada 2') return -1;
              if (bDesc === 'inicial fraccionada 2') return 1;
              const aNum = parseInt(aDesc.match(/\d+/)?.[0] || '0');
              const bNum = parseInt(bDesc.match(/\d+/)?.[0] || '0');
              return aNum - bNum;
            });

          this.totalRecords = this.tableData.length;
          this.updateDisplayedData();
          this.tableService.updateTable(this.displayedTableData, this.id, this.rows);
          this.selected.setValue(this.displayedTableData[0]?.id || null);
          this.isLoading = false;
          this.paymentSchedulesLoaded = true;
        },
        error: (error) => {
          console.error('Error fetching payment schedules:', error);
          this.tableData = [];
          this.displayedTableData = [];
          this.totalRecords = 0;
          this.isLoading = false;
          this.paymentSchedulesLoaded = true;
        }
      })
    );
  }

  private updateDisplayedData(): void {
    const startIndex = (this.currentPage - 1) * this.rows;
    const endIndex = startIndex + this.rows;
    this.displayedTableData = this.tableData.slice(startIndex, endIndex);
  }

  onPageChange(event: any): void {
    this.isLoading = true;
    this.currentPage = event.page + 1;
    this.rows = event.rows;
    this.updateDisplayedData();
    this.pageChange.emit({ page: this.currentPage, rows: this.rows });
    this.tableService.updateTable(this.displayedTableData, this.id, this.rows);
    this.isLoading = false;
  }

  onRefresh(event: any): void {
    this.isLoading = true;
    this.paymentSchedulesLoaded = false;
    this.rows = event.rows;
    this.currentPage = 1;
    const fullName = this.userInfoService.userInfo.headerName || 'Unknown User';
    if (this.bonusData) {
      this.partnerBonus = this.bonusData;
      this.fetchPaymentSchedules(this.bonusData.id);
    } else {
      this.fetchGetByFullName(fullName);
    }
    this.refresh.emit({ rows: this.rows });
  }

  refreshTree(): void {
    this.refreshTreeEvent.emit();
  }

  onChangeOpenValue(value: boolean): void {
    this.openValueChange.emit(value);
    if (value) {
      const modalRef = this.modalService.open(ModalDetailViewAwardComponent);
      modalRef.componentInstance.awardData = {
        fullName: this.userInfoService.userInfo.headerName,
        assignmentDate: this.partnerBonus ? this.formatAssignmentDate(this.partnerBonus.assignmentDate) : ''
      };
    } else {
      const selectedTransaction = this.displayedTableData.find(d => d.id === this.selected.value);
      if (selectedTransaction) {
        const modalRef = this.modalService.open(ModalDetailScheduleAutoBonusComponent);
        modalRef.componentInstance.transactionData = {
          paymentScheduleId: selectedTransaction.id,
          status: selectedTransaction.status,
          date: selectedTransaction.date
        };
        modalRef.componentInstance.paymentConfirmed.subscribe((updatedSchedule: PaymentSchedule) => {
          const index = this.tableData.findIndex(d => d.id === updatedSchedule.id);
          if (index !== -1) {
            this.tableData[index] = { ...this.tableData[index], ...updatedSchedule };
            const displayIndex = this.displayedTableData.findIndex(d => d.id === updatedSchedule.id);
            if (displayIndex !== -1) {
              this.displayedTableData[displayIndex] = { ...this.displayedTableData[displayIndex], ...updatedSchedule };
              this.tableService.updateTable(this.displayedTableData, this.id, this.rows);
            }
          }
        });
      }
    }
  }

  formatAssignmentDate(dateArray: [number, number, number]): string {
    const [year, month, day] = dateArray;
    return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
  }

  calculateEndDate(dateArray: [number, number, number], installmentQuantity: number): string {
    const [year, month, day] = dateArray;
    const startDate = new Date(year, month - 1, day); // month is 0-based in JS Date
    startDate.setMonth(startDate.getMonth() + installmentQuantity);
    const endDay = startDate.getDate().toString().padStart(2, '0');
    const endMonth = (startDate.getMonth() + 1).toString().padStart(2, '0');
    const endYear = startDate.getFullYear();
    return `${endDay}/${endMonth}/${endYear}`;
  }

  getEndDate(): string {
    if (this.tableData.length > 0) {
      // Sort tableData to ensure we get the last payment schedule date
      const sortedData = [...this.tableData].sort((a, b) => {
        const aDesc = a.description.toLowerCase();
        const bDesc = b.description.toLowerCase();
        if (aDesc === 'inicial fraccionada 1') return -1;
        if (bDesc === 'inicial fraccionada 1') return 1;
        if (aDesc === 'inicial fraccionada 2') return -1;
        if (bDesc === 'inicial fraccionada 2') return 1;
        const aNum = parseInt(aDesc.match(/\d+/)?.[0] || '0');
        const bNum = parseInt(bDesc.match(/\d+/)?.[0] || '0');
        return aNum - bNum;
      });
      // Get the date of the last payment schedule
      const lastDate = new Date(sortedData[sortedData.length - 1].date);
      const day = lastDate.getDate().toString().padStart(2, '0');
      const month = (lastDate.getMonth() + 1).toString().padStart(2, '0');
      const year = lastDate.getFullYear();
      return `${day}/${month}/${year}`;
    } else if (this.partnerBonus) {
      // Fallback to original calculation if no payment schedules are available
      return this.calculateEndDate(this.partnerBonus.assignmentDate, this.partnerBonus.installmentQuantity);
    }
    return ''; // Return empty string if no partnerBonus or tableData
  }
}
