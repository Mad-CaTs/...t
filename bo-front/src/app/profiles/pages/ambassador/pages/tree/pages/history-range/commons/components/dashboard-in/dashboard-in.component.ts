import { Component, Input } from '@angular/core';
import {
  TypeAccountNavigation,
  dashboardMdNavigation,
  dashboardNavigation,
} from './mock';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { NavigationComponent } from '@shared/components/navigation/navigation.component';
import { INavigation } from '@init-app/interfaces';
import { BoxCycleWeeklyComponent } from 'src/app/profiles/pages/ambassador/commons/components/box-cycle-weekly/box-cycle-weekly.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-in',
  templateUrl: './dashboard-in.component.html',
  standalone: true,
  imports: [
    CommonModule,
    NavigationComponent,
    BoxCycleWeeklyComponent,
    MatIconModule,
  ],
  styleUrls: [],
})
export class DashboardInComponent {
  @Input() docNumber: string = '949414218';
  @Input() fullname: string = 'Full name';

  public dashboardNavigation: INavigation[] = dashboardNavigation;
  public dahsboardNavigationTab: number = 1;

  public typeAccountNavigation = TypeAccountNavigation;
  public typeAccountPointsTab: number = 1;
  public typeAccountRangeAdvanceTab: number = 1;

  public dashboardMdNavigation = dashboardMdNavigation;
  public dahsboardMdNavigationTab: number = 1;

  constructor(
    private registry: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) {
    this.registry.addSvgIcon(
      'award',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/award.svg')
    );
    this.registry.addSvgIcon(
      'percentaje',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/Percentaje.svg')
    );
    this.registry.addSvgIcon(
      'percentaje_pink',
      sanitizer.bypassSecurityTrustResourceUrl(
        'assets/icons/Percentaje-Pink.svg'
      )
    );
  }
}
