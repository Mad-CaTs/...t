import { ChangeDetectorRef, Component } from '@angular/core';

import { tableDataMock } from './mock';

import type { ITableInitialPayments } from '@interfaces/payment-validate.interface';

import {
	ModalSuccessPaymentComponent,
	ModalVerificateComponent
} from '@app/validation-payments/components/modals';

import { TableModel } from '@app/core/models/table.model';

import { TableService } from '@app/core/services/table.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

/* === Modules === */
import { CommonModule } from '@angular/common';
import { TablesModule } from '@shared/components/tables/tables.module';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { SubscriptionService } from '@app/validation-payments/services/payment-data.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalLoadingComponentManageBusiness } from '@app/manage-business/components/modals/modal-loading/modal-loading.component';

@Component({
	selector: 'app-migration-payments',
	standalone: true,
	imports: [CommonModule, TablesModule, InlineSVGModule, FormsModule],
	templateUrl: './migration-payments.component.html',
	styleUrls: ['./migration-payments.component.scss']
})
export class MigrationPaymentsComponent {
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
				'Fecha',
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

		this.loadData('13'); //Status de la suscripción: 2 Suscripciones iniciales

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
				console.error('Error fetching subscription data:', error);
				this.hideLoadingModal();
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
	public onVerficate(idSuscription: number, idUser: number) {
		const typePayments = 3;
		this.router.navigate(['/dashboard/payment-validate/validation-payments'], {
			queryParams: { idSuscription, idUser, typePayments }
		});

		//modalRef.componentInstance.idSuscription = idSuscription;
		//modalRef.componentInstance.idUser = idUser;
		//modalRef.componentInstance.paymentConfirmed.subscribe(() => {
		//	this.loadData('2');
		//});
	}

	public onConfirm() {
		this.modalService.open(ModalSuccessPaymentComponent, { centered: true, size: 'md' });
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
