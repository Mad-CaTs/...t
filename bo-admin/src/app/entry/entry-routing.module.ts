import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

type PagesModule = typeof import('./pages');
function loadPage<C extends keyof PagesModule>(component: C) {
  return () => import('./pages').then(m => m[component]);
}

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/dashboard/entry/payments-validate' },
  { path: 'payments-validate', loadComponent: loadPage('PaymentsValidateComponent') },
  { path: 'ticket-report', loadComponent: loadPage('TicketReportComponent') }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class EntryRoutingModule {
}