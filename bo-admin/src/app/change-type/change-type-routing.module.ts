import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
	{
		path: '',
		loadComponent: () =>
			import('./components/layout-change-type/layout-change-type.component').then(
				(c) => c.LayoutChangeTypeComponent
			),
		children: [
			{
				path: 'general',
				loadComponent: () => import('./pages').then((m) => m.GeneralComponent)
			},
			// {
			// 	path: 'detailed',
			// 	loadComponent: () => import('./pages').then((m) => m.DetailedComponent)
			// }
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ChangeTypeRoutingModule {}
