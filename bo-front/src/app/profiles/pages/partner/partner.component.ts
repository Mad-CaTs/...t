import { Component } from '@angular/core';
import { MainLayoutComponent } from '../../commons/layout/main-layout/main-layout.component';
import { RoutesMenu } from '@init-app/components/header/commons/interfaces';
import { partnerRoutes } from './commons/constants';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-partner',
  standalone: true,
  imports: [RouterOutlet, MainLayoutComponent, PartnerComponent],
  templateUrl: './partner.component.html',
  styleUrl: './partner.component.scss',
})
export class PartnerComponent {
 

  public routes: RoutesMenu[] = partnerRoutes;
}
