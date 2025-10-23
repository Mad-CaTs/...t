import { ChangeDetectorRef, Component } from '@angular/core';

import { TableModel } from '@app/core/models/table.model';

import { TableService } from '@app/core/services/table.service';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

/* === Modules === */
import { CommonModule } from '@angular/common';
import { TablesModule } from '@shared/components/tables/tables.module';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ITableTransferRequest, ITransferType } from '@interfaces/transfer.interface';
import { ModalConfirmationTransferComponent } from '@app/transfers/components/modals/modal-confirmation/modal-confirmation.component';
import { ModalRejectTransferComponent } from '@app/transfers/components/modals/modal-reject/modal-reject-transfer.component';
import { TransferService } from '@app/transfers/services/transfer.service';
import { ModalLoadingComponentManageBusiness } from '@app/manage-business/components/modals/modal-loading/modal-loading.component';
import {
	FilterGenericComponent,
	FilterGenericConfig
} from '@shared/components/filters/filter-generic/filter-generic.component';
import { InputComponent } from '@shared/components/form-control/input/input.component';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { ISelectOpt } from '@interfaces/form-control.interface';
import { TablePaginatorComponent } from '@shared/components/tables/table-paginator/table-paginator.component';
import { Router } from '@angular/router';
import { ViewFilesComponent } from '../view-files/view-files.component';
import { ModalAcceptPaymentComponent } from '@shared/components/modal-accept-payment/modal-accept-payment.component';

@Component({
	selector: 'app-transfers-requests',
	standalone: true,
	imports: [
		CommonModule,
		TablesModule,
		InlineSVGModule,
		ReactiveFormsModule,
		FormsModule,
		FormControlModule,
		TablePaginatorComponent,
		ViewFilesComponent
	],
	templateUrl: './transfers-requests.component.html',
	styleUrls: ['./transfers-requests.component.scss']
})
export class TransfersRequestsComponent {
	readonly table: TableModel<ITableTransferRequest>;
	dataLoaded: boolean = false;
	searchTerm: string = '';
	filteredData: ITableTransferRequest[] = [];
	fullData: ITableTransferRequest[];
	selectedRowId: number | null = null;
	private loadingModalRef: NgbModalRef | null = null;
	filters: FilterGenericConfig[] = [];
	values: Record<string, any> = {};
	showFiles = false;
	selectedRow: ITableTransferRequest;

	filterForm: FormGroup;

	pageSize = 8;
	pageIndex = 1;
	transferTypes: ITransferType[] = [];
	asOpt: ISelectOpt[] = [];

	constructor(
		private cdr: ChangeDetectorRef,
		private tableService: TableService,
		private modalService: NgbModal,
		private transferService: TransferService,
		public modal: NgbModal,
		private formBuilder: FormBuilder,
		private router: Router
	) {
		this.table = this.tableService.generateTable<ITableTransferRequest>({
			headers: [
				'N°',
				'Nombres y Apellidos',
				'Fec. solicitud',
				'Solicitante traspaso',
				'Tipo de traspaso',
				'Doc. adjuntos',
				'Acciones'
			],
			noCheckBoxes: true
		});

		this.filterForm = formBuilder.group({
			search: [''],
			as: ['5']
		});
	}

	ngOnInit(): void {
		this.filterForm.get('search')?.valueChanges.subscribe(() => this.applyFilter());
		this.filterForm.get('as')?.valueChanges.subscribe((value) => {
			this.applyFilter(value);
		});
		this.loadTransferRequests();
		this.loadTransferTypes();
		this.loadTransferRequestsByType();
	}

	private loadTransferRequests(payload: any = {}): void {
		this.showLoadingModal();
		this.transferService.listTransfers(payload).subscribe(
			(data) => {
				const newData = Array.isArray(data.data) ? data.data : data.data ? [data.data] : [];
				this.fullData = newData;
				this.filteredData = [...this.fullData];
				this.table.data = [...this.fullData];
				this.dataLoaded = true;
				this.cdr.detectChanges();
				this.hideLoadingModal();
			},
			(error) => {
				console.error('Error al cargar las transferencias', error);
				this.dataLoaded = false;
				this.hideLoadingModal();
				this.cdr.detectChanges();
			}
		);
	}

