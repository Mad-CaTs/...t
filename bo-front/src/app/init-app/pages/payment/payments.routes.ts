import { Routes } from '@angular/router';

const routes: Routes = [
	{
		path: '',
		loadComponent: () => import('./pages/payments/payment-later.component'),
		title: 'Pagos'
	},

	{
		path: '',
		pathMatch: 'full',
		redirectTo: '/home/pagos'
	}
];

export default routes;
