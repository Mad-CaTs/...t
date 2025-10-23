import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
	{
		path: 'general',
		loadComponent: () => import('./pages/coordinator-panel-page/coordinator-panel-page.component').then((m) => m.CoordinatorPanelPageComponent),
		children: [
			{
				path: '',
				loadComponent: () => import('./pages/coordinator-panel-page/coordinator-panel/coordinator-panel.component').then((m) => m.CoordinatorPanelComponent)
			},
			// {
			// 	path: 'request-desplacement',
			// 	loadComponent: () => import('./pages/coordinator-panel-page/request-desplacement/request-desplacement.component').then((m) => m.RequestDesplacementComponent)
			// }
		]
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class CoordinatorPanelRoutingModule {}