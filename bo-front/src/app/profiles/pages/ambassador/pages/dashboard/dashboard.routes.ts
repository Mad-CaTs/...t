import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { SubProfile } from 'src/app/profiles/commons/enums';

const routes: Routes = [
	{
		path: '',
		component: DashboardComponent,
		children: [
			{
				path: '',
				pathMatch: 'full',
				redirectTo: '/profile/ambassador/dashboard/primary-profile'
			},
			{
				path: 'global-profile',
				loadComponent: () => import('./pages/global-profile/global-profile.component')
			},
			{
				path: 'primary-profile',
				loadComponent: () => import('./pages/primary-and-secondary-profile/primary-and-secondary-profile.component'),
				title: 'Resumen',
				data: { profileType: SubProfile.PRIMARY }
			},
			{
				path: 'secondary-profile',
				loadComponent: () => import('./pages/primary-and-secondary-profile/primary-and-secondary-profile.component'),
				data: { profileType: SubProfile.SECONDARY }
			}
		]
	}
];
export default routes;
