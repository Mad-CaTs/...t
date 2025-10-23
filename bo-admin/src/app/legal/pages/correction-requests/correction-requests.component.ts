import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { NavigationComponent } from '@shared/components/navigation/navigation.component';
import { INavigationTab } from '@interfaces/shared.interface';

@Component({
  selector: 'app-correction-requests',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NavigationComponent
  ],
  template: `
    <div class="d-flex flex-column gap-6 p-6 bg-white w-100">
      <h1 class="fs-4 text-black fw-medium m-0">Solicitudes de Corrección</h1>
      <app-navigation *ngIf="!isHistoryView" [data]="navigationData" />
      <router-outlet></router-outlet>
    </div>
  `
})
export class CorrectionRequestsComponent {
  constructor(private router: Router) {}

  get isHistoryView(): boolean {
    return this.router.url.includes('/history/');
  }

  public readonly navigationData: INavigationTab[] = [
    { path: '/dashboard/legal/correction-requests/contracts', name: 'Contratos' },
    { path: '/dashboard/legal/correction-requests/certificates', name: 'Certificados' }
  ];
} 