import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { INavigationTab } from '@interfaces/shared.interface';
import { NavigationComponent } from '@shared/components/navigation/navigation.component';

@Component({
  selector: 'app-legalization-requests',
  standalone: true,
  imports: [CommonModule, NavigationComponent, RouterOutlet],
  templateUrl: './legalization-requests.component.html',
  styleUrls: ['./legalization-requests.component.scss']
})
export class LegalizationRequestsComponent {

  public readonly navigationData: INavigationTab[] = [
    { path: '/dashboard/legal/legalization-requests/pending-requests', name: 'Pendientes' },
    { path: '/dashboard/legal/legalization-requests/validated-requests', name: 'Validadas' },

  ];

}
