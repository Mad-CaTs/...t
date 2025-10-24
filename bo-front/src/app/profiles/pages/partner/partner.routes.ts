import { Routes } from '@angular/router';
import { PartnerComponent } from './partner.component';
import { PartnerTicketsComponent } from './pages/my-tickets/partner-tickets.component';

const routes: Routes = [
	{
		path: '',
		component: PartnerComponent,
		children: [
			{
				path: '',
				loadComponent: () => import('./pages/default/default.container'),
				title: 'Resumen'
			},
			{
				path: 'my-products',
				loadChildren: () => import('./pages/my-products/my-products.routes')
			},
			{
				path: 'projects',
				loadChildren: () => import('./pages/projects/projects.routes')
			},
			{
				path: 'communicated',
				loadChildren: () => import('./pages/communicated/communicated.routes')
			},
			{
				path: 'my-legalization',
				loadChildren: () => import('./pages/my-legalization/my-legalization.routes')
			},
			{
				path: 'rechargepaypal',
				loadComponent: () => import('./pages/recharge/paypal/paypal.component'),
				title: 'Recargar con PayPal'
			},
			{
				path: 'my-tickets',
				loadComponent: () => PartnerTicketsComponent
			}
		]
	}
];

export default routes;
