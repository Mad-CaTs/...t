import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

type PagesModule = typeof import('./pages');
function loadPage<C extends keyof PagesModule>(component: C) {
  return () => import('./pages').then(m => m[component]);
}

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/dashboard/events/event-types' },
  { path: 'event-types', loadComponent: loadPage('TypeEventComponent') },
  { path: 'entry-types', loadComponent: loadPage('TypeEntryComponent') },
  { path: 'seat-types', loadComponent: loadPage('TypeSeatComponent') },
  { path: 'event-venues', loadComponent: loadPage('EventVenueComponent') },
  { path: 'create-event', loadComponent: loadPage('CreateEventComponent') },
  { path: 'create-event/new', loadComponent: loadPage('FormEventComponent') },
  { path: 'create-event/edit/:id', loadComponent: loadPage('FormEventComponent') },
  { path: 'create-event/detail/:id', loadComponent: loadPage('EventDetailComponent') },
  { path: 'zones-pricing', loadComponent: loadPage('CreateZonesPricingComponent') },
  { path: 'zones-pricing/edit/:eventId', loadComponent: loadPage('FormZonesPricingComponent') },
  { path: 'package-event', loadComponent: loadPage('CreateEventPackageComponent') },
  { path: 'package-event/new', loadComponent: loadPage('FormEventPackageComponent') },
  { path: 'package-event/edit/:packageId', loadComponent: loadPage('FormEventPackageComponent') },
  { path: 'event-history', loadComponent: loadPage('EventHistoryComponent') },
  { path: 'event-history/edit/:id', loadComponent: loadPage('EditEventHistoryComponent') },
  { path: 'event-history/view/:id', loadComponent: loadPage('EventHistoryViewComponent') }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventRoutingModule {}
