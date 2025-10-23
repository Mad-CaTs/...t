import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { INavigationTab } from '@interfaces/shared.interface';
import { NavigationComponent } from '@shared/components/navigation/navigation.component';

@Component({
  selector: 'app-legalization-pickup-correction',
  standalone: true,
  imports: [CommonModule, NavigationComponent, RouterOutlet],
  templateUrl: './legalization-pickup-correction.component.html',
  styleUrls: ['./legalization-pickup-correction.component.scss']
})
export class LegalizationPickupCorrectionComponent {
  public readonly navigationData: INavigationTab[] = [
    { path: '/dashboard/legal/pickup-correction/pending-pickup', name: 'Pendientes' },
    { path: '/dashboard/legal/pickup-correction/historic-pickup', name: 'Historicos' }
  ];
}
