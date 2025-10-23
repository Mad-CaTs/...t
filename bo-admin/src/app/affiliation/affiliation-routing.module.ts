import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: '/dashboard/affiliation/validate-docs' },
	{ path: 'validate-docs', loadComponent: () => import('./pages').then((p) => p.ValidateDocsComponent) },
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class AffiliationRoutingModule {}