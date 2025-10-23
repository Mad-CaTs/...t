import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: '/dashboard/support/support' },
	{ path: 'support', loadComponent: () => import('./pages').then((p) => p.SupportComponent) },
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class SupportRoutingModule {}