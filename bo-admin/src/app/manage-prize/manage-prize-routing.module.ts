import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

type PagesModule = typeof import('./pages');
function loadPage<C extends keyof PagesModule>(component: C) {
  return () => import('./pages').then(m => m[component]);
}

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/dashboard/manage-prize/create-prize' },

  // --- Create prize ---
  { path: 'create-prize', loadComponent: loadPage('CreatePrizeComponent') },
  { path: 'create-prize/bonus-type', pathMatch: 'full', redirectTo: 'bonus-type' },
  { path: 'create-prize/attendance-control', pathMatch: 'full', redirectTo: 'attendance-control' },

  // --- Bonus type main ---
  {
    path: 'bonus-type',
    loadComponent: loadPage('BonusTypeComponent'),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'course' },
      { path: 'course', loadComponent: loadPage('BonusCourseComponent') },
      { path: 'travels', loadComponent: loadPage('BonusTravelComponent') },
      { path: 'car', loadComponent: loadPage('BonusCarComponent') },
      { path: 'estate', loadComponent: loadPage('BonusEstateComponent') }
    ]
  },

  // --- Car independent routes ---
  { path: 'bonus-type/car/prize-average', loadComponent: loadPage('PrizeAverageComponent') },
  { path: 'bonus-type/car/car-creation', loadComponent: loadPage('CarCreationComponent') },

  // Documents
  { path: 'bonus-type/car/documents', loadComponent: loadPage('DocumentsComponent') },
  { path: 'bonus-type/car/documents/partner/:id', loadComponent: loadPage('PartnerDocumentsComponent') },
  { path: 'bonus-type/car/documents/partner/:id/documents/:docId', loadComponent: loadPage('PartnerDocumentsIdComponent') },

  // Car assignment
  { path: 'bonus-type/car/car-assignment', loadComponent: loadPage('CarAssignmentComponent') },
  { path: 'bonus-type/car/car-assignment/socio/:id', loadComponent: loadPage('SocioAssignmentComponent') },


  // Bonus Payments
  { path: 'bonus-type/car/bonus-payments', loadComponent: loadPage('BonusPaymentsComponent') },
  // Bonus assignment
  {
    path: 'bonus-type/car/bonus-assignment',
    loadComponent: loadPage('BonusAssignmentComponent'),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'active' },
      { path: 'active', loadComponent: loadPage('BonusActiveComponent') },
      { path: 'history', loadComponent: loadPage('BonusHistoryComponent') }
    ]
  },

  // Proformas
  { 
    path: 'bonus-type/car/proformas',
    loadComponent: loadPage('ProformasComponent'),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'list' },
      { path: 'list', loadComponent: loadPage('ProformasListComponent') },
      { path: 'selected', loadComponent: loadPage('ProformasSelectedComponent') }
    ]
  },
  { path: 'bonus-type/car/proformas/view/:id', loadComponent: loadPage('ProformasViewComponent') },

  // Qualification
  {
    path: 'bonus-type/car/qualification',
    loadComponent: loadPage('QualificationComponent'),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'prequalified' },
      { path: 'prequalified', loadComponent: loadPage('PrequalifiedComponent') },
      { path: 'qualified', loadComponent: loadPage('QualifiedComponent') },
    ]
  },
  { path: 'bonus-type/car/qualification/detail-partner-rating/:id', loadComponent: loadPage('DetailPartnerRatingComponent') },

  // --- Attendance control ---
  { path: 'attendance-control', loadComponent: loadPage('AttendanceControlComponent') },

  // --- Payments ---
  {
    path: 'payments',
    loadComponent: loadPage('PaymentsComponent'),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'initial' },
      { path: 'initial', loadComponent: loadPage('InitialPaymentsComponent') },
      { path: 'installments', loadComponent: loadPage('InstallmentsPaymentsComponent') }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagePrizeRoutingModule {}
