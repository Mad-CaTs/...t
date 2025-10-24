import { Routes } from '@angular/router';
import AccountSettingsComponent from './account.component';
const routes: Routes = [
	{
		path: '',
		component: AccountSettingsComponent, // Layout con sidebar
		children: [
			{
				path: 'account-data',
				loadComponent: () => import('./pages/account-data-tab/account-data-tab.component'),
				title: 'Red'
			},
			{
				path: 'beneficiary-data',
				loadComponent: () => import('./pages/beneficiary-data/beneficiary-data.component').then(
					(m) => m.BeneficiaryDataComponent
				),
			},
			{
				path: 'liquidated-data',
				loadComponent: () => import('./pages/liquidated-data/liquidated-data.component').then(
					(m) => m.LiquidatedDataComponent
				),
			},
			{
				path: 'account-tickets-follow',
				loadComponent: () => import('./pages/account-tickets-follow/account-tickets-follow.component'),
			},
			{
				path: '',
				pathMatch: 'full',
				redirectTo: '/profile/ambassador/account/account-data'
			}
		],
	},
	{
		path: 'datos-bancarios',
		loadChildren: () => import('./pages/account-datos-bank/account-datos-bank.routes')
	//	loadChildren: () => import('./pages/account-datos-bank/account-datos-bank.routes')
	},
]
/* const routes: Routes = [

	{
		path: '',
		component: AccountSettingsComponent,
		children: [
			{
				path: 'account-data',
				loadComponent: () => import('./pages/account-data-tab/account-data-tab.component'),
				title: 'Red'
			},
		
			//{
			//	path: 'Datos Personales',
			//		loadComponent: () => import('./pages/trinary-tree/trinary-tree.component')
			//	},
			//	{
			//		path: 'Datos Bancarios',
			//		loadComponent: () => import('./pages/partner-list/partner-list.component')
			//	},
			//	{
			//		path: 'Billetera Electrónica',
			//		loadComponent: () => import('./pages/placement/placement.component')
			//	},
			//	{
			//		path: 'Información de Empresa',
			//		loadComponent: () => import('./pages/activation-manager/activation-manager.component')
			//	},
			{
				path: 'beneficiary-data',
				loadComponent: () => import('./pages/beneficiary-data/beneficiary-data.component').then(
					(m) => m.BeneficiaryDataComponent
				),
			},
			{
				path: 'liquidated-data',
				loadComponent: () => import('./pages/liquidated-data/liquidated-data.component').then(
					(m) => m.LiquidatedDataComponent
				),
			},
			{
				path: 'account-tickets-follow',
				loadComponent: () => import('./pages/account-tickets-follow/account-tickets-follow.component'),
			},
			//{
			//	path: 'Perfil Socio',
			//	loadComponent: () => import('./pages/history-range/history-range.component')
			//},
			{
				path: '',
				pathMatch: 'full',
				redirectTo: '/profile/ambassador/account/account-data'
			}
		]
	},

]; */
/*const routes: Routes = [
  {
	path: '',
	loadComponent: () => import('./account.component'),
	title: 'Cuenta',

  },
];*/
export default routes;
