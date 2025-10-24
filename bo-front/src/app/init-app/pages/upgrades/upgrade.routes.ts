import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./upgrades.component'),
    title: 'Actualizaciones',

    children: [
      {
        path: 'news',
        loadComponent: () => import('./pages/news/news.component'),
      },

      {
        path: 'news/:type',
        loadComponent: () =>
          import('./pages/news-detail/news-detail.component'),
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: '/home/upgrades/news',
      },
    ],
  },
];

export default routes;
