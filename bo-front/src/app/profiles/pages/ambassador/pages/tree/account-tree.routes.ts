import { Routes } from '@angular/router';
import { AccountTreeComponent } from './account-tree.component';

const routes: Routes = [
	{
		path: '',
		component: AccountTreeComponent,
		children: [
			/*       {
		path: '',
		pathMatch: 'full',
		redirectTo: '/profile/ambassador/account-tree/sponshorship-tree',

	  }, */
			{
				path: 'sponshorship-tree',
				loadComponent: () => import('./pages/sponsorhip-tree/sponsorhip-tree.component'),
				title: 'Red'
			},
			{
				path: 'trinary-tree',
				loadComponent: () => import('./pages/trinary-tree/trinary-tree.component')
			},
			{
				path: 'partner-list',
				loadComponent: () => import('./pages/partner-list/partner-list.component')
			},
			{
				path: 'sponsorship-list',
				loadComponent: () => import('./pages/sponsorship-list/sponsorship-list.component')
					.then(m => m.SponsorshipListComponent)
			},
			{
				path: 'pending-partner',
				loadComponent: () =>
					import('./pages/pending-partner/pending-partner.component').then(
						(m) => m.PendingPartnerComponent
					)
			},
			{
				path: 'placement-page',
				loadComponent: () => import('./pages/placement/placement.component')
			},
			{
				path: 'activation-manager',
				loadComponent: () => import('./pages/activation-manager/activation-manager.component')
			},
			{
				path: 'range-manager',
				loadComponent: () => import('./pages/range-manager/range-manager.component')
			},
			{
				path: 'history-manager',
				loadComponent: () => import('./pages/history-range/history-range.component')
			},
			{
				path: 'direct-users',
				loadComponent: () => import('./pages/direct-users/direct-users.component')
			},
			{
				path: '',
				pathMatch: 'full',
				redirectTo: '/profile/ambassador/account-tree/sponshorship-tree'
			}
		]
	}
];
export default routes;
