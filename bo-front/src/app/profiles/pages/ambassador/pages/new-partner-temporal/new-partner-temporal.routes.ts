import { Routes } from '@angular/router';
import NewPartnerTemporalComponent from './new-partner-temporal.component';

const routes: Routes = [

  {
    path: '',
    component: NewPartnerTemporalComponent,
    title: 'Nuevo Socio temporal',
  },
  {
    path: 'usertype',
    loadComponent: () => import('./user-types/user-types.component'),
    title: 'Seleccion de tipo de usuario',
  }


];

export default routes;