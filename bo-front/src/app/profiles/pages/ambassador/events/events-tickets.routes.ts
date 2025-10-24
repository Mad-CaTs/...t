import { Routes } from '@angular/router';
import { AmbassadorPurchaseDetailComponent } from './ambassador-ticket-card/details-tickets/ambassador-tickets-detail.component';


export const routes: Routes = [
  {
    path: 'guest-tickets-detail/:paymentId',
    component: AmbassadorPurchaseDetailComponent,
  },
];