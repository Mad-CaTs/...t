import { ChangeDetectorRef, Component, OnInit, SimpleChanges } from '@angular/core';
import { paymentsAndComissionsNavigation } from './commons/mocks/mock';
import { Router, RouterLink } from '@angular/router';
import { NavigationComponent } from '@shared/components/navigation/navigation.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import PaymentCardComponent from './pages/components/payment-card/payment-card.component';
import { ComisionesService } from './commons/services/comisione.service';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';
import { PaymentSharedService } from './commons/services/PaymentSharedService';
import { PaginationNgPrimeComponent } from '@shared/components/pagination-ng-prime/pagination-ng-prime.component';

@Component({
	selector: 'app-payments-and-comissions',
	templateUrl: './payments-and-comissions.component.html',
	standalone: true,
	imports: [
		CommonModule,
		NavigationComponent,
		MatIconModule,
		RouterLink,
		PaymentCardComponent,
		PaginationNgPrimeComponent
	],
	styleUrls: ['./payments-and-comissions.component.scss']
})
export default class PaymentsAndComissionsComponent implements OnInit {
	public navigation = paymentsAndComissionsNavigation;
	public selectedTab = 1;
	public userId: number;
	payments: any[] = [];
	public isLoading: boolean = false;
	rows: number = 10;
	public totalRecords: number = 0;
	public align: string = 'right';
	currentPage: number = 1;
	latestPageEvent: any;

	constructor(
		private router: Router,
		private comisionesService: ComisionesService,
		public userInfoService: UserInfoService,
		private paymentSharedService: PaymentSharedService,
		private cdr: ChangeDetectorRef
	) { }

	ngOnInit(): void {
		this.loadData(this.currentPage, this.rows);
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['currentPage'] || changes['rows'] || changes['totalRecords']) {

		}
	}

	public onNavigate(id: number) {
		if (id === 1) this.router.navigate(['/profile/ambassador/payments']);
		if (id === 2) this.router.navigate(['/profile/ambassador/payments/wallet']);
		if (id === 3) this.router.navigate(['/profile/ambassador/payments/conciliation']);
		if (id === 4) this.router.navigate(['/profile/ambassador/payments/rent']);
		if (id === 5) this.router.navigate(['/profile/ambassador/payments/prize']);
	}

	loadData(page: number, rows: number): void {
		this.isLoading = true;
		page = page - 1;
		this.userId = this.userInfoService.userInfo?.id;

		this.comisionesService.getInfoWithPagination(this.userId, page, rows).subscribe(
			(response) => {
				this.payments = response.data || [];
				this.totalRecords = response.total || 0;
				this.currentPage = page;
				this.paymentSharedService.setPayments(this.payments);
				this.isLoading = false;
			},
			(error) => {
				console.error('Error al cargar los datos:', error);
				this.isLoading = false;
			}
		);
	}

	onPageChange(event: any): void {
		this.currentPage = event.page + 1;
		this.rows = event.rows;
		this.loadData(this.currentPage, this.rows);
		this.cdr.detectChanges();
	}

	onRefresh(event: any): void {
		this.currentPage = 1;
		this.rows = event.rows;
		this.loadData(this.currentPage, this.rows);
	}
}
