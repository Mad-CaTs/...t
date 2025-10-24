import { Routes } from '@angular/router';

const routes: Routes = [
	{
		path: '',
		loadComponent: () => import('./email-shipping.component'),
		title: 'email',
	
	  },
	  {
		path: 'email-shipping-type',
		loadComponent: () => import('./pages/email-shipping-type/email-shipping-type.component'),

		
	  },


	
]


export default routes;
