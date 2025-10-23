import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: '/dashboard/report/management-dashboard' },
	{ path: 'management-dashboard', loadComponent: () => import('./pages').then((p) => p.ManagementDashboardComponent) },
	{ path: 'table-downloads', loadComponent: () => import('./pages').then((p) => p.DownloadsDashboardComponent) }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ReportRoutingModule {}
