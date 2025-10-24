import { Component } from '@angular/core';
import { paymentsAndComissionsNavigation } from '../../commons/mocks/mock';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { NavigationComponent } from '@shared/components/navigation/navigation.component';
import { ArrayDatePipe } from '@shared/pipe/array-date.pipe';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SkeletonModule } from 'primeng/skeleton';
import { Router } from '@angular/router';
import { TablePrizeComponent } from './components/table-prize/table-prize.component';

@Component({
  selector: 'app-prize',
  standalone: true,
  imports: [
    CommonModule,
    NavigationComponent,
    MatIconModule,
    SkeletonModule,
    ProgressSpinnerModule,
    TablePrizeComponent,
    ArrayDatePipe
  ],
  templateUrl: './prize.component.html',
  styleUrl: './prize.component.scss'
})
export class PrizeComponent {
  public navigation = paymentsAndComissionsNavigation;
  public currentTab = 5;
  totalRecords: number = 0;

  constructor(private router: Router
  ) {
  }

  public onNavigate(id: number) {
    if (id === 1) this.router.navigate(['/profile/ambassador/payments']);
    if (id === 2) this.router.navigate(['/profile/ambassador/payments/wallet']);
    if (id === 3) this.router.navigate(['/profile/ambassador/payments/conciliation']);
    if (id === 4) this.router.navigate(['/profile/ambassador/payments/rent']);
    if (id === 5) this.router.navigate(['/profile/ambassador/payments/prize']);
  }

  onPageChange(event: any): void {
    const page = event.page + 1;
    const rows = event.rows;
  }

  onRefresh(event: any): void {
    const rows = event.rows;
  }

}
