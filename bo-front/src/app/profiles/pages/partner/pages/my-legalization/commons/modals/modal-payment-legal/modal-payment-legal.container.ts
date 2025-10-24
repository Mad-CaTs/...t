import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ISelect } from '@shared/interfaces/forms-control';
import { tap } from 'rxjs';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AuthService } from 'src/app/authentication/commons/services/services-auth/auth.service';
import { ModalPaymentLegalComponent } from './modal-payment-legal.component';
import { ModalPartnerPaymentService } from 'src/app/profiles/pages/ambassador/pages/new-partner/pages/new-partner-payment/servicio/new-partner-payment.service';
import { SelectedPackageService } from 'src/app/profiles/pages/ambassador/pages/new-partner/commons/services/package-detail.service';

@Component({
	selector: 'app-modal-payment-legal',
	templateUrl: './modal-payment-legal.container.html',
	standalone: true,
	imports: [CommonModule, ModalPaymentLegalComponent],
	styleUrls: ['./modal-payment-legal.container.css']
})
export class ModalPaymentLegalContainer {
	public paymenttypeList: ISelect[];
	public bussinesAccounts: [];
	companyName: string | undefined;
	public selectedMethod: any = null; 
  listaVouchersDesdeApi: any[] = [];

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

	ngOnInit(): void {
		  /*   this.listaVouchersDesdeApi = this.config.data.listaVouchersDesdeApi || [];
    console.log('Vouchers en modal:', this.listaVouchersDesdeApi); */

	}

	

	getBankAccountsFromService(): void {
		this.modalPartnerPaymentService
			.getBankAccountsForPaymentType(/* this.methodSelected.idPaymentType */this.methodSelected )
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
		  console.log('Data en getInputData:', this.config.data);

		return this.config.data/* this.config.data; */
	}
	
	
	

 	get methodSelected() {
		console.log("datametodoselect",this.getInputData.methodSelected)
		/* ----remplazar por el id del metodo de pago */
		return this.getInputData.methodSelected;
		/* return this.getInputData.voucherToEdit
			? this.getInputData.voucherToEdit.methodSelected
			: this.getInputData.methodSelected; */
	} 

	closeModal() {
		this.ref.close();
	}

	addVouchers(data) {
		this.ref.close({ ...data, indexEdit: this.getInputData.indexEdit });
	}
}
