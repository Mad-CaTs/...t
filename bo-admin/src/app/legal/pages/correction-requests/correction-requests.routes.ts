import { Routes } from '@angular/router';
import { CorrectionRequestsComponent } from './correction-requests.component';
import { CorrectionListComponent } from './list/correction-list.component';
import { HistoryComponent } from './history/history.component';
import { CorrectionDetailComponent } from './correction-detail/correction-detail.component';

export const CORRECTION_REQUESTS_ROUTES: Routes = [
  {
    path: '',
    component: CorrectionRequestsComponent,
    children: [
      {
        path: '',
        redirectTo: 'contracts',
        pathMatch: 'full'
      },
      {
        path: 'contracts',
        component: CorrectionListComponent
      },
      {
        path: 'certificates',
        component: CorrectionListComponent
      },
      {
        path: 'contracts/history/:username',
        component: HistoryComponent
      },
      {
        path: 'certificates/history/:username',
        component: HistoryComponent
      },
      {
        path: 'contracts/history/:username/detail',
        component: CorrectionDetailComponent
      },
      {
        path: 'certificates/history/:username/detail',
        component: CorrectionDetailComponent
      }
    ]
  }
]; 