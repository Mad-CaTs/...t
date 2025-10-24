import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ModalPaymentService } from 'src/app/profiles/pages/ambassador/pages/new-partner/pages/new-partner-payment/commons/sevices/modal-payment.service';
import { ToastModule } from 'primeng/toast';
import { CompanyService } from '../../services/services-company/company.service';

@Component({
	selector: 'app-enterprise-bank-details',
	standalone: true,
	providers: [MessageService],
	imports: [CommonModule, MatIconModule, DialogModule, ToastModule],
	templateUrl: './enterprise-bank-details.component.html',
	styleUrl: './enterprise-bank-details.component.scss'
})
export class EnterpriseBankDetailsComponent implements OnInit {
	public exchangeType: number;
	bussinesAccounts: any[] = [];
	error: string | null = null;
	displayModal: boolean = false;
	copiedAccount: string | null = null;
	company: any;
	exchangeSale: any;
	exchangePurchase: any;
	formattedDate: string;
	public isLoading = true;
	constructor(
		public ref: DynamicDialogRef,
		public config: DynamicDialogConfig,
		private modalPaymentService: ModalPaymentService,
		private companyService: CompanyService
	) { }
	ngOnInit(): void {
		this.initData();
	}

	initData() {
		this.getTC();
		this.loadCompanyData()
	}

	closeModal() {
		this.ref.close();
	}

	private getTC() {
		this.modalPaymentService.getTipoCambio().subscribe((exchangeType) => {
			const { sale, buys, modificationDate } = exchangeType;
			const [year, month, day, hour, minute] = modificationDate;
			const formattedDate = new Date(year, month - 1, day, hour, minute);
			const options: Intl.DateTimeFormatOptions = {
				day: '2-digit',
				month: 'short',
				year: 'numeric',
				hour: '2-digit',
				minute: '2-digit'
			};
			this.exchangeSale = sale;
			this.exchangePurchase = buys;
			this.formattedDate = formattedDate.toLocaleString('es-ES', options).replace(',', '') + ' h';
			this.isLoading = false;
		});
	}

	loadCompanyData(): void {
		this.companyService.getCompanyData().subscribe((response) => {
			this.company = response.data.find(
				(company: any) => company.idCompany == 1
			);
			if (this.company) {
				this.bussinesAccounts = this.company.bankAccounts || [];
			} else {
				console.warn("No se encontró la empresa 'Valle Encantado'.");
			}
			this.isLoading = false;
		});
	}

	copyToClipboard(accountNumber: string): void {
		const input = document.createElement('input');
		input.value = accountNumber;
		document.body.appendChild(input);
		input.select();
		document.execCommand('copy');
		document.body.removeChild(input);

		this.copiedAccount = accountNumber;

		setTimeout(() => {
			this.copiedAccount = null;
		}, 2000);
	}


}
