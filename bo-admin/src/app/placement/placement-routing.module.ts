import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: '/dashboard/placement/placement' },
	{ path: 'placement', loadComponent: () => import('./pages').then((p) => p.PlacementComponent) },
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class PlacementRoutingModule {}