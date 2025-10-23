import { ChangeDetectorRef, Component } from '@angular/core';

import { tableDataMock } from './mock';

import { TableModel } from '@app/core/models/table.model';

import { TableService } from '@app/core/services/table.service';

/* === Modules === */
import { CommonModule } from '@angular/common';
import { TablesModule } from '@shared/components/tables/tables.module';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ITableLiquidationRequest } from '@interfaces/liquidation.interface';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfirmationLiquidationComponent } from '@app/liquidations/components/modals/modal-confirmation-liquidation/modal-confirmation-liquidation.component';
import { ModalRejectLiquidationComponent } from '@app/liquidations/components/modals/modal-reject-liquidation/modal-reject-liquidation.component';
import { LiquidationService } from '@app/liquidations/services/liquidation.service';
import { ModalLoadingComponentManageBusiness } from '@app/manage-business/components/modals/modal-loading/modal-loading.component';

@Component({
	selector: 'app-liquidations-requests',
	standalone: true,
	imports: [CommonModule, TablesModule, InlineSVGModule, FormsModule],
	templateUrl: './liquidations-requests.component.html',
	styleUrls: ['./liquidations-requests.component.scss']
})
export class LiquidationsRequestsComponent {
	readonly table: TableModel<ITableLiquidationRequest>;
	dataLoaded: boolean = false;
	searchTerm: string = '';
	filteredData: ITableLiquidationRequest[] = [];
	fullData: ITableLiquidationRequest[] = tableDataMock;
	selectedRowId: number | null = null;
	private loadingModalRef: NgbModalRef | null = null; 

	constructor(
		private cdr: ChangeDetectorRef,
		private tableService: TableService,
		private router: Router,
		private modalService: NgbModal,
		private __liquidationService: LiquidationService
	) {
		this.table = this.tableService.generateTable<ITableLiquidationRequest>({
			headers: [
				'N°',
				'Fecha de solicitud',
				'Usuario',
				'Nickname',
				'Nombres y Apellidos',
				'Portafolio',
				'Membresía',
				'Motivo',
				'Detalle',
				'Verificación'
			],
			headersMinWidth: [5, 100, 100, 100, 150, 120, 140, 150, 100, 120],
			noCheckBoxes: true
		});

		//this.table.data = tableDataMock;
	}

	ngOnInit(): void {
		this.loadTransferRequests(); 
	}

	private loadTransferRequests(): void {
		this.showLoadingModal();
		this.__liquidationService.getLiquidationList('3').subscribe(
			(data) => {
				this.fullData = data;
				this.table.data = this.fullData; // Asignar a la tabla
				this.filteredData = this.fullData; // Inicialmente, los datos filtrados son todos los datos
				this.dataLoaded = true; // Cambiar estado de carga
				this.cdr.detectChanges();
				this.hideLoadingModal();
			},
			(error) => {
				console.error('Error al cargar las transferencias', error);
				this.dataLoaded = false; // Manejo del error
				this.hideLoadingModal();
			}
		);
	}

	public refreshData(): void {}

	/* === Events === */
	public onView(idUser: number, data: any) {
		var strData = JSON.stringify(data);
		this.router.navigate(['/dashboard/liquidations/details'], {
			queryParams: { idUser, strData }
		});
	}

	public openConfirmationModal(
		fullname: string,
		dateRequest: string,
		briefcase: string,
		membershipType: string,
		reason: string
	): void {
		const modalRef = this.modalService.open(ModalConfirmationLiquidationComponent, {
			centered: true,
			size: 'md'
		});
		modalRef.componentInstance.title = '¿Desea confirmar la solicitud?';
		modalRef.componentInstance.fullname = fullname;
		modalRef.componentInstance.dateRequest = dateRequest;
		modalRef.componentInstance.briefcase = briefcase;
		modalRef.componentInstance.membershiptype = membershipType;
		modalRef.componentInstance.reason = reason;
	}

	public onReject(id: number): void {
		const modalRef = this.modalService.open(ModalRejectLiquidationComponent, {
			centered: true,
			size: 'md'
		});
		const modal = modalRef.componentInstance as ModalRejectLiquidationComponent;
		modal.id = id;
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

	private showLoadingModal(): void {
		this.loadingModalRef = this.modalService.open(ModalLoadingComponentManageBusiness, { centered: true, size: 'sm' });
	}

	private hideLoadingModal(): void {
		if (this.loadingModalRef) {
			this.loadingModalRef.close();
			this.loadingModalRef = null;
		}
	}

}
