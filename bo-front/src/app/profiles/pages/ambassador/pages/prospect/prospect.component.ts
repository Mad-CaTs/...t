import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { INavigation } from '@init-app/interfaces';
import { NavigationComponent } from '@shared/components/navigation/navigation.component';
import { PROSPECT_TABS } from '../store/commons/constants';
import { NewProspectComponent } from './components/new-prospect/new-prospect.component';
import { ListProspectComponent } from './components/list-prospect/list-prospect.component';

@Component({
  selector: 'app-prospect',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    NavigationComponent,
    NewProspectComponent,
    ListProspectComponent
  ],
  templateUrl: './prospect.component.html',
  styleUrl: './prospect.component.scss'
})
export class ProspectComponent {
  tabs: INavigation[] = PROSPECT_TABS;
  currentTab: number = 1;

  constructor() { }

  ngOnInit(): void {
  }

  setTab(id: number): void {
    this.currentTab = id;
  }

  goBack(): void {
    if (this.currentTab > 1) {
      this.currentTab--;
    }
  }
}
