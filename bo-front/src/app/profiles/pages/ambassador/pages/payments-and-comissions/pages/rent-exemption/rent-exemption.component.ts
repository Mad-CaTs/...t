import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NavigationComponent } from '@shared/components/navigation/navigation.component';
import { Router } from '@angular/router';
import { paymentsAndComissionsNavigation } from '../../commons/mocks/mock';
import { TableRentExemptionComponent } from './components/table-rent-exemption/table-rent-exemption.component';
import { DialogService } from 'primeng/dynamicdialog';
import { RentExemptionService } from './services/rent-exemption.service';
import { ITableRentExemption } from './interfaces/rentExemption';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';

@Component({
  selector: 'app-rent-exemption',
  standalone: true,
  imports: [
    CommonModule,
    NavigationComponent,
    MatIconModule,
    TableRentExemptionComponent
  ],
  providers: [DialogService],
  templateUrl: './rent-exemption.component.html',
  styleUrl: './rent-exemption.component.scss'
})
export class RentExemptionComponent implements OnInit {
  public navigation = paymentsAndComissionsNavigation;
  public currentTab = 4;
  rentExemptions: any[] = [];
  totalRecords: number = 0;
  userInfo: any;

  constructor(private router: Router, private rentExemptionService: RentExemptionService, private userInfoService: UserInfoService
    , private cdr: ChangeDetectorRef
  ) {
    this.userInfo = this.userInfoService.userInfo;
  }

  ngOnInit(): void {
    this.loadData(1, 10);
  }

  loadData(page: number, rows: number): void {
    const offset = (page - 1);
    this.rentExemptionService.getRentExemptionsByUserId(this.userInfo.id, offset, rows).subscribe((result: any) => {
      this.rentExemptions = [];
      this.rentExemptions = result.data;
      this.totalRecords = result.total;
    });
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
    this.loadData(page, rows);
  }

  onRefresh(event: any): void {
    const rows = event.rows;
    this.loadData(1, rows);
  }

}
