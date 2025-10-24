import { Routes } from '@angular/router';
import { MyProductsComponent } from './my-products.component';

const routes: Routes = [
	{
		path: '',
		component: MyProductsComponent,
		children: [
			{
				path: '',
				loadComponent: () => import('./pages/product/my-products.component'),
				title: 'Mis Productos'
			},
			{
				path: 'details/:id',
				loadComponent: () => import('./pages/details/details.component')
			},
			{
				path: 'documents/:idFamilyPackage/:id',
				loadComponent: () =>
					import('./pages/documents/documents.component').then((m) => m.DocumentsComponent)
			},
			{
				path: 'pay-fee/:idPayment',
				loadComponent: () => import('./commons/components/pay-fee/pay-fee.component')
			},
			{
				path: 'migration',
				loadComponent: () =>
					import('./pages/migrationes/pages/migration-payment/migration-payment.component')
			},
			{
				path: 'simulador-cronograma',
				loadComponent: () =>
					import('./pages/migrationes/pages/simulador-cronograma/simulador-cronograma.component')
			},
			{
				path: 'portafolio',
				loadComponent: () =>
					import('./pages/migrationes/pages/migration-portafolios/migration-portafolios.component')
			},
			{
				path: 'migration-verification',
				loadComponent: () =>
					import(
						'./pages/migrationes/pages/migration-verification/migration-verification.component'
					)
			},
			{
				path: 'release-points/:id',
				loadComponent: () =>
					import('./pages/release-points/pages/release-points/release-points.component').then(
						(m) => m.ReleasePointsComponent
					)
			},
			{
				path: 'validate-documents',
				loadComponent: () =>
					import('./pages/documents/pages/validate-documents/validate-documents.component').then(
						(m) => m.ValidateDocumentsComponent
					)
			},
			{
				path: 'exchange-history',
				loadComponent: () =>
					import('./pages/release-points/pages/exchange-history/exchange-history.component').then(
						(m) => m.ExchangeHistoryComponent
					)
			}
		]
	}
];

export default routes;
