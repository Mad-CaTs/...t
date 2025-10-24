import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IWalletTransactionTable } from '../../../../payment-detail/commons/interfaces/payments-and-comissions.interfaces';
import { CommonModule, DatePipe } from '@angular/common';
import { TableComponent } from '@shared/components/table/table.component';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { PaginationNgPrimeComponent } from '@shared/components/pagination-ng-prime/pagination-ng-prime.component';
import { TablePaginationService } from '@shared/services/table-pagination.service';

@Component({
	selector: 'app-table-wallet-history',
	templateUrl: './table-wallet-history.component.html',
	standalone: true,
	imports: [CommonModule, PaginationNgPrimeComponent, TableComponent, ButtonModule, RippleModule],
	providers: [DatePipe],
	styleUrls: []
})
export class TableWalletHistoryComponent {
	@Input() dataBody: IWalletTransactionTable[] = [];
	@Input() walletBlock: boolean = false;
	@Input() loading: boolean = false;
	@Output() pageChange: EventEmitter<any> = new EventEmitter();
	@Output() refresh: EventEmitter<any> = new EventEmitter();
	@Output() btnClick = new EventEmitter<number>();
	@Output() transactionDataChange = new EventEmitter<IWalletTransactionTable[]>();
	public first: number = 0;
	public rows: number = 10;
	isLoading: boolean = true;
	align: string = 'right';
	@Input() totalRecords: number = 0;

	/*  rows: number = 10;
	 public totalRecords: number = 0;
	 currentPage: number = 1;
	 align: string = 'right'; */

	public id: string = '';
	public selected: FormControl = new FormControl(1);

	constructor(public tableService: TablePaginationService, private datePipe: DatePipe) {
		this.id = tableService.addTable(this.dataBody, this.rows);
	}

	ngOnInit(): void {
		this.selected.setValue(this.dataBody[0]?.id || 1);
		this.emitTransactionData();
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['dataBody']) {
			if (this.dataBody) {
				this.selected.setValue(this.dataBody[0]?.id || 1);
				this.tableService.updateTable(this.dataBody, this.id, this.rows);
				this.isLoading = false;
				this.emitTransactionData();
			} else {
				setTimeout(() => {
					this.isLoading = false;
				}, 1000);
			}
		}
	}

	ngOnDestroy(): void {
		this.tableService.deleteTable(this.id);
	}

	onPageChange(event: any): void {
		this.first = event.first;
		this.rows = event.rows;
		this.isLoading = true;
		this.pageChange.emit({ page: event.page, rows: this.rows });
	}

	onClickBtn(id: number) {
		this.btnClick.emit(id);
	}

	get table() {
		return this.tableService.getTable<IWalletTransactionTable>(this.id);
	}

	formatAmount(amount: number): string {
		const formattedAmount = Math.abs(amount).toFixed(2);
		return amount < 0 ? `- $ ${formattedAmount}` : `$ ${formattedAmount}`;
	}

	onRefresh(event: any): void {
		this.rows = event.rows;
		this.isLoading = true;
		this.refresh.emit({ rows: this.rows });
	}

	emitTransactionData() {
		this.transactionDataChange.emit(this.table.data);
	}
}
