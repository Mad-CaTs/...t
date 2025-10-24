import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { NavigationComponent } from '@shared/components/navigation/navigation.component';
import { promotionalCodeNavigationMock } from './commons/mocks/mock';
import PromotionalGuestRegistrationComponent from './componets/registration/promotional-guest-registration.component';
import { TableRegisteredListComponent } from './componets/registered-list/table-registered-list/table-registered-list.component';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';
import { ITableRegisteredList } from './componets/registered-list/commons/interfaces/periodCompound';
import { BuyPackageService } from '../../services/buy-package.service';
import { PartnerListResponseDTO } from '../../../tree/commons/interfaces/partnerList';

@Component({
	selector: 'app-store-promotional-code',
	standalone: true,
	imports: [
		CommonModule,
		NavigationComponent,
		PromotionalGuestRegistrationComponent,
		TableRegisteredListComponent
	],
	templateUrl: './store-promotional-code.component.html',
	styleUrl: './store-promotional-code.component.scss'
})
export default class StorePromotionalCodeComponent {
	public navigation = promotionalCodeNavigationMock;
	public currentTab: number = 1;
	public userId: number;
	isLoading: boolean = false;
	public isPromotionalGuest: boolean = true;
	@ViewChild(TableRegisteredListComponent) tableRegisteredList: TableRegisteredListComponent;
	tableData: PartnerListResponseDTO[] = [];
	totalRecords: number = 0;

	constructor(private userInfoService: UserInfoService, private buyPackageService: BuyPackageService) {
		this.userId = userInfoService.userInfo.id;
	}

	onTabChange(tabIndex: number): void {
		this.currentTab = tabIndex;
		if (tabIndex === 2) {
			this.loadData(1, 10);

			/* 			this.loadData(this.userId);
			 */
			this.resetDataOnTabChange();
		}
	}

	resetDataOnTabChange(): void {
		this.tableData = [];
	}

loadData(page: number, rows: number): void {
		this.isLoading = true;
		const offset = page - 1;
		this.buyPackageService.getRegisteredList(this.userId, offset, rows).subscribe(
			(response) => {
				this.tableData = response.data;
				this.isLoading = false;
				this.totalRecords = response.total;
			},
			(error) => {
				console.error('Error al obtener los datos:', error);
				this.isLoading = false;
			}
		);
	}

	onRefresh(event: any): void {
		const rows = event.rows;
		this.loadData(1, rows);
	}

	onPageChange(event: any): void {
		const page = event.page + 1;
		const rows = event.rows;
		this.loadData(page, rows);
	}
}
