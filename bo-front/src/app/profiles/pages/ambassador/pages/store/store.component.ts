import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { NavigationComponent } from '@shared/components/navigation/navigation.component';
import { INavigation } from '@init-app/interfaces';
import StorePackagesComponent from './pages/store-packages/store-packages.component';
import StoreServicesComponent from './pages/store-services/store-services.component';
import StoreProdutsComponent from './pages/store-produts/store-produts.component';
import { MIGRATION_TABS, TABS } from './commons/constants';
import { ActivatedRoute } from '@angular/router';
import { NewProspectComponent } from '../prospect/components/new-prospect/new-prospect.component';
import PromotionalGuestRegistrationComponent from './pages/store-promotional-code/componets/registration/promotional-guest-registration.component';
import StorePromotionalCodeComponent from './pages/store-promotional-code/store-promotional-code.component';

@Component({
	selector: 'app-store',
	templateUrl: './store.component.html',
	styleUrls: ['./store.component.scss'],
	standalone: true,
  providers:[],
	imports: [
		CommonModule,
		MatIconModule,
		StoreServicesComponent,
		NavigationComponent,
		StorePackagesComponent,
		StoreProdutsComponent,
   StorePromotionalCodeComponent
	]
})
export default class StoreComponent implements OnInit {
	tabs: INavigation[] = TABS;

	constructor(private route: ActivatedRoute) {}
	ngOnInit(): void {
	/* 	this.route.queryParams.subscribe((params) => {
			if (params['showTwoTabs']) {
				this.tabs = this.getCustomTabs();
        this.isFromMigration = true;

			}else{
        this.tabs = TABS;
      }
		}); */
	}

	currentTab: number = 1;

	setTab(id: number): void {
		this.currentTab = id;
	}

	goBack(): void {
		if (this.currentTab > 1) {
			this.currentTab--;
		}
	}

/* 	getCustomTabs(): INavigation[] {
		return  MIGRATION_TABS
		
		
	} */
}
