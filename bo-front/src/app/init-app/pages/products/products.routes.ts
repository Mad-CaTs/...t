import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./products.component'),
    title: 'Productos',
  },
  {
    path: ':product',
    loadComponent: () =>
      import('./commons/components/product-detail/product-detail.component'),
    title: 'Productos',
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/home',
  },
];

export default routes;
