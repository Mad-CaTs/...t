import { Component, inject, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { RejectedPaymentResponse } from 'src/app/profiles/pages/partner/pages/my-products/commons/interfaces/pay-fee.interface';
import { ProductService } from '../../services/product-service.service';
import { AccordionModule } from 'primeng/accordion';
import { DividerModule } from 'primeng/divider';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
	selector: 'app-rejected-payment-modal',
	standalone: true,
	imports: [AccordionModule, DividerModule, ProgressSpinnerModule],
	templateUrl: './rejected-payment-modal.component.html',
	styleUrl: './rejected-payment-modal.component.scss'
})
export class RejectedPaymentModalComponent implements OnInit {
	public ref: DynamicDialogRef = inject(DynamicDialogRef);
	public config: DynamicDialogConfig = inject(DynamicDialogConfig);
	private _productService: ProductService = inject(ProductService);
	public isLoading: boolean = false;
	public statusName: string;
	public rejected: RejectedPaymentResponse;

	ngOnInit(): void {
		this.statusName = this.config.data?.element?.statusName;
		this.initializeRejectedPaymentDetails();
	}

	initializeRejectedPaymentDetails(): void {
		this.isLoading = true;
		const idPayment = this.config.data?.element?.idPayment;
		this._productService.getPaymentRejectionByIdPayment(idPayment).subscribe({
			next: (data) => {
				this.rejected = data;
				setTimeout(() => {
					this.isLoading = false;
				}, 500);
			},
			error: (error) => {
				setTimeout(() => {
					this.isLoading = false;
					this.ref.close();
				}, 500);
			}
		});
	}
}
