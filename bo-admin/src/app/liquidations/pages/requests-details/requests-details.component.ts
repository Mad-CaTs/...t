import {
	ChangeDetectorRef,
	Component,
	EventEmitter,
	Input,
	OnInit,
	Output,
} from '@angular/core';

import { TableModel } from '@app/core/models/table.model';

import { ModalRejectPaymentComponent } from '@app/validation-payments/components/modals';
import { TableService } from '@app/core/services/table.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

/* === Modules === */
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TablesModule } from '@shared/components/tables/tables.module';
import { ActivatedRoute, Router } from '@angular/router';
import { IMembership, ITableLiquidationRequest } from '@interfaces/liquidation.interface';
import { tableDataMock } from '../requests/mock';
import { PaymentScheduleService } from '@app/validation-payments/services/payment-schedule.service';
import { ModalLoadingComponentManageBusiness } from '@app/manage-business/components/modals/modal-loading/modal-loading.component';
import { ModalConfirmationLiquidationComponent, ModalRejectLiquidationComponent } from '../components/modals';

@Component({
	selector: 'app-requests-details',
	standalone: true,
	imports: [
		CommonModule,
		ModalComponent,
		FormsModule,
		FormControlModule,
		ReactiveFormsModule,
		TablesModule
	],
	templateUrl: './requests-details.component.html',
	styleUrls: ['./requests-details.component.scss'],
	providers: [CurrencyPipe]
})
export class RequestsDetailsComponent implements OnInit {
	@Input() idUser!: number;
	@Input() data!: any;
	@Output() paymentConfirmed = new EventEmitter<void>();

	public readonly table: TableModel<any>;
	membershipData: IMembership[] = [];
	selectedRowId: number | null = null;
	dataLoaded: boolean = false;
	private loadingModalRef: NgbModalRef | null = null; 

	constructor(
		private modalService: NgbModal,
		private builder: FormBuilder,
		private tableService: TableService,
		private route: ActivatedRoute,
		private cdr: ChangeDetectorRef,
		private router: Router,
		private __paymentScheduleService: PaymentScheduleService
	) {
		this.table = this.tableService.generateTable<IMembership>({
			headers: [
				'Descripción',
				'Fecha de vencimiento',
				'Capital',
				'Amortización',
				'Interés',
				'Mora',
				'Cuota',
				'Total',
				'Fecha de pago'
			],
			headersMinWidth: [150, 120, 100, 100, 100, 100, 100, 100, 120]
		});
	}

	ngOnInit(): void {
		this.route.queryParams.subscribe((params) => {
			this.data = JSON.parse(''+params['strData']);
			this.data.amountFavour = this.data.amountFavour.toFixed(2);
			this.data.amountPayment = this.data.amountPayment.toFixed(2);
			this.data.amountPenality = this.data.amountPenality.toFixed(2);
			this.idUser = params['idUser'];
			this.loadUserMembership();
		});
	}

	private loadUserMembership(): void {
		const userData = tableDataMock.find((user) => {
			return +user.id === +this.idUser;
		});
		this.__paymentScheduleService.getPaymentSchedule(this.data.membership[0].idSuscription).subscribe(
			(resp) => {
				console.log(resp.data);
				resp.data.forEach((e: any) => {
					e.sumTotalUsd = (e.totalOverdue + e.quotaUsd).toFixed(2);
					e.totalOverdue = e.totalOverdue.toFixed(2);
					e.quotaUsd = e.quotaUsd.toFixed(2);
					e.interest = '0';
					e.payDate = this.formatDate(e.payDate);
					e.nextExpiration = this.formatDate(e.nextExpiration);
				});
				this.table.data = resp.data; // Asignar a la tabla
				this.dataLoaded = true; // Cambiar estado de carga
				this.cdr.detectChanges();
				this.hideLoadingModal();
			},
			(error) => {
				console.error('Error al cargar el cronograma', error);
				this.dataLoaded = false; // Manejo del error
				this.hideLoadingModal();
			}
		);
	}

	/* === Watchers === */

	/* === Events === */
	public onConfirm(idPayment: number, numberQuotes: number) {}

	/*public onReject(idPayment: number, numberQuotes: number) {
		//this.instanceModal.close();
		const modalRef = this.modalService.open(ModalRejectPaymentComponent, { centered: true, size: 'md' });
		modalRef.componentInstance.paymentRejected.subscribe(() => {
			this.paymentConfirmed.emit();
			// this.navigateGoBack();
		});
	}*/

	/* === Helpers === */
	public navigateGoBack(): void {
		this.router.navigate(['/dashboard/liquidations/requests']);
	}

	private showLoadingModal(): void {
		this.loadingModalRef = this.modalService.open(ModalLoadingComponentManageBusiness, { centered: true, size: 'sm' });
	}

	private hideLoadingModal(): void {
		if (this.loadingModalRef) {
			this.loadingModalRef.close();
			this.loadingModalRef = null;
		}
	}

	/* === Events === */
	public openConfirmationModal(liquidation: any): void {
		const modalRef = this.modalService.open(ModalConfirmationLiquidationComponent, {
			centered: true,
			size: 'md'
		});
		console.log(liquidation);
		modalRef.componentInstance.liquidation = liquidation;
		modalRef.componentInstance.title = '¿Desea confirmar la solicitud?';
		modalRef.componentInstance.fullname = liquidation.fullname;
		modalRef.componentInstance.dateRequest = liquidation.dateRequest;
		modalRef.componentInstance.package = liquidation.membership[0].familyPackageName;
		modalRef.componentInstance.membership = liquidation.membership[0].packageName;
		modalRef.componentInstance.reason = liquidation.reason;

		modalRef.componentInstance.liquidationConfirmed.subscribe((confirmedTransfer: any) => {
			//this.loadTransferRequests();
			this.cdr.detectChanges();
		});
	}

	public onReject(liquidation: ITableLiquidationRequest): void {
		const modalRef = this.modalService.open(ModalRejectLiquidationComponent, { centered: true, size: 'md' });
		const modal = modalRef.componentInstance as ModalRejectLiquidationComponent;
		modalRef.componentInstance.liquidation = liquidation;

		modalRef.componentInstance.liquidationRejected.subscribe((rejectionPayload: any) => {
			//this.loadTransferRequests();
			this.cdr.detectChanges();
		});
	}

	private formatDate(dateArray: number[]): string {
        if (!Array.isArray(dateArray) || dateArray.length < 3) {
          return 'No hay fecha'; // Manejar si no hay una fecha válida
        }
      
        // Extraemos los primeros tres valores del arreglo: año, mes y día
        const [year, month, day] = dateArray;
      
        const padNumber = (value: number): string => value.toString().padStart(2, '0');
      
        // Formatear el día y el mes con ceros a la izquierda si es necesario
        const formattedDay = padNumber(day);
        const formattedMonth = padNumber(month); // Mes ya está en base 1 (1-12)
      
        // console.log(`${formattedDay}/${formattedMonth}/${year}`); // Para depuración
      
        return `${formattedDay}/${formattedMonth}/${year}`;
    }
}
