import { Routes } from '@angular/router';
import { ProjectsComponent } from './projects.component';

const routes: Routes = [
  {
    path: '',
    component: ProjectsComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/projects-list/projects-list.component'),
          title:'Proyectos'

      },
      {
        path: 'details/:id',
        loadComponent: () => import('./pages/details/details.component'),
      },
    ],
  },
];

export default routes;
