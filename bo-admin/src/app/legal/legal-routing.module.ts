import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
	{
		path: '',
		pathMatch: 'full',
		redirectTo: '/dashboard/legal/legalization-requests'
	},
	{
		path: 'legalization-requests',
		//loadComponent: () => import('./pages').then((p) => p.PackagesComponent),<html>
		loadComponent: () => import('./pages').then((c) => c.LegalizationRequestsComponent),
		children: [
			{
				path: 'pending-requests',
				loadComponent: () => import('./pages').then((p) => p.PendingRequestsComponent)
			},
			{
				path: 'validated-requests',
				loadComponent: () => import('./pages').then((p) => p.ValidatedRequestsComponent)
			}
		]
	},
	{
		path: 'correction-requests',
		loadComponent: () => import('./pages/correction-requests/correction-requests.component')
			.then((c) => c.CorrectionRequestsComponent),
		children: [
			{
				path: '',
				redirectTo: 'contracts',
				pathMatch: 'full'
			},
			{
				path: 'contracts',
				loadComponent: () => import('./pages/correction-requests/list/correction-list.component')
					.then((c) => c.CorrectionListComponent)
			},
			{
				path: 'certificates',
				loadComponent: () => import('./pages/correction-requests/list/correction-list.component')
					.then((c) => c.CorrectionListComponent)
			},
			{
				path: 'contracts/history/:username',
				loadComponent: () => import('./pages/correction-requests/history/history.component')
					.then((c) => c.HistoryComponent)
			},
			{
				path: 'certificates/history/:username',
				loadComponent: () => import('./pages/correction-requests/history/history.component')
					.then((c) => c.HistoryComponent)
			},
			{
				path: 'contracts/history/:username/detail',
				loadComponent: () => import('./pages/correction-requests/correction-detail/correction-detail.component')
					.then((c) => c.CorrectionDetailComponent)
			},
			{
				path: 'certificates/history/:username/detail',
				loadComponent: () => import('./pages/correction-requests/correction-detail/correction-detail.component')
					.then((c) => c.CorrectionDetailComponent)
			},
			{
				path: 'contracts/history/:username/edit',
				loadComponent: () => import('../legal/pages/correction-requests/components/correction-form/correction-form.component').then(m => m.CorrectionFormComponent)
			},
			{
				path: 'certificates/history/:username/edit',
				loadComponent: () => import('../legal/pages/correction-requests/components/correction-form/correction-form.component').then(m => m.CorrectionFormComponent)
			},
			{
				path: 'contracts/generate/new',
				loadComponent: () => import('../legal/pages/correction-requests/components/correction-form/correction-form.component').then(m => m.CorrectionFormComponent)
			},
			{
				path: 'certificates/generate/new',
				loadComponent: () => import('../legal/pages/correction-requests/components/correction-form/correction-form.component').then(m => m.CorrectionFormComponent)
			}
		]
	},
	{
		path: 'pickup-correction',
		loadComponent: () => import('./pages').then((c) => c.LegalizationPickupCorrectionComponent),
		children: [
			{
				path: 'pending-pickup',
				loadComponent: () => import('./pages').then((p) => p.PendingPickupComponent)
			},
			{
				path: 'historic-pickup',
				loadComponent: () => import('./pages').then((p) => p.HistoricPickupComponent)
			}
		]
	},
	{
		path: 'process-legal-request',
		loadComponent: () => import('./pages').then((c) => c.LegalProcessRequestsComponent),
		children: [
			{
				path: 'validated-contracts',
				loadComponent: () => import('./pages').then((p) => p.ValidatedContractsComponent)
			},
			{
				path: 'validated-certificates',
				loadComponent: () => import('./pages').then((p) => p.ValidatedCertificatesComponent)
			}
		]
	},
	{
		path: 'rate-manager',
		loadComponent: () => import('./pages').then((c) => c.RateManagerComponent),
		children: [
			/* {
				path: 'penalty',
				loadComponent: () => import('./pages').then((p) => p.RatePenaltyComponent)
			}, */
			{
				path: 'legalization',
				loadComponent: () => import('./pages').then((p) => p.RateLegalizationComponent)
			}
		]
	},
	{
		path: 'legal-administrator',
		loadComponent: () => import('./pages').then((c) => c.LegalAdminComponent),
		children: [
			{
				path: 'states-legalization',
				loadComponent: () => import('./pages').then((p) => p.StatesLegalizationComponent)
			},
			{
				path: 'timeline-legalization',
				loadComponent: () => import('./pages').then((p) => p.TimelineLegalizationComponent)
			}
		]
	}
];

@NgModule({
	declarations: [],
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class LegalRoutingModule {}
