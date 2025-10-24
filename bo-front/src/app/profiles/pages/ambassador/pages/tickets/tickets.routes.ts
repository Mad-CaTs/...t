import { Routes } from '@angular/router';
import { TicketsComponent } from './tickets.component';
const routes: Routes = [
	{
		path: '',
		component: TicketsComponent, 
		children: [
		
			 {
				path: 'dashboard-tickets',
				loadComponent: () => import('./pages/dashboard-tickets/dashboard-tickets.component'),
			}, 
			 {
				path: 'new-ticket',
				loadComponent: () => import('./pages/new-ticket/new-ticket.component'),
			},
			 {
				path: 'transfer-steps',
				loadComponent: () => import('./pages/transfer-steps/transfer-steps.component'),
			},  
			{
				path: 'transfer-detail/:id',
				loadComponent: () => import('./pages/transfer-detail/transfer-detail.component'),
			},
			{
				path: '',
				pathMatch: 'full',
				redirectTo: '/profile/ambassador/tickets/dashboard-tickets'
			}
		],
	},
	
]
export default routes;
