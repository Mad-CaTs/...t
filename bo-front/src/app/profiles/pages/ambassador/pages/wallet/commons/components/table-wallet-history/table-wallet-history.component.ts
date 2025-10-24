import { Component, ElementRef, EventEmitter, Input, Output, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
//import { IWalletTransactionTable } from '../../../../payment-detail/commons/interfaces/payments-and-comissions.interfaces';
import { IWalletTransactionTable } from '../../../../payments-and-comissions/pages/payment-detail/commons/interfaces/payments-and-comissions.interfaces';
import { CommonModule, DatePipe } from '@angular/common';
import { TableComponent } from '@shared/components/table/table.component';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { PaginationNgPrimeComponent } from '@shared/components/pagination-ng-prime/pagination-ng-prime.component';
import { TablePaginationService } from '@shared/services/table-pagination.service';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';
//import { InputComponent } from "../../../../../../../../../../shared/components/form-control/input/input.component";
import { InputComponent } from '@shared/components/form-control/input/input.component';
import { debounceTime, distinctUntilChanged, share } from 'rxjs';

@Component({
	selector: 'app-table-wallet-history',
	templateUrl: './table-wallet-history.component.html',
	standalone: true,
	imports: [CommonModule, PaginationNgPrimeComponent, TableComponent, ButtonModule, RippleModule, InputComponent],
	providers: [DatePipe],
	styleUrls: ['./table-wallet-history.component.scss']
})
export class TableWalletHistoryComponent {
	@Input() dataBody: any[] = [];
	@Input() navigation: any;
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
	@ViewChildren('detalle') detalles!: QueryList<ElementRef>;
	/*  rows: number = 10;
	 public totalRecords: number = 0;
	 currentPage: number = 1;
	 align: string = 'right'; */
	viewDetalle: boolean = false;
	public id: string = '';
	public selected: FormControl = new FormControl(1);
	public disabledUser: boolean = this.userInfoService.disabled;

	constructor(
		public tableService: TablePaginationService,
		public userInfoService: UserInfoService,
		private datePipe: DatePipe) {
		this.id = tableService.addTable(this.dataBody, this.rows);
		
	}
	user: string
	ngOnInit(): void {
		this.user = JSON.parse(localStorage.getItem('user_info'))
		this.selected.setValue(this.dataBody[0]?.id || 1);
		this.emitTransactionData();
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['dataBody']) {
			if (this.dataBody) {
				console.log(this.dataBody);

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

	toggleDetalle(event: Event, index: number) {
		event.stopPropagation();
		const detalle = this.detalles.toArray()[index].nativeElement;
		detalle.classList.toggle('abierto');
	}
}
