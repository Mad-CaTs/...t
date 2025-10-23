import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: '/dashboard/schedule/list-schedule' },
	{ path: 'list-schedule', loadComponent: () => import('./pages').then((p) => p.ListScheduleComponent) },
	{ path: 'detail-schedule/:id', loadComponent: () => import('./pages').then((p) => p.DetailScheduleComponent)},
	{ path: 'edit-schedule/:id', loadComponent: () => import('./pages').then((p) => p.EditScheduleComponent)}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ScheduleRoutingModule {}