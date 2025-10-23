import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from './_metronic/layout/layout.component';

import { AuthGuard } from './core/guards/auth';
import { LoginGuard } from './core/guards/login';
import { AuthRouteGuard } from './auth/services/auth.guard.routerGuard';

export const routes: Routes = [
	{
		path: '',
		pathMatch: 'full',
		redirectTo: 'auth/login'
	},
	{
		path: 'dashboard',
		component: LayoutComponent,
		canActivate: [AuthGuard],
		canActivateChild: [AuthRouteGuard],

		children: [
			{
				path: 'users',
				loadChildren: () => import('@app/users/users.module').then((m) => m.UsersModule),
				canActivate: [AuthRouteGuard]
			},
			{
				path: 'manage-home',
				loadChildren: () =>
					import('@app/manage-home/manage-home.module').then((m) => m.ManageHomeModule),
				canActivate: [AuthRouteGuard]
			},
			{
				path: 'entry',
				loadChildren: () => import('@app/entry/entry.module').then((m) => m.EntryModule),
				canActivate: [AuthRouteGuard]
			},
			{
				path: 'events',
				loadChildren: () => import('@app/event/event.module').then((m) => m.EventModule),
				canActivate: [AuthRouteGuard]
			},
			{
				path: 'manage-business',
				loadChildren: () =>
					import('@app/manage-business/manage-business.module').then((m) => m.ManageBusinessModule),
				canActivate: [AuthRouteGuard]
			},
			{
				path: 'beneficiaries',
				loadChildren: () =>
					import('@app/beneficiaries/beneficiaries.module').then((m) => m.BeneficiariesModule),
				canActivate: [AuthRouteGuard]
			},
			{
				path: 'manager-wallet',
				loadChildren: () =>
					import('@app/manager-wallet/manager-wallet.module').then((m) => m.ManagerWalletModule),
				canActivate: [AuthRouteGuard]
			},
			{
				path: 'payment-validate',
				loadChildren: () =>
					import('@app/validation-payments/validation-payments.module').then(
						(m) => m.ValidationPaymentsModule
					),
				canActivate: [AuthRouteGuard]
			},
			{
				path: 'requests',
				loadChildren: () => import('@app/requests/requests.module').then((m) => m.RequestsModule),
				canActivate: [AuthRouteGuard]
			},
			{
				path: 'change-type',
				loadChildren: () =>
					import('@app/change-type/change-type.module').then((m) => m.ChangeTypeModule),
				canActivate: [AuthRouteGuard]
			},
			{
				path: 'schedule',
				loadChildren: () => import('@app/schedule/schedule.module').then((m) => m.ScheduleModule),
				canActivate: [AuthRouteGuard]
			},
			{
				path: 'transfers',
				loadChildren: () => import('@app/transfers/transfers.module').then((m) => m.TransfersModule),
				canActivate: [AuthRouteGuard]
			},
			{
				path: 'conciliations',
				loadChildren: () =>
					import('@app/conciliations/conciliations.module').then((m) => m.ConciliationsModule),
				canActivate: [AuthRouteGuard]
			},
			{
				path: 'placement',
				loadChildren: () => import('@app/placement/placement.module').then((m) => m.PlacementModule),
				canActivate: [AuthRouteGuard]
			},
			{
				path: 'coordinator-panel',
				loadChildren: () =>
					import('@app/coordinator-panel/coordinator-panel.module').then(
						(m) => m.CoordinatorPanelModule
					),
				canActivate: [AuthRouteGuard]
			},
			{
				path: 'affiliation',
				loadChildren: () =>
					import('@app/affiliation/affiliation.module').then((m) => m.AffiliationModule),
				canActivate: [AuthRouteGuard]
			},
			{
				path: 'support',
				loadChildren: () => import('@app/support/support.module').then((m) => m.SupportModule),
				canActivate: [AuthRouteGuard]
			},
			{
				path: 'file-upload',
				loadChildren: () =>
					import('@app/file-upload/file-upload.module').then((m) => m.FileUploadModule),
				canActivate: [AuthRouteGuard]
			},
			{
				path: 'exoneration',
				loadChildren: () =>
					import('@app/exoneration/exoneration.module').then((m) => m.ExonerationModule),
				canActivate: [AuthRouteGuard]
			},
			{
				path: 'manage-prize',
				loadChildren: () =>
					import('@app/manage-prize/manage-prize.module').then((m) => m.ManagePrizeModule),
				canActivate: [AuthRouteGuard]
			},
			{
				path: 'liquidations',
				loadChildren: () =>
					import('@app/liquidations/liquidations.module').then((m) => m.LiquidationsModule),
				canActivate: [AuthRouteGuard]
			},
			{
				path: 'promotional-code',
				loadChildren: () =>
					import('@app/promotional-code/promotional-code.module').then(
						(m) => m.PromotionalCodeModule
					),
				canActivate: [AuthRouteGuard]
			},
			{
				path: 'checks',
				loadChildren: () => import('@app/checks/checks.module').then((m) => m.ChecksModule),
				canActivate: [AuthRouteGuard]
			},
			{
				path: 'legal',
				loadChildren: () => import('@app/legal/legal.module').then((m) => m.LegalModule),
				canActivate: [AuthRouteGuard]
			},
			{
				path: 'report',
				loadChildren: () => import('@app/report/report.module').then((m) => m.ReportModule),
				canActivate: [AuthRouteGuard]
			},
			{
				path: 'coupon-manager',
				loadChildren: () =>
					import('@app/coupon-manager/coupon-manager.module').then((m) => m.CouponManagerModule),
				canActivate: [AuthRouteGuard]
			},

			{
				path: 'commission-manager',
				loadChildren: () =>
					import('@app/commission-manager/commission-manager.module').then(
						(m) => m.CommissionManagerModule
					),
				canActivate: [AuthRouteGuard]
			},
			{
				path: 'tools',
				loadChildren: () => import('@app/tools/tools.module').then((m) => m.ToolsModule),
				canActivate: [AuthRouteGuard]
			}
		]
	},
	{
		path: 'error',
		loadChildren: () => import('./modules/errors/errors.module').then((m) => m.ErrorsModule)
	},
	{
		path: 'auth',
		loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
		canActivate: [
			/* LoginGuard */
		]
	},
	{
		path: 'metronic-view',
		canActivate: [AuthGuard],
		loadChildren: () => import('./_metronic/layout/layout.module').then((m) => m.LayoutModule)
	},
	{ path: '**', redirectTo: 'error/404' }
];

@NgModule({
	imports: [RouterModule.forRoot(routes, { useHash: true })],
	exports: [RouterModule]
})
export class AppRoutingModule {}
