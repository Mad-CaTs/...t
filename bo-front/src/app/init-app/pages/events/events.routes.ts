import { Routes } from '@angular/router';

const routes: Routes = [
  { path: '', loadComponent: () => import('./pages').then(p => p.EventListComponent), title: 'Eventos' },
  { path: 'buy/:id', loadComponent: () => import('./pages').then(p => p.EventPurchaseComponent), title: 'Comprar Evento' },
  { path: ':id', loadComponent: () => import('./pages').then(p => p.EventDetailComponent), title: 'Detalle de evento' },
];

export default routes;