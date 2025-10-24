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
import { CertificateModalPresenter } from './certificate-modal.presenter';
import { mockCertificateData } from '../../moks/certificate.mock';
import { ModalProcessingComponent } from '../modal-processing/modal-processing-component';

@Component({
	selector: 'app-modal-generate-document',
	standalone: true,
	providers: [MessageService, CertificateModalPresenter],
	imports: [CommonModule, DialogModule, MatIconModule, InputComponent],
	templateUrl: './modal-generate-document.html',
	styleUrl: './modal-generate-document.scss'
})
export class ModalGenerateDocumentComponent implements OnInit {
	isLoading = false;
	dialogRef: DynamicDialogRef;
	form = this.presenter.form;

	constructor(
		public ref: DynamicDialogRef,
		public config: DynamicDialogConfig,
		public presenter: CertificateModalPresenter,
		private router: Router,
		private dialogService:DialogService
	) {}
	ngOnInit(): void {
		this.initData();
	}

	initData() {
		this.presenter.form.patchValue(mockCertificateData);

	}

	closeModal() {
		this.ref.close();
	}

/* 	onGenerate() {
		this.closeModal();
	} */

	onGenerate(): void {
		this.closeModal();
	  
		// Abre el modal de procesamiento
		this.dialogService.open(ModalProcessingComponent, {
		  header: '', // sin header
		  width: '500px',
		  closable: false, // evita cerrarlo antes de tiempo
		  dismissableMask: true
		});
	  }
	  

	/* 	onContinue() {
		this.dataSharingService.setSelectedProduct(this.data?.selectedElement);
		const payTypeData = JSON.stringify(this.selectedPayTypeOption);
		this.router.navigate(['/profile/partner/my-products/validate-documents'], {
			queryParams: { from: 'legalization', payTypeData}
		});
		this.closeModal();
	} */
}
