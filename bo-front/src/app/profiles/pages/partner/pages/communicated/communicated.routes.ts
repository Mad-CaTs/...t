import { Routes } from '@angular/router';
import { CommunicatedComponent } from './communicated.component';

const routes: Routes = [
  {
    path: '',
    component: CommunicatedComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/comunicated/communicated.component'),
          title:'Comunicados'
      },
      {
        path: 'details/:id',
        loadComponent: () => import('./commons/components/details/details.component'),
      },
      {
        path: 'overview',
        loadComponent: () => import('./pages/overview/overview.component'),
      },
    ],
  },
];

export default routes;
