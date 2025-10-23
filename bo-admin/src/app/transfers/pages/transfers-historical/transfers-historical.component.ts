import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableService } from '@app/core/services/table.service';
import { TransferService } from '@app/transfers/services/transfer.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ITableTransferHistorico, ITransferType } from '@interfaces/transfer.interface';
import { TableModel } from '@app/core/models/table.model';
import { TablesModule } from '@shared/components/tables/tables.module';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { TablePaginatorComponent } from '@shared/components/tables/table-paginator/table-paginator.component';
import { ISelectOpt } from '@interfaces/form-control.interface';
import { ModalLoadingComponentManageBusiness } from '@app/manage-business/components/modals/modal-loading/modal-loading.component';
import { ModalConfirmationTransferComponent } from '@app/transfers/components/modals/modal-confirmation/modal-confirmation.component';

@Component({
	selector: 'app-transfers-historical',
	standalone: true,
	imports: [
		CommonModule,
		TablesModule,
		InlineSVGModule,
		ReactiveFormsModule,
		FormsModule,
		FormControlModule,
		TablePaginatorComponent
	],
	templateUrl: './transfers-historical.component.html',
	styleUrls: ['./transfers-historical.component.scss']
})
export class TransfersHistoricalComponent {
	readonly table: TableModel<ITableTransferHistorico>;
	fullData: ITableTransferHistorico[];
	filteredData: ITableTransferHistorico[] = [];
	dataLoaded: boolean = false;
	transferTypes: ITransferType[] = [];
	private loadingModalRef: NgbModalRef | null = null;
	selectedRowId: number | null = null;
	selectedRow: ITableTransferHistorico;
	showFiles = false;
	pageSize = 8;
	pageIndex = 1;
	filterForm: FormGroup;
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
		this.table = this.tableService.generateTable<ITableTransferHistorico>({
			headers: [
				'N°',
				'Fec. de registro',
				'Socio que solicitó',
				'Tipo de traspaso',
				'Fec. de traspaso',
				'Usuario',
				'Titular actual',
				'Membresía'
				/* 	'Rango residual',
				'N° de ciclos',
				'Bonos usados' */
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
		/* 		this.filterForm.get('as')?.valueChanges.subscribe(() => this.applyFilter());
		 */ this.loadTransferTypes();
		this.loadTransferHistory();
		this.loadTransferRequestsByType();
	}

	private loadTransferHistory(): void {
		this.showLoadingModal();

		this.transferService.getTransferHistory().subscribe({
			next: (response) => {
				this.fullData = response.data || [];
				this.table.data = this.fullData;
				this.filteredData = this.fullData;
				this.dataLoaded = true;
				this.cdr.detectChanges();
				this.hideLoadingModal();
			},
			error: (err) => {
				console.error('Error al obtener historial:', err);
				this.dataLoaded = false;
				this.hideLoadingModal();
			}
		});
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
			const fullName = normalize(`${item.user_from_nombre || ''} ${item.user_from_last_name || ''}`);
			const username = normalize(item.username_to || '');
			const typeMatches = !as || as === '0' || Number(as) === 5 || item.idTransferType === Number(as);
			const textMatches = !searchTerm || fullName.includes(searchTerm) || username.includes(searchTerm);
			return typeMatches && textMatches;
		});
		this.table.data = [...filtered];
		this.filteredData = [...filtered];
		this.cdr.detectChanges();
	}

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

	goToFiles(item: ITableTransferHistorico): void {
		this.selectedRow = {
			...item
		};
		this.showFiles = true;
	}

	getTransferTypeName(id: number): string {
		const type = this.transferTypes.find((t) => t.id === id);
		return type ? type.name : 'Desconocido';
	}

	public openConfirmationModal(transfer: ITableTransferHistorico): void {
		const modalRef = this.modalService.open(ModalConfirmationTransferComponent, {
			centered: true,
			size: 'md'
		});
		const transferWithTypeName = {
			...transfer
		};
		modalRef.componentInstance.data = transferWithTypeName;
		modalRef.componentInstance.title = '¿Desea aceptar la solicitud?';
		modalRef.componentInstance.icon = 'bi bi-eye';
		modalRef.componentInstance.transfer = transfer;
		modalRef.componentInstance.transferConfirmed.subscribe((confirmedTransfer: any) => {
			this.loadTransferHistory();
			this.cdr.detectChanges();
		});
	}

	onPageChange(newPage: number): void {
		this.pageIndex = newPage;
	}

	onPageSizeChange(newSize: number): void {
		this.pageSize = newSize;
		this.pageIndex = 1;
	}
}
