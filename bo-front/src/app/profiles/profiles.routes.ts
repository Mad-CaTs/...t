import { Routes } from '@angular/router';
import { ProfilesComponent } from './profiles.component';

const routes: Routes = [
  {
    path: '',
    component: ProfilesComponent,
    children: [
      {
        path: 'ambassador',
        loadChildren: () => import('./pages/ambassador/ambassador.routes'),
      },
      {
        path: 'partner',
        loadChildren: () => import('./pages/partner/partner.routes'),
      },
      {
        path: 'user',
        loadChildren: () => import('./pages/ambassador/ambassador.routes'),
      },
      {
        path: 'promotor',
        loadChildren: () => import('./pages/ambassador/ambassador.routes'),
      },
      
    ],
  },
];

export default routes;
