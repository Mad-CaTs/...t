import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PaymentSharedService } from '../../../../../commons/services/PaymentSharedService';
import { IPaymentDetail } from '../payment-detail-comission/commons/interfaces/payments-detail-comissions.interfaces';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'app-payment-detail-overview',
	templateUrl: './payment-detail-overview.component.html',
	standalone: true,
	styleUrls: [],
	imports: [CommonModule]
})
export class PaymentDetailOverviewComponent implements OnInit {
	paymentDetail: IPaymentDetail;

	constructor(private route: ActivatedRoute, private paymentSharedService: PaymentSharedService) {}

	ngOnInit(): void {
		this.loadPaymentDetail();
	}

	private loadPaymentDetail(): void {
		const id = Number(this.route.snapshot.paramMap.get('id'));
		this.paymentDetail = this.paymentSharedService.getPaymentById(id);
	}
}
