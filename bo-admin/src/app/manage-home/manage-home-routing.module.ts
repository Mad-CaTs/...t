import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthRouteGuard } from '@app/auth/services/auth.guard.routerGuard';

const routes: Routes = [
	{ path: 'events', pathMatch: 'full', redirectTo: '/dashboard/manage-home/events/list' },
	{
		path: 'news',
		loadComponent: () => import('./pages').then((p) => p.NewsComponent),canActivate: [AuthRouteGuard]
	},
	{
		path: 'events',
		loadComponent: () => import('./pages').then((p) => p.EventsContainerComponent),
		canActivateChild: [AuthRouteGuard],
		children: [
			{
				path: 'payments',
				loadComponent: () => import('./pages').then((p) => p.EventPaymentsComponent)
			},
			{
				path: 'list',
				loadComponent: () => import('./pages').then((p) => p.EventsComponent)
			},
			{
				path: 'event-types',
				loadComponent: () => import('./pages').then((p) => p.EventTypesComponent)
			},
			{
				path: 'event-subtypes',
				loadComponent: () => import('./pages').then((p) => p.EventSubtypesComponent)
			},
			{
				path: 'landing',
				loadComponent: () => import('./pages').then((p) => p.LandingComponent)
			},
			{
				path: 'links',
				loadComponent: () => import('./pages').then((p) => p.LinksComponent)
			},
			{
				path: 'partners-list',
				loadComponent: () => import('./pages').then((p) => p.PartnersListComponent)
			},
			{
				path: 'travels',
				loadComponent: () => import('./pages').then((p) => p.TravelsComponent)
			}
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ManageHomeRoutingModule {}
