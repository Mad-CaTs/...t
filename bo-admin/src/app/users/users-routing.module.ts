import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UsersComponent, EmalingComponent, ListUsersComponent, ModifyDataUsersComponent } from './pages';
import { HistoricalPeriodsComponent } from './pages/historical-periods/historical-periods.component';
import { AuthRouteGuard } from '@app/auth/services/auth.guard.routerGuard';
import { ListUserByIdComponent } from './pages/list-user-by-id/list-user-by-id.component';
import { SponsorshipListComponent } from './pages/sponsorship-list/sponsorship-list.component';

const routes: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: '/dashboard/users/manage' },
	{ path: 'manage', loadComponent: () => import('./pages').then((p) => p.UsersComponent) },
	{ path: 'modify', component: ModifyDataUsersComponent },
	{ path: 'list', component: ListUsersComponent },
	{ path: 'emailing', component: EmalingComponent },
	{
		path: 'new-ranges',
		loadComponent: () => import('./pages').then((c) => c.NewRangesComponent)
	},
	{ path: 'historical-periods', component: HistoricalPeriodsComponent },
	{ path: 'list-user-by-id/:id', component: ListUserByIdComponent},
	{ path: 'sponsorship-list', component: SponsorshipListComponent}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class UsersRoutingModule {}
