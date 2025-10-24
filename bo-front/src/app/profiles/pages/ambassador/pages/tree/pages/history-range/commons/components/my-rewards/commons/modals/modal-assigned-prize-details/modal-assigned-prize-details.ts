import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { SelectComponent } from '@shared/components/form-control/select/select.component';
import {
	DialogService,
	DynamicDialogConfig,
	DynamicDialogModule,
	DynamicDialogRef
} from 'primeng/dynamicdialog';
import { DialogModule } from 'primeng/dialog';
import { Router } from '@angular/router';

@Component({
	selector: 'modal-assigned-prize-detail',
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		MatIconModule,
		SelectComponent,
		DialogModule,
		DynamicDialogModule
	],
	templateUrl: './modal-assigned-prize-details.html',
	styleUrls: ['./modal-assigned-prize-details.scss'],
	providers: [DialogService]
})
export class ModalAssignedPrizeDetailComponent implements OnInit {
	@Input() isLoading: boolean;
	product: any;
	selectedElement: any;
	@Output() botonClickeado = new EventEmitter<void>();
	productId: number;
	loadingRef: any;
	hideFields: boolean = false;
	selectedContent: any;
	isImageZoomed: boolean = false;
	paymentDetails: any = {};
	walletBlock: boolean = false;
	vouchers: Array<{ imagePath: string }> = [];
	selectedVoucher: { type: string; imagePath: string } | null = null;

	selectedSponsorId: any = null;
	constructor(
		private router: Router,
		public ref: DynamicDialogRef,
		public config: DynamicDialogConfig,
		private dialogService: DialogService
	) {}

	ngOnInit(): void {
		this.initializePaymentDetails();
		this.setImageContent();
	}

	initializePaymentDetails(): void {
		this.paymentDetails = this.config.data?.element;
		this.productId = this.config.data?.productId;
		this.walletBlock = this.config.data?.walletBlock;
		if (this.config.data?.hideFields !== undefined) {
			this.hideFields = this.config.data.hideFields;
		}
	}

	setImageContent(): void {
		if (this.paymentDetails?.vouchers?.length > 0) {
			this.selectedVoucher = {
				type: 'image',
				imagePath: this.paymentDetails.vouchers[0].pathPicture
			};

			this.vouchers = this.paymentDetails.vouchers.map((voucher) => ({
				imagePath: voucher.pathPicture
			}));
		} else {
			this.selectedVoucher = null;
			this.vouchers = [];
		}
	}

	selectVoucher(voucher: { imagePath: string }): void {
		this.selectedVoucher = {
			type: 'image',
			imagePath: voucher.imagePath
		};
	}

	closeModal() {
		this.ref.close();
	}

	selectContent(type: string, index: number) {
		if (type === 'image') {
			this.selectedContent = {
				type: 'image',
				imagePath: this.paymentDetails.vouchers[index]?.pathPicture
			};
		}
	}

	toggleImageZoom() {
		this.isImageZoomed = !this.isImageZoomed;
	}
}
