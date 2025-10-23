import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
	{
		path: '',
		pathMatch: 'full',
		redirectTo: '/dashboard/liquidations/requests'
	},
	{
		path: 'requests',
		loadComponent: () => import('./pages').then((c) => c.LiquidationsRequestsComponent)
	},
	{
		path: 'details',
		loadComponent: () => import('./pages').then((c) => c.RequestsDetailsComponent)
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class LiquidationsRoutingModule {}
