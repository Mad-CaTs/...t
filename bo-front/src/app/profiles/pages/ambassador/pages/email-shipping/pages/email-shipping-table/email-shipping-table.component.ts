import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { TableComponent } from '@shared/components/table/table.component';
import { PaginationNgPrimeComponent } from '@shared/components/pagination-ng-prime/pagination-ng-prime.component';
import { EmailShippingTablePresenter } from '../../email-shipping.presenter';
import { IUserListTable } from '../../commons/interfaces';
import { Router } from '@angular/router';
import { EmailService } from '../../commons/services/email/email.service';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';
import { ArrayDatePipe } from '@shared/pipe/array-date.pipe';
import { EmailRateLimitModalComponent } from '../email-shipping-type/commons/modals/email-rate-limit/email-rate-limit-modal.component';
import { DialogService } from 'primeng/dynamicdialog';
import { TablePaginationService } from '@shared/services/table-pagination.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-email-shipping-table',
  standalone: true,
  imports: [
    CommonModule,
    AutoCompleteModule,
    TableComponent,
    PaginationNgPrimeComponent,
    ArrayDatePipe,
    FormsModule
  ],
  providers: [EmailShippingTablePresenter],
  templateUrl: './email-shipping-table.component.html'
})
export class EmailShippingTableComponent implements OnInit {
  form: FormGroup;
  isLoading: boolean = false;
  rows: number = 10;
  totalRecords: number = 0;
  currentPage: number = 1;
  align: string = 'right';
  public first: number = 0;
  @Output() pageChange: EventEmitter<any> = new EventEmitter();
  @Output() refresh: EventEmitter<any> = new EventEmitter();
  public filteredData: IUserListTable[] = [];
  public displayedData: IUserListTable[] = [];
  userInfoId: number;
  selectedSubscriptions: { [userId: number]: number } = {};
  lastEmailSentAt: Date | null = null;
  private id: string = '';
  suggestions: IUserListTable[] = [];
  selectedUser: IUserListTable | null = null;

  constructor(
    private fb: FormBuilder,
    private emailShippingTablePresenter: EmailShippingTablePresenter,
    private router: Router,
    private emailService: EmailService,
    private userInfoService: UserInfoService,
    private dialogService: DialogService,
    private tableService: TablePaginationService
  ) {
    this.userInfoId = this.userInfoService.userInfo.id;
    this.id = this.tableService.addTable(this.displayedData, this.rows);
  }

  ngOnInit(): void {
    this.form = this.emailShippingTablePresenter.form;
  }

  getInitials(name?: string, lastName?: string): string {
    const n = name?.charAt(0) ?? '';
    const l = lastName?.charAt(0) ?? '';
    return (n + l).toUpperCase();
  }

  searchUsers(event: { query: string }): void {
    const searchTerm = event.query.trim();
    if (searchTerm.length < 2) {
      this.suggestions = [];
      return;
    }

    this.isLoading = true;
    this.emailService.getListUsersBySponsor(this.userInfoId, searchTerm).subscribe({
      next: (res) => {
        this.suggestions = res.map(user => ({
          ...user,
          displayName: `${user.username} - ${user.name} ${user.lastName}`
        })) || [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al buscar usuarios:', err);
        this.suggestions = [];
        this.isLoading = false;
      }
    });
  }

  onUserSelect(event: { value: IUserListTable }): void {
    this.selectedUser = event.value;
    // Removed filterUsers() call here to prevent automatic loading
  }

  onClearUser(): void {
    this.selectedUser = null;
    this.filteredData = [];
    this.displayedData = [];
    this.totalRecords = 0;
    this.tableService.updateTable(this.displayedData, this.id, this.rows);
  }

  filterUsers(): void {
    if (!this.selectedUser) {
      this.filteredData = [];
      this.displayedData = [];
      this.totalRecords = 0;
      this.tableService.updateTable(this.displayedData, this.id, this.rows);
      return;
    }

    this.currentPage = 1;
    this.isLoading = true;
    this.emailService.getListUsersBySponsor(this.userInfoId, this.selectedUser.username).subscribe({
      next: (res) => {
        this.filteredData = res || [];
        this.totalRecords = this.filteredData.length;
        this.updateDisplayedData();
        this.tableService.updateTable(this.displayedData, this.id, this.rows);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al obtener usuarios:', err);
        this.filteredData = [];
        this.displayedData = [];
        this.totalRecords = 0;
        this.isLoading = false;
      }
    });
  }

  loadUsersBySponsor(searchTerm: string = ''): void {
    this.isLoading = true;
    this.emailService.getListUsersBySponsor(this.userInfoId, searchTerm).subscribe({
      next: (res) => {
        this.filteredData = res || [];
        this.totalRecords = this.filteredData.length;
        this.updateDisplayedData();
        this.tableService.updateTable(this.displayedData, this.id, this.rows);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al obtener usuarios:', err);
        this.filteredData = [];
        this.displayedData = [];
        this.totalRecords = 0;
        this.isLoading = false;
      }
    });
  }

  onSelectionChange(selection: { content: string; value: number }, userId: number): void {
    this.selectedSubscriptions[userId] = selection.value;
    sessionStorage.setItem('selectedSubscriptionId', JSON.stringify(selection.value));
  }

  sendEmail(userWithSubscription: any): void {
    sessionStorage.setItem('selectedUser', JSON.stringify(userWithSubscription));
    sessionStorage.setItem('selectedSubscription', JSON.stringify(userWithSubscription.idSuscription));
    this.router.navigate(['/profile/ambassador/email-shipping/email-shipping-type']);
  }

  get headers() {
    const result = ['Usuario', 'Suscripción', 'Fecha', 'Acciones'];
    return result;
  }

  get minWidthHeaders() {
    const result = [120, 50, 20, 100];
    return result;
  }

  onPageChange(event: any): void {
    this.isLoading = true;
    this.currentPage = event.page + 1;
    this.rows = event.rows;
    this.updateDisplayedData();
    this.pageChange.emit({ page: this.currentPage, rows: this.rows });
    this.tableService.updateTable(this.displayedData, this.id, this.rows);
    this.isLoading = false;
  }

  onRefresh(event: any): void {
    this.isLoading = true;
    this.rows = event.rows || this.rows;
    this.currentPage = 1;
    if (this.selectedUser) {
      this.loadUsersBySponsor(this.selectedUser.username);
    } else {
      this.filteredData = [];
      this.displayedData = [];
      this.totalRecords = 0;
      this.tableService.updateTable(this.displayedData, this.id, this.rows);
    }
    this.refresh.emit({ rows: this.rows });
    this.isLoading = false;
  }

  private updateDisplayedData(): void {
    const startIndex = (this.currentPage - 1) * this.rows;
    const endIndex = startIndex + this.rows;
    this.displayedData = this.filteredData.slice(startIndex, endIndex);
  }

  openRejectModal() {
    this.dialogService.open(EmailRateLimitModalComponent, {
      width: '40vw',
      closable: true,
      dismissableMask: true,
      contentStyle: {
        padding: '0.5rem 1rem'
      }
    });
  }
}
