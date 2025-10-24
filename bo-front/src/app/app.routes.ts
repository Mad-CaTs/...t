import { Routes } from '@angular/router';
import { authGuard } from '@shared/guards';
import { imgGuard } from '@shared/guards/img-guard/img.guard';
import ImagenesComponent from './shared/components/images/images.component';
import { GuestGuard } from '@shared/guards/guest/guest.guard';
import { PendingPurchaseGuard } from '@shared/guards/pending-purchase';

export const routes: Routes = [
	{
		path: 'home',
		loadChildren: () => import('./init-app/init-app.routes')
	},
	{
		path: 'profile',
		loadChildren: () => import('./profiles/profiles.routes'),
		canActivate: [authGuard]
	},
	{
		path: 'authentication',
		loadChildren: () => import('./authentication/authentication.routes')
	},
	{
		path: 'guest',
		loadChildren: () => import('./guest/guest.routes'),
		canActivate: [GuestGuard]
	},
	{
		path: 'images',
		loadComponent: () => import('./shared/components/images/images.component'),
		canActivate: [imgGuard]
	},
	{
		path: 'login-selection',
		loadComponent: () => import('./init-app/pages/public-access/login-selection/login-selection.component').then(m => m.LoginSelectionComponent)
	},
	{
		path: 'login-register',
		loadComponent: () => import('./init-app/pages/public-access/auth/public-register/public-register.component').then(m => m.PublicRegisterComponent)
	},
	{
		path: 'login-public',
		loadComponent: () => import('./init-app/pages/public-access/auth/public-login/public-login.component').then(m => m.PublicLoginComponent)
	},
	{
		path: 'checkout',
		loadComponent: () => import('./init-app/pages/purchase-checkout/purchase-checkout.component').then(m => m.PurchaseCheckoutComponent),
		canActivate: [PendingPurchaseGuard]
	},
	{
		path: 'login-nuevo',
		loadComponent: () => import('./authentication/pages/authorized/login-nuevo/login-nuevo')
	},
	{
		path: 'forgot-password',
		loadComponent: () =>
			import('./shared/components/forgot-password/forgot-password.component').then((m) => m.default)
	},
	{
		path: 'new-partner/:token',
		loadChildren: () => import('./profiles/pages/ambassador/pages/new-partner-temporal/new-partner-temporal.routes')
	},

	{
		path: 'terms-and-conditions',
		loadComponent: () => import('./init-app/commons/components/footer/commons/components/terms-and-conditions/terms-and-conditions.component'),
		title: 'Términos y Condiciones'
	},
	{
		path: 'privacy-policy',
		loadComponent: () => import('./init-app/commons/components/footer/commons/components/privacy-policy/privacy-policy.component'),
		title: 'Política de Privacidad'
	},
	{
		path: '',
		pathMatch: 'full',
		redirectTo: '/home'
	},
	{
		path: '**',
		pathMatch: 'full',
		redirectTo: '/home'
	}
];
