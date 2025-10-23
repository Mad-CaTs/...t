import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PeriodsComponent } from './pages/periods/periods.component';
import { GracePeriodAndDebtComponent } from './pages/grace-period-and-debt/grace-period-and-debt.component';

const routes: Routes = [
	/* {
		path: 'wallet',
		loadComponent: () => import('./pages').then((p) => p.WalletPageComponent),
		children: [
			{
				path: '',
				loadComponent: () => import('./pages').then((p) => p.WalletComponent)
			},
			{
				path: 'consilations',
				loadComponent: () => import('./pages').then((p) => p.ConsilationsComponent)
			}
		]
	}, */
	{ path: 'packages', pathMatch: 'full', redirectTo: '/dashboard/manage-business/packages/families' },
	{
		path: 'packages',
		loadComponent: () => import('./pages').then((p) => p.PackagesComponent),
		children: [
			{
				path: 'families',
				loadComponent: () => import('./pages').then((p) => p.FamilyPackageComponent)
			},
			{
				path: 'packages',
				loadComponent: () => import('./pages').then((p) => p.PackagesPageComponent)
			},
			{
				path: 'detail',
				loadComponent: () => import('./pages').then((p) => p.DetailPageComponent)
			},
			{
				path: 'historical',
				loadComponent: () => import('./pages').then((p) => p.HistoricalPageComponent)
			},
			{
				path: 'codes',
				loadComponent: () => import('./pages').then((p) => p.PromotinalCodesPageComponent)
			}
		]
	},
	{
		path: 'tools',
		loadComponent: () => import('./pages').then((p) => p.ToolsComponent)
	},
	{
		path: 'comission',
		loadComponent: () => import('./pages').then((p) => p.ComissionEditorComponent)
	},
	{
		path: 'gracia-period',
		loadComponent: () => import('./pages').then((p) => p.GracePeriodComponent)
	},
	{
		path: 'periods',
		loadComponent: () => import('./pages').then((p) => p.PeriodsComponent)
	},
	{
		path: 'grace-and-debt',
		loadComponent: () => import('./pages').then((p) => p.GracePeriodAndDebtComponent),
		children: [
			{
				path: '',
				loadComponent: () => import('./pages').then((p) => p.GracePeriodRegisterComponent)
			},
			{
				path: 'debt',
				loadComponent: () => import('./pages').then((p) => p.DebtComponent)
			},
			{
				path: 'debt-type',
				loadComponent: () => import('./pages').then((p) => p.DebtTypeComponent)
			}
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ManageBusinessRoutingModule { }
