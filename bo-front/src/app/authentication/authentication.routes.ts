   import { Routes } from '@angular/router';
import { AuthorizedComponent } from './authentication.component';

const routes: Routes = [

  
	{
		path: 'login',
		component: AuthorizedComponent,
		title: 'Login',
		children: [{ path: '', loadComponent: () => import('./pages/authorized/authorized.component') }]
	},
  {
    path: 'logout',
    component: AuthorizedComponent,
    title: 'Logout',
    children: [{ path: '', loadComponent: () => import('./pages/unauthorized/unauthorized.component') }]
  }
];

export default routes;
