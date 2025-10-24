import { Routes } from '@angular/router';
import NewPartnerComponent from './new-partner.component';

const routes: Routes = [
  {
    path: '',
    component: NewPartnerComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./new-partner.container'),
        title: 'Nuevo Socio',

      },
     
    ],
  },
];

export default routes;
