import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { DynamicDialogRef, DynamicDialogConfig, DialogService } from 'primeng/dynamicdialog';
import { ToastModule } from 'primeng/toast';
import { PointRangesData } from 'src/app/profiles/pages/ambassador/pages/tree/pages/range-manager/commons/interfaces';
import { TableModule } from 'primeng/table';
import { ISelect } from '@shared/interfaces/forms-control';
import { Router } from '@angular/router';
import { InputComponent } from '@shared/components/form-control/input/input.component';
import { mockCertificateData } from '../../moks/certificate.mock';
import {  LEGALIZATION_ALERT_MESSAGE_GENERA } from 'src/app/profiles/pages/partner/pages/my-products/pages/documents/pages/validate-documents/commons/constants';
import { LegalizationNoticeModal } from 'src/app/profiles/pages/partner/pages/my-products/pages/documents/pages/validate-documents/commons/components/confirm-shipping-address/commons/modals/app-legalization-notice-modal/app-legalization-notice-modal.component';

@Component({
	selector: 'app-modal-processing-component',
	standalone: true,
	providers: [MessageService],
	imports: [CommonModule, DialogModule, MatIconModule],
	templateUrl: './modal-processing-component.html',
	styleUrl: './modal-processing-component.scss'
})
export class ModalProcessingComponent implements OnInit {
	isLoading = false;
	dialogRef: DynamicDialogRef;
	progress = 20;

	constructor(
		public ref: DynamicDialogRef,
		public config: DynamicDialogConfig,
		private router: Router,
		private dialogService: DialogService
	) {}
	ngOnInit(): void {
		this.initData();
	}

	initData() {
		this.simulateProgress();
	}

	simulateProgress(): void {
		const interval = setInterval(() => {
			if (this.progress < 100) {
				this.progress += 10;
			} else {
				clearInterval(interval);
			}
		}, 500); // Simula avance cada 0.5s
	}
	confirm(): void {
		this.ref.close();
	}

	closeModal() {
		this.ref.close();
	}

	onGenerate() {
		this.closeModal();
	}

	/* 	onContinue() {
		this.dataSharingService.setSelectedProduct(this.data?.selectedElement);
		const payTypeData = JSON.stringify(this.selectedPayTypeOption);
		this.router.navigate(['/profile/partner/my-products/validate-documents'], {
			queryParams: { from: 'legalization', payTypeData}
		});
		this.closeModal();
	} */

	beforeSubmit() {
		this.closeModal();
		const width = window.innerWidth < 768 ? '90vw' : '40vw'; 
		this.dialogService
			.open(LegalizationNoticeModal, {
				width: width,
				closable: false,
				dismissableMask: false,
				data: {
					title: '¡Importante!',
					message: LEGALIZATION_ALERT_MESSAGE_GENERA,
					buttonText: 'Entendido',
					returnValue: 'entendido'
				}
			})
			.onClose.subscribe((res) => {
				if (res === 'entendido') {
/* 					this.onSubmit();
 */				}
			});
	}
}
