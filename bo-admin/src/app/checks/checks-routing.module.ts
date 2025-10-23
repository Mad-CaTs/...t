import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: '/dashboard/checks/checks' },
	{ path: 'checks', loadComponent: () => import('./pages').then((p) => p.CheckComponent) }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ChecksRoutingModule {}
