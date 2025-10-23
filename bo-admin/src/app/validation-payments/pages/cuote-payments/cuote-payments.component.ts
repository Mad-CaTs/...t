import { ChangeDetectorRef, Component } from '@angular/core';

import { tableDataMock } from '../initial-payments/mock';

import type { ITableInitialPayments } from '@interfaces/payment-validate.interface';

import { TableModel } from '@app/core/models/table.model';

import {
	ModalSuccessPaymentComponent,
	ModalVerificateComponent
} from '@app/validation-payments/components/modals';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TableService } from '@app/core/services/table.service';

/* === Modules === */
import { CommonModule } from '@angular/common';
import { TablesModule } from '@shared/components/tables/tables.module';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { SubscriptionService } from '@app/validation-payments/services/payment-data.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ModalLoadingComponentManageBusiness } from '@app/manage-business/components/modals/modal-loading/modal-loading.component';

@Component({
	selector: 'app-cuote-payments',
	templateUrl: './cuote-payments.component.html',
	standalone: true,
	imports: [CommonModule, TablesModule, InlineSVGModule, FormsModule],
	styleUrls: ['./cuote-payments.component.scss']
})
export class CuotePaymentsComponent {
	readonly table: TableModel<ITableInitialPayments>;
	dataLoaded: boolean = false;
	searchTerm: string = ''; 
  	filteredData: ITableInitialPayments[] = []; 
	fullData: ITableInitialPayments[] = [];
	private loadingModalRef: NgbModalRef | null = null; 

	constructor(private cdr: ChangeDetectorRef, 
				private tableService: TableService, 
				private modalService: NgbModal,
				private subscriptionService: SubscriptionService,
				private router: Router,
				public modal: NgbModal) {
		this.table = this.tableService.generateTable<ITableInitialPayments>({
			headers: [
				'N°',
				'Fecha de pago',
				'Usuario',
				'Nombres y Apellidos',
				'D.N.I',
				'Patrocinador',
				'Tipo de Membresía',
				'Código de Cupon',
				'Dias de periodo de gracia',
				'Verificación',
				'Pre - Estado'
			],
			noCheckBoxes: true,
		});
		this.loadData('10');
	}

	private loadData(subscriptionType: string): void {
		this.showLoadingModal();
		this.subscriptionService.getSubscriptionData<ITableInitialPayments>(subscriptionType).subscribe(
		  data => {
			this.table.data = data;
			this.fullData = data;
			this.dataLoaded = true;
			this.hideLoadingModal();
			this.cdr.detectChanges();
		  },
		  error => {
			this.hideLoadingModal();
			console.error('Error fetching subscription data:', error);
		  }
		);
	}

	public applyFilter(): void {

		this.table.data = this.fullData;
		const searchTermLower = this.searchTerm.toLowerCase();

		this.filteredData = this.table.data.filter(item =>
			item.fullname.toLowerCase().startsWith(searchTermLower)
		);

		this.table.data = this.filteredData;
		this.cdr.detectChanges();
	}

	public refreshData(): void {
		this.searchTerm = "";
		this.table.data = this.fullData;
		this.cdr.detectChanges();
	}
	

	/* === Events === */
	public onConfirm() {
		this.modalService.open(ModalSuccessPaymentComponent, { centered: true, size: 'md' });
	}

	public onVerficate(idSuscription: number, idUser: number) {
		const typePayments = 2;
		this.router.navigate(['/dashboard/payment-validate/validation-payments'], {
			queryParams: { idSuscription, idUser, typePayments }
		});
	}

	private showLoadingModal(): void {
		this.loadingModalRef = this.modal.open(ModalLoadingComponentManageBusiness, { centered: true, size: 'sm' });
	}

	private hideLoadingModal(): void {
		if (this.loadingModalRef) {
			this.loadingModalRef.close();
			this.loadingModalRef = null;
		}
	}
}
