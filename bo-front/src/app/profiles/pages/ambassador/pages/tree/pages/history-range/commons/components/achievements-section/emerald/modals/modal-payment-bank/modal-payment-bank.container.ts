import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ISelect } from '@shared/interfaces/forms-control';
import { tap } from 'rxjs';
import { ModalPaymentBankComponent } from './modal-payment-bank.component';
import { ModalPartnerPaymentService } from '../../../../../../../../../../../ambassador/pages/new-partner/pages/new-partner-payment/servicio/new-partner-payment.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SelectedPackageService } from '../../../../../../../../../../../ambassador/pages/new-partner/commons/services/package-detail.service';
import { AuthService } from 'src/app/authentication/commons/services/services-auth/auth.service';

@Component({
	selector: 'app-modal-payment-bank',
	templateUrl: './modal-payment-bank.container.html',
	standalone: true,
	imports: [CommonModule, ModalPaymentBankComponent],
	styleUrls: ['./modal-payment-bank.container.scss']
})
export class ModalPaymentBankContainer {
	public paymenttypeList: ISelect[];
	public bussinesAccounts: [];
	companyName: string | undefined;
	public selectedMethod: any = null;

	constructor(
		public selectedPackageService: SelectedPackageService,
		private modalPartnerPaymentService: ModalPartnerPaymentService,
		public ref: DynamicDialogRef,
		public config: DynamicDialogConfig,
		public authService: AuthService
	) {
		this.getBankAccountsFromService();
		this.loadCompanyName();
	}

	ngOnInit(): void {}

	getBankAccountsFromService(): void {
		this.modalPartnerPaymentService
			.getBankAccountsForPaymentType(this.methodSelected.idPaymentType)
			.pipe(tap((bussinesAccounts: []) => (this.bussinesAccounts = bussinesAccounts)))
			.subscribe();
	}



	private loadCompanyName(): void {
		this.authService.getCompanyData().subscribe({
			next: (response) => {
				const companies = response.data;
				const company = companies.find((c: any) => c.idCompany === 1);
				this.companyName = company?.companyName;
			},
			error: (error) => {
				console.error('Error loading company name:', error);
			}
		});
	}



	get getInputData() {
		return this.config.data;
	}




 	get methodSelected() {
		return this.getInputData.voucherToEdit
			? this.getInputData.voucherToEdit.methodSelected
			: this.getInputData.methodSelected;
	}

	closeModal() {
		this.ref.close();
	}

	addVouchers(data) {
		this.ref.close({ ...data, indexEdit: this.getInputData.indexEdit });
	}
}
