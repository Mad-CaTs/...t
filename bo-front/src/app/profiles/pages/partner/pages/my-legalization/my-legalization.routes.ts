import { Routes } from '@angular/router';
import { MyProductsComponent } from '../my-products/my-products.component';

const routes: Routes = [
	{
		path: '',
		component: MyProductsComponent,
		children: [
			{
				path: '',
				loadComponent: () => import('./commons/components/my-products/my-products.component'),
				title: 'Mis Legalizaciones'
			},
			{
				path: 'legalization-panel/:id',
				loadComponent: () => import('./legalization-panel/legalization-panel.component')
			},
			{
				path: 'document-validator/:id',
				loadComponent: () =>
					import('./legalization-panel/pages/document-validator/document-validator.component').then(
						(m) => m.DocumentValidatorComponent
					)
			},
			{
				path: 'corrections-panel/:id',
				loadComponent: () =>
					import('./legalization-panel/pages/corrections-panel/corrections-panel.component').then(
						(m) => m.CorrectionsPanelComponent
					)
			},
			{
				path: 'document-status-detail/:documentKey',
				loadComponent: () =>
					import(
						'./legalization-panel/pages/document-status/pages/document-status-detail/document-status-detail.component'
					).then((m) => m.DocumentStatusDetailComponent)
			},
			{
				path: 'timeline-corrections',
				loadComponent: () =>
					import('./timeline-corrections/timeline-corrections.component').then(
						(m) => m.TimelineCorrectionsComponent
					)
			},
			{
				path: 'attach-new-address',
				loadComponent: () =>
					import(
						'./legalization-panel/pages/document-status/pages/attach-new-address/attach-new-address.component'
					).then((m) => m.AttachNewAddressComponent)
			} 

			/* 	{
				path: 'timeline-corrections',
				loadComponent: () => import('./timeline-corrections/timeline-corrections.component')
			}, */
		]
	}
];

export default routes;
