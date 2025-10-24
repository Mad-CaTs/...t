import { Component, inject, Input } from '@angular/core';
import { PayrollsService } from '../../commons/services/payrolls.service';
import { Payrolls, Purchases } from '../../commons/interfaces/guest-components.interface';
import { PayrollsColumns } from '../../commons/constants/pages/payrolls';
import { GuestTableComponent } from "../../commons/components/table/table.component";
import { TabViewModule } from 'primeng/tabview';
import { PagesCard } from '../../commons/constants/pages-card';
import { EmptyStates } from '../../commons/constants/empty-state-pages';
import { Pages } from '../../commons/enums/guest.enum';
import { CommonModule } from '@angular/common';
import { PurchasesService } from '../../commons/services/purchases.service';
import { PurchasesColumns } from '../../commons/constants/pages/purchases';

@Component({
  selector: 'guest-my-payrolls',
  standalone: true,
  imports: [GuestTableComponent, TabViewModule, CommonModule],
  templateUrl: './my-payrolls.component.html',
  styleUrl: './my-payrolls.component.scss'
})

export class MyPayrollsComponent {
  // private _payrollService = inject(PurchasesService);
  @Input() ticketList: Purchases[] = []
  payrolls: Purchases[];
  
  // payrolls: Payrolls[];
  columns  = PurchasesColumns;

  myPayrolls = PagesCard[Pages.MY_PURCHASES];
  emptyPurchases = EmptyStates[Pages.MY_PURCHASES];

  ngOnInit() {
    this.payrolls = this.ticketList;
  }
  
}
