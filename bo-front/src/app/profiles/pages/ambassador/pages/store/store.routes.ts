import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./store.component'),
    title: 'Tienda',

  },

];
export default routes;
