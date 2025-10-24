import { Routes } from '@angular/router';
import { MyTicketsComponent } from './my-tickets.component';
import { TicketListComponent } from './pages/ticket-list/ticket-list.component';
import { PurchaseDetailComponent } from '../my-purchases/purchase-detail/purchase-detail.component';

const routes: Routes = [
  {
    path: '',
    component: MyTicketsComponent,
    children: [
  { path: '', component: TicketListComponent },
  { path: 'purchases/:paymentId', component: PurchaseDetailComponent }
    ]
  }
];
export default routes;
