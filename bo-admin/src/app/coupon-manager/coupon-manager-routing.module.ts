import { NgModule }      from '@angular/core';
import { RouterModule,
         Routes }        from '@angular/router';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'collaborator-discounts' },
  {
    path: 'collaborator-discounts',
    loadComponent: () => import('./pages/collaborator-discounts/collaborator-discounts.component')
                             .then(m => m.CollaboratorDiscountsComponent)
  },
  {
    path: 'partner-discounts',
    loadComponent: () => import('./pages/partner-discounts/partner-discounts.component')
                             .then(m => m.PartnerDiscountsComponent)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CouponManagerRoutingModule {}