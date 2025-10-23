import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
	{
		path: '',
		pathMatch: 'full',
		redirectTo: '/dashboard/commission-manager/commission-type'
	},
	{
		path: 'commission-type',
		children: [
			{
				path: '',
				loadComponent: () => import('./pages').then((m) => m.CommissionTypeComponent)
			},
			{
				path: 'generate-commission',
				loadComponent: () =>
					import('./components').then((c) => c.GenerateCommissionCommissionTypeComponent)
			}
		]
	},

	{
		path: 'rank-bonus',
		children: [
			{
				path: '',
				loadComponent: () => import('./pages').then((m) => m.RankBonusComponent)
			},
			{
				path: 'generate-commission-rank-bonus',
				loadComponent: () =>
					import('./components').then((c) => c.GenerateCommissionRankBonusComponent)
			}
		]
	},
	{
		path: 'historical',
		loadComponent: () => import('./pages').then((c) => c.HistoricalComponent),
		children: [
			{
				path: 'commissions',
				loadComponent: () => import('./pages/historical').then((p) => p.CommissionsComponent)
			},
			{
				path: 'sponsors',
				loadComponent: () => import('./pages/historical').then((p) => p.SponsorsComponent)
			}
		]
	}
];

@NgModule({
	declarations: [],
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class CommissionManagerRoutingModule {}
