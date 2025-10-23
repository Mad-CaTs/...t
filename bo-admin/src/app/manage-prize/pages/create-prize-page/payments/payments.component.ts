import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { INavigationTab } from '@interfaces/shared.interface';
import { NavigationComponent } from '@shared/components/navigation/navigation.component';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule, NavigationComponent, RouterOutlet],
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss']
})
export class PaymentsComponent {
  public readonly navigationData: INavigationTab[] = [
        { path: '/dashboard/manage-prize/payments/initial', name: 'Inicial' },
        { path: '/dashboard/manage-prize/payments/installments', name: 'Cuotas' }

    ];
}
