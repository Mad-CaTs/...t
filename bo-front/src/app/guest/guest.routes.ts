import { Routes } from '@angular/router';
import { GuestComponent } from './guest.component';
import { MyPurchasesComponent } from './pages/my-purchases/my-purchases.component';
import { PurchaseDetailComponent } from './pages/my-purchases/purchase-detail/purchase-detail.component';
import { MyProfileComponent } from './pages/my-profile/my-profile.component';
import { NominationPageComponent } from './pages/nomination/nomination-page.component';
import { MyMarketComponent } from './pages/my-market/my-market.component';
import { MyPasswordComponent } from './pages/my-password/my-password.component';
import { AmbassadorEventsMyTicketsComponent } from '../profiles/pages/ambassador/events/my-tickets/ambassador-events-my-tickets.component';

const GuestRoutes: Routes = [
  {
    path: '',
    component: GuestComponent,
    children: [
      { path: '', redirectTo: 'purchases', pathMatch: 'full' },
      { path: 'purchases', component: MyPurchasesComponent },
      { path: 'purchases/:paymentId', component: PurchaseDetailComponent },
      { path: 'purchases/:paymentId/nomination', component: NominationPageComponent },
      {
        path: 'tickets',
        loadChildren: () => import('./pages/my-tickets/my-tickets.routes'),
      },
      { path: 'profile', component: MyProfileComponent },
      { path: 'change-password', component: MyPasswordComponent },
      { path: 'market', component: MyMarketComponent },
    ]
  }
];

export default GuestRoutes;