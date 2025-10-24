import { CommonModule, DecimalPipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NavigationComponent } from '@shared/components/navigation/navigation.component';
import { paymentsAndComissionsNavigation } from '../../commons/mocks/mock';
import { Router } from '@angular/router';
import { TableConciliationComponent } from './commons/components/table-conciliation/table-conciliation.component';
import { DialogService } from 'primeng/dynamicdialog';
import { ConciliationService } from './commons/services/conciliation.service';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';
import { ArrayDatePipe } from '@shared/pipe/array-date.pipe';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-conciliation',
  standalone: true,
  imports: [
    CommonModule,
    NavigationComponent,
    MatIconModule,
    SkeletonModule,
    ProgressSpinnerModule,
    TableConciliationComponent,
    ArrayDatePipe
  ],
  providers: [DialogService, DecimalPipe],
  templateUrl: './conciliation.component.html',
  styleUrl: './conciliation.component.scss'
})
export class ConciliationComponent {
  public navigation = paymentsAndComissionsNavigation;
  public currentTab = 3;
  tableData: any[] = [];
  tableLoading: boolean = false;
  subTableData: any[] = [];
  conciliationId: number;
  selected: boolean = null;
  userId: any;

  constructor(private router: Router, private conciliationService: ConciliationService,
    private userInfoService: UserInfoService
  ) {
    this.userId = this.userInfoService.userInfo.id;
    this.getData();
  }

  getData() {
    this.tableLoading = true;
    this.conciliationService.getConciliationsByUserId(this.userId).subscribe({
      next: (result) => {
        this.tableData = result.data;
        this.tableData.forEach(item => item.amount = '...');
        this.tableLoading = false;
      }
    });
  }

  public onNavigate(id: number) {
    if (id === 1) this.router.navigate(['/profile/ambassador/payments']);
    if (id === 2) this.router.navigate(['/profile/ambassador/payments/wallet']);
    if (id === 3) this.router.navigate(['/profile/ambassador/payments/conciliation']);
    if (id === 4) this.router.navigate(['/profile/ambassador/payments/rent']);
    if (id === 5) this.router.navigate(['/profile/ambassador/payments/prize']);
  }

  onSelectedConciliation(data: any): void {
    this.selected = false;
    this.conciliationService.getDetailForConciliationId(data.id).subscribe({
      next: (result) => {
        this.conciliationId = data.id;
        this.subTableData = [];
        this.selected = true;
        this.subTableData = result.data;
        const totalAmount = this.subTableData.length
          ? this.subTableData
            .filter(item => item.idConciliation === data.id)
            .reduce((sum, item) => sum + item.amount, 0)
          : '...';
        const targetItem = this.tableData.find(item => item.id === data.id);
        if (targetItem) {
          targetItem.amount = totalAmount.toFixed(2);
        }
      }
    });
  }

}
