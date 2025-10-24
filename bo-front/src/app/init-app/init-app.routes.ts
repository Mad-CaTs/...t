import { Routes } from '@angular/router';
import InitAppComponent from './init-app.component';
import { ProspectCreationTemporalComponent } from './pages/temporal/prospect-creation-temporal/prospect-creation-temporal.component';

const routes: Routes = [
	{
		path: '',
		component: InitAppComponent,
		title: 'Inicio',

		children: [
			{
				path: '',
				loadComponent: () => import('./pages/home/home.component')
			},
			{
				path: 'prospect/temporal/:id',
				component: ProspectCreationTemporalComponent
			},
			{
				path: 'products',
				loadChildren: () => import('./pages/products/products.routes')
			},
			{
				path: 'opportunities',
				loadComponent: () => import('./pages/opportunities/opportunities.component'),
				title: 'Oportunidades'
			},
			{
				path: 'communities',
				loadComponent: () => import('./pages/community/community.component'),
				title: 'Comunidades'
			},
			{
				path: 'upgrades',
				loadChildren: () => import('./pages/upgrades/upgrade.routes')
			},
			{
				path: 'calendar',
				loadComponent: () => import('./pages/calendar/calendar.component'),
				title: 'Calendario'
			},
			{
				path: 'events',
				loadChildren: () => import('./pages/events/events.routes')
			},
			{
				path: 'payments',
				loadChildren: () => import('./pages/payment/payments.routes')
			},
			{
				path: '',
				pathMatch: 'full',
				redirectTo: '/'
			}
		]
	}
];

export default routes;
