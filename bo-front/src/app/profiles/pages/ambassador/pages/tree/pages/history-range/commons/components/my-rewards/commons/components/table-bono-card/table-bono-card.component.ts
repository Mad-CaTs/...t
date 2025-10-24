import {
	ChangeDetectorRef,
	Component,
	EventEmitter,
	Input,
	OnInit,
	Output,
	SimpleChanges,
	ViewChild
} from '@angular/core';

import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { TableComponent } from '@shared/components/table/table.component';
import { CommonModule } from '@angular/common';
import { PaginationNgPrimeComponent } from '@shared/components/pagination-ng-prime/pagination-ng-prime.component';
import { MatIconModule } from '@angular/material/icon';
import { ButtonModule } from 'primeng/button';
import { SelectComponent } from '@shared/components/form-control/select/select.component';
import { ProductService } from 'src/app/profiles/pages/partner/pages/my-products/commons/services/product-service.service';
import { DialogService, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';

import { DialogModule } from 'primeng/dialog';
import { TablePaginationService } from '@shared/services/table-pagination.service';
import { IAccountTreeActivationManagerTable } from 'src/app/profiles/pages/ambassador/pages/tree/commons/interfaces';
import { BonoCarListResponseDTO } from '../../interfaces/partnerList';
import { ModalBonusDetailComponent } from '../../modals/modal-bonus-list-detail/modal-bonus-list-detail';

@Component({
	selector: 'app-table-bono-card',
	templateUrl: './table-bono-card.component.html',
	standalone: true,
	providers: [DialogService],
	imports: [
		CommonModule,
		PaginationNgPrimeComponent,
		TableComponent,
		ButtonModule,
		SelectComponent,
		MatIconModule,
		DialogModule,
		DynamicDialogModule
	],
	styleUrls: ['./table-bono-card.component.css']
})
export class TableBonoCardComponent implements OnInit {
	@Input() dataBody: BonoCarListResponseDTO[] = [];
	@Output() detailModal = new EventEmitter<number>();
	@Output() pageChange: EventEmitter<any> = new EventEmitter();
	@Output() refresh: EventEmitter<any> = new EventEmitter();
	@Input() totalRecords: number = 0;
	@Input() isLoading: boolean = true;
	@ViewChild(PaginationNgPrimeComponent) paginator: PaginationNgPrimeComponent | undefined;
	isLoadingBooton: boolean = true;

	public id: string = '';
	align: string = 'right';
	public rows: number = 10;
	public first: number = 0;
	public selected: FormControl = new FormControl(1);
	public form: FormGroup;
	@Input() isDirectRecomendation: boolean = false;
	@Input() isProductComission: boolean = false;
	public subscriptionList: any[] = [];
	dialogRef: DynamicDialogRef;
	disabled: boolean = true;
	selectedMembership: { [idUser: number]: number | null } = {};
	constructor(
		public tableService: TablePaginationService,
		private fb: FormBuilder,
		private productService: ProductService,
		private dialogService: DialogService,
		private cdr: ChangeDetectorRef
	) {
		this.form = this.fb.group({
			nextQuota: [null],
			idSubscription: [null]
		});

		this.id = tableService.addTable(this.dataBody, this.rows);
	}

	ngOnInit(): void {
		this.isLoading = false;
		this.dataBody = [];
		const paidColor = '#28a745';
		const pendingColor = '#6c757d';

		for (let i = 1; i <= 20; i++) {
			const isPaid = i % 2 === 0;

			this.dataBody.push({
				color: isPaid ? paidColor : pendingColor,
				stateName: isPaid ? 'Pagado' : 'Por pagar',
				sponsorLevel: 1,
				sponsorName: 'Carlos Gómez',
				installmentNumber: `Cuota N° ${i}`,
				paymentDate: '23-04-2025',
				financedPaymentUSD: 478.57,
				interestUSD: 86.25,
				amortizationUSD: 392.32,
				splitInitialPaymentUSD: 366.67,
				rankBonusUSD: -250.0,
				finalPaymentUSD: 595.24,
				remainingBalanceUSD: 9957.68
			});
		}

		this.tableService.updateTable(this.dataBody, this.id, this.rows);
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (!changes['dataBody']) return;

		this.tableService.updateTable(this.dataBody, this.id, this.rows);
	}

	ngOnDestroy(): void {
		this.tableService.deleteTable(this.id);
	}

	onClickDetail() {
		const id = this.selected.value;
		this.detailModal.emit(id);
	}

	get table() {
		return this.tableService.getTable<IAccountTreeActivationManagerTable>(this.id);
	}

	onPageChange(event: any): void {
		this.first = event.first;
		this.rows = event.rows;
		this.isLoading = true;
		this.pageChange.emit({ page: event.page, rows: this.rows });
	}

	onRefresh(event: any): void {
		this.rows = event.rows;
		this.isLoading = true;
		this.refresh.emit({ rows: this.rows });
	}

	private hexToRgba(hex: string, opacity: number, factor: number): string {
		const bigint = parseInt(hex.replace('#', ''), 16);
		let r = (bigint >> 16) & 255;
		let g = (bigint >> 8) & 255;
		let b = bigint & 255;

		r = Math.floor(r * factor);
		g = Math.floor(g * factor);
		b = Math.floor(b * factor);

		return `rgba(${r}, ${g}, ${b}, ${opacity})`;
	}

	getTransparentColor(color: string): string {
		return this.hexToRgba(color, 0.4, 1);
	}

	getSolidColor(color: string): string {
		return this.hexToRgba(color, 1, 0.8);
	}

	resetPagination(): void {
		if (this.paginator) {
			this.paginator.resetPaginator();
		}
	}

	get headers() {
		const result = [
			'N° Cuota',
			'Fecha de Pago',
			'Pago Financiado (USD)',
			'Interés (USD)',
			'Amortización (USD)',
			'Inicial Fraccionada (USD)',
			'Bono Rango(USD)',
			'Pago Final (USD)',
			'Saldo',
			'Estado',
			'Acción'
		];
		return result;
	}

	get minWidthHeaders() {
		const result = [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100];
		return result;
	}

	onClickOpenDetailModal(element: any): void {
		const ref = this.dialogService.open(ModalBonusDetailComponent, {
			width: '50vw',
			styleClass: 'custom-modal-header position-relative',
			closable: false
		});

		ref.onClose.subscribe(() => {});
	}
}