	/* 	private loadTransferRequests(payload: any = {}): void {
		this.showLoadingModal();
		this.transferService.listTransfers(payload).subscribe(
			(data) => {
				const newData = Array.isArray(data.data) ? data.data : data.data ? [data.data] : [];
				this.fullData = newData;
				this.filteredData = [...this.fullData];
				this.table.data = [...this.fullData];
				this.dataLoaded = true;

				this.cdr.detectChanges();
				this.hideLoadingModal();
			},
			(error) => {
				console.error('Error al cargar las transferencias', error);
				this.dataLoaded = false;
				this.hideLoadingModal();
				this.cdr.detectChanges();
			}
		);
	} */

	private loadTransferTypes(): void {
		this.transferService.getTransferTypes().subscribe({
			next: (types: ITransferType[]) => {
				this.transferTypes = types;
			},
			error: (err) => {
				console.error('Error al cargar tipos de transferencias', err);
			}
		});
	}

	public applyFilter(asValue?: string): void {
		const { search } = this.filterForm.value;
		const as = asValue ?? this.filterForm.get('as')?.value;
		let filtered = [...this.fullData];
		const normalize = (str: string): string =>
			str
				.toLowerCase()
				.normalize('NFD')
				.replace(/[\u0300-\u036f]/g, '')
				.replace(/\s+/g, ' ')
				.trim();
		const searchTerm = normalize(search || '');
		filtered = filtered.filter((item) => {
			const fullName = normalize(`${item.user_to_nombre || ''} ${item.user_to_apellido || ''}`);
			const username = normalize(item.requester_username || '');
			const typeMatches = !as || as === '0' || Number(as) === 5 || item.idTransferType === Number(as);
			const textMatches = !searchTerm || fullName.includes(searchTerm) || username.includes(searchTerm);
			return typeMatches && textMatches;
		});
		this.table.data = [...filtered];
		this.filteredData = [...filtered];
		this.cdr.detectChanges();
	}

	public refreshData(): void {
		this.searchTerm = '';
		this.table.data = this.fullData;
		this.cdr.detectChanges();
	}

	/* === Events === */
	public openConfirmationModal(transfer: ITableTransferRequest): void {
		const modalRef = this.modalService.open(ModalConfirmationTransferComponent, {
			centered: true,
			size: 'md'
		});
		const transferWithTypeName = {
			...transfer,
			transferTypeName: this.getTransferTypeName(transfer.idTransferType)
		};
		modalRef.componentInstance.data = transferWithTypeName;
		modalRef.componentInstance.title = '¿Desea aceptar la solicitud?';
		modalRef.componentInstance.icon = 'bi bi-eye';
		modalRef.componentInstance.transfer = transfer;
		modalRef.componentInstance.transferConfirmed.subscribe((confirmedTransfer: any) => {
			this.loadTransferRequests();
			this.cdr.detectChanges();
		});
	}

	confirmRechazoModal(id: number, transfer: ITableTransferRequest): void {
		const modalRef = this.modalService.open(ModalAcceptPaymentComponent, {
			centered: true,
			backdrop: 'static',
			keyboard: false
		});
		const modal = modalRef.componentInstance;
		modal.title = '¿Desea rechazar la solicitud?';
		modal.description = 'La solicitud de retiro será rechazada.';

		modal.onConfirm.subscribe(() => {
			modalRef.close();
			this.onReject(id, transfer);
		});
	}

	public onReject(id: number, transfer: ITableTransferRequest): void {
		const modalRef = this.modalService.open(ModalRejectTransferComponent, { centered: true, size: 'md' });
		const modal = modalRef.componentInstance as ModalRejectTransferComponent;
		modalRef.componentInstance.transfer = transfer;
		modal.id = id;
		modalRef.componentInstance.transferRejected.subscribe((rejectionPayload: any) => {
			this.loadTransferRequests();
			this.cdr.detectChanges();
		});
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

	private loadTransferRequestsByType(): void {
		this.transferService.getTransferRequestByType(5).subscribe({
			next: (res) => {
				this.asOpt = res.map((item: any) => ({
					id: item.id.toString(),
					text: item.name
				}));
			},
			error: (err) => {
				console.error('Error al obtener transferencias:', err);
			}
		});
	}

	onPageChange(newPage: number): void {
		this.pageIndex = newPage;
	}

	onPageSizeChange(newSize: number): void {
		this.pageSize = newSize;
		this.pageIndex = 1;
	}

	goToFiles(item: ITableTransferRequest): void {
		this.selectedRow = {
			...item,
			transferTypeName: this.getTransferTypeName(item.idTransferType)
		};
		this.showFiles = true;
	}

	getTransferTypeName(id: number): string {
		const type = this.transferTypes.find((t) => t.id === id);
		return type ? type.name : 'Desconocido';
	}
}
