import { ChangeDetectorRef, Component } from '@angular/core';

import type { ITablePendingPayments } from '@interfaces/payment-validate.interface';

import { ModalSuccessPaymentComponent } from '@app/validation-payments/components/modals';

import { TableModel } from '@app/core/models/table.model';

import { TableService } from '@app/core/services/table.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

/* === Modules === */
import { CommonModule } from '@angular/common';
import { TablesModule } from '@shared/components/tables/tables.module';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { SubscriptionService } from '@app/validation-payments/services/payment-data.service';
import { ModalLoadingComponentManageBusiness } from '@app/manage-business/components/modals/modal-loading/modal-loading.component';
import { SharedModule } from '@shared/shared.module';

@Component({
	selector: 'app-pending-payments',
	standalone: true,
	imports: [
		CommonModule,
		TablesModule,
		InlineSVGModule,
		ReactiveFormsModule,
		FormControlModule,
		FormsModule,
		SharedModule
	],
	templateUrl: './pending-payments.component.html',
	styleUrls: ['./pending-payments.component.scss']
})
export class PendingPaymentsComponent {
	public table: TableModel<ITablePendingPayments>;
	dataLoaded: boolean = false;
	searchTerm: string = '';
	filteredData: ITablePendingPayments[] = [];
	fullData: ITablePendingPayments[] = [];
	private loadingModalRef: NgbModalRef | null = null;

	constructor(
		private cdr: ChangeDetectorRef,
		private tableService: TableService,
		private modalService: NgbModal,
		private subscriptionService: SubscriptionService,
		private builder: FormBuilder,
		public modal: NgbModal
	) {
		this.table = this.tableService.generateTable<ITablePendingPayments>({
			headers: [
				'N°',
				'Fecha de pago',
				'Usuario',
				'Nombres y Apellidos',
				'D.N.I',
				'Celular',
				'Nacionalidad',
				'Patrocinador',
				'Tipo de Membresía'
			],
			headersMinWidth: [70],
            headersMaxWidth:[70],
			noCheckBoxes: true,
		});
		this.loadData('4');
	}

	private loadData(subscriptionType: string): void {
		this.showLoadingModal();
		this.subscriptionService.getSubscriptionData<ITablePendingPayments>(subscriptionType, true, true).subscribe(
			(data) => {
				this.table.data = data;
				this.fullData = data;
				this.dataLoaded = true;
				this.hideLoadingModal();
				this.cdr.detectChanges();
			},
			(error) => {
				console.error('Error fetching subscription data:', error);
				this.hideLoadingModal();
			}
		);
	}

	public applyFilter(): void {
		this.table.data = this.fullData;
		const searchTermLower = this.searchTerm.toLowerCase();

		this.filteredData = this.table.data.filter((item) =>
			item.fullname.toLowerCase().startsWith(searchTermLower)
		);

		this.table.data = this.filteredData;
		this.cdr.detectChanges();
	}

	public refreshData(): void {
		this.searchTerm = '';
		this.table.data = this.fullData;
		this.cdr.detectChanges();
	}

	/* === Events === */
	public onConfirm() {
		this.modalService.open(ModalSuccessPaymentComponent, { centered: true, size: 'md' });
	}

	private showLoadingModal(): void {
		this.loadingModalRef = this.modal.open(ModalLoadingComponentManageBusiness, {
			centered: true,
			size: 'sm'
		});
	}

	private hideLoadingModal(): void {
		if (this.loadingModalRef) {
			this.loadingModalRef.close();
			this.loadingModalRef = null;
		}
	}
}
