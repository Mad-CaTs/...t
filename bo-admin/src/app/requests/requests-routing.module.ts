import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
	{
		path: 'transfer',
		loadComponent: () => import('./pages').then((c) => c.TransferRequestsComponent),
		children: [
			{
				path: '',
				loadComponent: () => import('./pages').then((c) => c.ElectronicWalletComponent)
			},
			{
				path: 'other-accounts',
				loadComponent: () => import('./pages').then((c) => c.OtherAccountsComponent)
			},
			{
				path: 'exclusive-brands',
				loadComponent: () => import('./pages').then((c) => c.ExclusiveBrandsComponent)
			}
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class RequestsRoutingModule {}
