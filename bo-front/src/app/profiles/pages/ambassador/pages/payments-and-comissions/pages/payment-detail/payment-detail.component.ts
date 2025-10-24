import { Component, Input } from '@angular/core';

import { paymentDetailNavigation } from './commons/mocks/mock';

import { ActivatedRoute, Router } from '@angular/router';
import { NavigationComponent } from '@shared/components/navigation/navigation.component';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { PaymentDetailOverviewComponent } from './commons/components/payment-detail-overview/payment-detail-overview.component';
import { PaymentDetailComissionComponent } from './commons/components/payment-detail-comission/payment-detail-comission.component';
import { PaymentSharedService } from '../../commons/services/PaymentSharedService';
import PaymentCardComponent from '../components/payment-card/payment-card.component';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';
import { ComisionesService } from '../../commons/services/comisione.service';
import {
	IAllData,
	IPaymentDetail
} from './commons/components/payment-detail-comission/commons/interfaces/payments-detail-comissions.interfaces';

@Component({
	selector: 'app-payment-detail',
	templateUrl: './payment-detail.component.html',
	standalone: true,
	imports: [
		CommonModule,
		NavigationComponent,
		MatIconModule,
		PaymentDetailOverviewComponent,
		PaymentDetailComissionComponent,
		PaymentCardComponent
	],
	styleUrls: []
})
export class PaymentDetailComponent {
	public navigation = paymentDetailNavigation;
	public currentTab = 1;
	@Input() userId!: number;
	@Input() periodId!: number;
	public allTableData: IAllData = {} as IAllData;
	/* 	public allTableData: any = {};
	 */ loading: boolean = false;
	paymentDetail: IPaymentDetail;

	constructor(
		public router: Router,
		private route: ActivatedRoute,
		private paymentSharedService: PaymentSharedService,
		private userInfoService: UserInfoService,
		private comisionesService: ComisionesService
	) {}

	ngOnInit(): void {
		this.initializePaymentDetails();
		this.getAllTableData();
	}

	initializePaymentDetails(): void {
		this.periodId = Number(this.route.snapshot.paramMap.get('id'));
		this.userId = this.userInfoService.userInfo?.id;
		this.paymentDetail = this.paymentSharedService.getPaymentById(this.periodId);
	}

	getAllTableData(): void {
		this.loading = true;
		this.comisionesService.getBonusInfo(this.userId, this.periodId).subscribe(
			(response) => {
				if (!response) {
					console.error('Error: La respuesta de la API es null.');
					this.loading = false;
					return;
				}

				const data = response.data || {};

				this.allTableData = {
					directRecommendationBonusList: data.directRecommendationBonusList || [],
					teamRecommendationBonusList: data.teamRecommendationBonusList || [],
					quotesBonusList: data.quotesBonusList || [],
					secondMembershipBonusList: data.secondMembershipBonusList || [],
					extraMembershipBonusList: data.extraMembershipBonusList || [],
					migrationsBonusList: data.migrationsBonusList || [],
					awardRankBonusList: data.awardRankBonusList || [],
					exclusiveBrandsBonusList: data.exclusiveBrandsBonusList || [],
					founderBonusList: data.founderBonusList || [],
					regularizationBonusList: data.regularizationBonusList || []

				};

				console.log('this.allTableData', this.allTableData);
				
				this.loading = false;
			},
			(error) => {
				console.error('Error al obtener datos de la API:', error);
				this.loading = false;
			}
		);
	}
}
