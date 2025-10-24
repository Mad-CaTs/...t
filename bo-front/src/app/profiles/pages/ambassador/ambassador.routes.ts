import { Routes } from '@angular/router';
import { AmbassadorComponent } from './ambassador.component';
import { PaymentDetailComponent } from './pages/payments-and-comissions/pages/payment-detail/payment-detail.component';
import { ConciliationComponent } from './pages/payments-and-comissions/pages/conciliation/conciliation.component';
import { RentExemptionComponent } from './pages/payments-and-comissions/pages/rent-exemption/rent-exemption.component';
import { PrizeComponent } from './pages/payments-and-comissions/pages/prize/prize.component';
import { ProspectComponent } from './pages/prospect/prospect.component';
import { authGuard } from '@shared/guards';
import { WalletComponent } from './pages/wallet/wallet.component';
import { AmbassadorEventsMyTicketsComponent } from './events/my-tickets/ambassador-events-my-tickets.component';
import { AmbassadorPurchasesComponent } from './events/my-purchase/ambassador-purchases.component';
import { AmbassadorPurchaseDetailComponent } from './events/ambassador-ticket-card/details-tickets/ambassador-tickets-detail.component';

const routes: Routes = [
  {
    path: '',
    component: AmbassadorComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./pages/dashboard/dashboard.routes'),

      },
      {
        path: 'new-partner',
        loadChildren: () => import('./pages/new-partner/new-partner.routes'),
      },
      {
        path: 'email-shipping',
        loadChildren: () => import('./pages/email-shipping/email-shipping.routes'),
      },
      {
        path: 'account-tree',
        loadChildren: () => import('./pages/tree/account-tree.routes'),
      },
      {
        path: 'advices',
        loadComponent: () => import('./pages/advices/advices.component'),
      },
      {
        path: 'tools',
        loadChildren: () => import('./pages/tools/tools.routes'),
      },
      {
        path: 'payments',
        loadComponent: () =>
          import(
            './pages/payments-and-comissions/payments-and-comissions.component'

          ),
        title: 'Pagos y Comisiones',
      },
      {
        path: 'my-awards',
        loadComponent: () =>
          import(
            './pages/tree/pages/history-range/history-range.component'

          ),
        title: 'Premios',
        children: [
          {
            path: 'car-bonus',
            loadComponent: () => import('./pages/tree/pages/my-awards/car-bonus/car-bonus.component')
              .then(m => m.CarBonusComponent)
          },
          {
            path: 'car-bonus/proforma',
            loadComponent: () => import('./pages/tree/pages/my-awards/car-bonus/pages/proforma/proforma.component')
              .then(m => m.ProformaComponent)
          },
          {
            path: 'car-bonus/proforma/:proformaId/document/new',
            loadComponent: () => import('./pages/tree/pages/my-awards/car-bonus/pages/proforma/proforma-document/proforma-document.component')
              .then(m => m.ProformaDocumentComponent)
          },
          {
            path: 'car-bonus/proforma/:proformaId/document/:documentId',
            loadComponent: () => import('./pages/tree/pages/my-awards/car-bonus/pages/proforma/proforma-document/proforma-document.component')
              .then(m => m.ProformaDocumentComponent)
          },
          {
            path: 'car-bonus/cronograma/:proformaId/:tipo',
            loadComponent: () => import('./pages/tree/pages/my-awards/car-bonus/pages/car-bonus-schedule/car-bonus-schedule.component')
                .then(m => m.CarBonusScheduleComponent)
          },
        ]
      },
      {
        path: 'wallet',
        loadChildren: () =>
          import('./pages/wallet/wallet.routes')

        //component: WalletComponent,
      },
      /*   {
          path: 'payments/wallet',
          component: WalletComponent,
        }, */
      {
        path: 'payments/conciliation',
        component: ConciliationComponent
      },
      {
        path: 'payments/rent',
        component: RentExemptionComponent,
      },
      {
        path: 'payments/prize',
        component: PrizeComponent,
      },
      {
        path: 'payments/:id',
        component: PaymentDetailComponent,
      },
      {
        path: 'store',
        loadChildren: () => import('./pages/store/store.routes'),

      },
      {
        path:'tickets',
       loadChildren: () => import('./pages/tickets/tickets.routes')
      },
      {
        path: 'account',
        loadChildren: () => import('./pages/account/account.routes'),
      },
      {
        path: 'car-bonus-view',
        loadComponent: () =>
          import('../ambassador/pages/tree/pages/history-range/commons/components/my-rewards/pages/car-bonus-view/car-bonus-view.component')

            .then(m => m.CarBonusViewComponent)
      },
      {
        path: 'auto-bonus-schedule',
        loadComponent: () =>
          import('../ambassador/pages/tree/pages/history-range/commons/components/my-rewards/pages/auto-bonus-schedule/auto-bonus-schedule.component')

            .then(m => m.AutoBonusScheduleComponent)
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: '/profile/ambassador/dashboard',
      },
      {
        path: 'prospect',
        component: ProspectComponent
      },
      {
        path: 'events/my-tickets',
        component: AmbassadorEventsMyTicketsComponent
      },
      {
        path: 'events/my-tickets/detail/:paymentId',
        component: AmbassadorPurchaseDetailComponent
      },
      {
        path: 'events/my-purchases',
        children: [
          {
            path: '',
            component: AmbassadorPurchasesComponent,
          },
          {
            path: ':paymentId/nomination',
            loadComponent: () =>
              import('./events/my-purchase/nomination/nomination-ambassador.component')
                .then(m => m.NominationPageComponent)
          }
        ]
      }


    ],
  },
];

export default routes;
