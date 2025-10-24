import { Component } from '@angular/core';
import { NavigationComponent } from '@shared/components/navigation/navigation.component';
import MigrationPackageComponent from '../migration-package/migration-package.component';
import { MIGRATION_TABS } from 'src/app/profiles/pages/ambassador/pages/store/commons/constants';
import { INavigation } from '@init-app/interfaces';
import { CommonModule } from '@angular/common';
import { DialogService } from 'primeng/dynamicdialog';
import MigrationPortafoliosComponent from '../migration-portafolios/migration-portafolios.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
	selector: 'app-migration-payment',
	standalone: true,
	imports: [NavigationComponent, MigrationPackageComponent, MigrationPortafoliosComponent, CommonModule],
	templateUrl: './migration-payment.component.html',
	styleUrl: './migration-payment.component.scss',
	providers: [DialogService]
})
export default class MigrationPaymentComponent {
	currentTab: number = 1;
	tabs: INavigation[] = MIGRATION_TABS;
	selectdedPakage: any;
	idSus: number;
	selectedPaymentData: any;

 	constructor(private route: ActivatedRoute, private router: Router) {
		this.route.queryParams.subscribe((params) => {
			this.currentTab = params['currentTab'] ? Number(params['currentTab']) : 1;
		});
	}

		setTab(id: number): void {
		this.currentTab = id;
		this.router.navigate([], {
			relativeTo: this.route,
			queryParams: { currentTab: id },
			queryParamsHandling: 'merge' 
		});
	} 

 	/* setTab(id: number): void {
		this.currentTab = id;
	}  */
}
