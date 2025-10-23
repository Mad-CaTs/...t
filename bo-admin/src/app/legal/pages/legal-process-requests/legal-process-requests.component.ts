import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { INavigationTab } from '@interfaces/shared.interface';
import { NavigationComponent } from '@shared/components/navigation/navigation.component';

@Component({
  selector: 'app-legal-process-requests',
  standalone: true,
  imports: [CommonModule, NavigationComponent, RouterOutlet],
  templateUrl: './legal-process-requests.component.html',
  styleUrls: ['./legal-process-requests.component.scss']
})
export class LegalProcessRequestsComponent {

  public readonly navigationData: INavigationTab[] = [
    { path: '/dashboard/legal/process-legal-request/validated-contracts', name: 'Contratos' },
    { path: '/dashboard/legal/process-legal-request/validated-certificates', name: 'Certificados' }
  ];

}
