import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/dashboard/transfers/dashboard-transfer'
  },
  {
    path: 'dashboard-transfer',
    loadComponent: () =>
      import('./pages/dashboard-transfer/dashboard-transfers.component').then(
        (c) => c.DashboardTransfersComponent
      ),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'requests'  
      },
      {
        path: 'requests',
        loadComponent: () => import('./pages').then((c) => c.TransfersRequestsComponent)
      },
      {
        path: 'historical',
        loadComponent: () => import('./pages').then((c) => c.TransfersHistoricalComponent)
      },
      {
        path: 'view-files/:id',
        loadComponent: () =>
          import('./pages/view-files/view-files.component').then(
            (c) => c.ViewFilesComponent
          )
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransfersRoutingModule {}
