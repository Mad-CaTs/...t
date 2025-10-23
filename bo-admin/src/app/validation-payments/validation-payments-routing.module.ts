import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
	{
		path: '',
		pathMatch: 'full',
		redirectTo: '/dashboard/payment-validate/initial-payments'
	},
	{
		path: 'initial-payments',
		loadComponent: () => import('./pages').then((c) => c.InitialPaymentsComponent)
	},
	{
		path: 'cuote-payments',
		loadComponent: () => import('./pages').then((c) => c.CuotePaymentsComponent)
	},
	{
		path: 'migration-payments',
		loadComponent: () => import('./pages').then((c) => c.MigrationPaymentsComponent)
	},
	{
		path: 'pending-payments',
		loadComponent: () => import('./pages').then((c) => c.PendingPaymentsComponent)
	},
	{
		path: 'late-payments',
		loadComponent: () => import('./pages').then((c) => c.ExpiratedPaymentsComponent)
	},

	{
		path: 'charge-wallet',
		loadComponent: () => import('./pages').then((c) => c.WalletPaymentBoxComponent)
	},
	{
		path: 'bank-movement',
		loadComponent: () => import('./pages').then((c) => c.BankMovementComponent)
	},
	{
		path: 'bank-movement/detail',
		loadComponent: () => import('./pages').then((c) => c.BankMovementDetailComponent)
	},
	{
		path: 'validation-payments',
		loadComponent: () => import('./pages').then((c) => c.ValidationPaymentComponent)
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ValidationPaymentsRoutingModule {}
