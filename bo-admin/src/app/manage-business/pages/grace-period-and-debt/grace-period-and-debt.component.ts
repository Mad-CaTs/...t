import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationComponent } from '@shared/components/navigation/navigation.component';

@Component({
  selector: 'app-grace-period-and-debt',
  templateUrl: './grace-period-and-debt.component.html',
  styleUrls: ['./grace-period-and-debt.component.scss'],
  standalone: true,
  imports: [CommonModule, NavigationComponent, RouterOutlet]
})
export class GracePeriodAndDebtComponent {
  public readonly navigationData = [
    { path: '/dashboard/manage-business/grace-and-debt', name: 'Dias de periodo de gracia' },
    { path: '/dashboard/manage-business/grace-and-debt/debt', name: 'Bandeja de porcentaje de mora' },
    { path: '/dashboard/manage-business/grace-and-debt/debt-type', name: 'Tipo de porcentaje de mora' },
  ];

}
