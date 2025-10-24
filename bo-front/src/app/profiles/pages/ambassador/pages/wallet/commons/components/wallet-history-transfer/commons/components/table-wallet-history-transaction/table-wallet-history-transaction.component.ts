import {
	ChangeDetectorRef,
	Component,
	EventEmitter,
	Input,
	OnChanges,
	OnDestroy,
	OnInit,
	Output,
	SimpleChanges
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { IWalletHistoryTransactionTable } from '../../../../../../../payments-and-comissions/pages/payment-detail/commons/interfaces/payments-and-comissions.interfaces';
import { TableService } from 'src/app/profiles/pages/ambassador/commons/services/table/table.service';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { TableComponent } from '@shared/components/table/table.component';
import { ModalWalletDetailRequestTransferComponent } from '../../modals/modal-wallet-detail-request-transfer/modal-wallet-detail-request-transfer.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';


@Component({
	selector: 'app-table-wallet-history-transaction',
	templateUrl: './table-wallet-history-transaction.component.html',
	standalone: true,
	imports: [CommonModule, PaginationComponent, TableComponent],
	providers: [DatePipe],
	styleUrls: []
})
export class TableWalletHistoryTransactionComponent implements OnInit, OnChanges, OnDestroy {
	@Input() dataBody: IWalletHistoryTransactionTable[] = [];
	@Input() loading: boolean = false;
	@Input() walletBlock: boolean = false;
	public id: string = '';
	public selected: FormControl = new FormControl();
	public form: FormGroup;
	public disabledUser: boolean = this.userInfoService.disabled;

	@Output() btnClick = new EventEmitter<{
		selectedData: IWalletHistoryTransactionTable | undefined;
	}>();

	@Output() selectedData = new EventEmitter<IWalletHistoryTransactionTable>();

	@Output() requestTransferCompletedTransaction = new EventEmitter<void>();

	public idSelected: number;
	constructor(
		public userInfoService: UserInfoService,
		public tableService: TableService, 
		private cdr: ChangeDetectorRef, 
		private modal: NgbModal) {
		this.id = tableService.addTable(this.dataBody);
	}

	ngOnInit(): void {
		this.form = new FormGroup({
			selected: new FormControl()
		});
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (!changes['dataBody']) return;

		this.tableService.updateTable(this.dataBody, this.id);
	}

	ngOnDestroy(): void {
		this.tableService.deleteTable(this.id);
	}

	onClickBtn() {
		const id = this.selected.value;
		const selectedData = this.dataBody.find((item) => item.id === id);
		
		let component;

		if (selectedData) {
			this.btnClick.emit({
				selectedData: selectedData
			});
			this.updateBody();
		} 
	}

	private updateBody(idSelected?: number): void {
		this.selected.setValue(idSelected);

		this.idSelected = idSelected || this.idSelected;
	}

	public onRequestTransfer() {
		const modalRef = this.modal.open(ModalWalletDetailRequestTransferComponent, {
			centered: true
		});

		modalRef.componentInstance.resultEmitter.subscribe((result: string) => {
			if (result === 'success') {
				// this.refreshTable();
				this.requestTransferCompletedTransaction.emit();
			} else {
				console.log('Error al realizar la transferencia');
			}
		});
	}

	private refreshTable() {
		// this.getUpdatedData();
		this.cdr.detectChanges();
	}

	get table() {
		return this.tableService.getTable<IWalletHistoryTransactionTable>(this.id);
	}

	formatAmount(amount: number): string {
		const formattedAmount = Math.abs(amount).toFixed(2);
		return amount < 0 ? `- $ ${formattedAmount}` : `$ ${formattedAmount}`;
	}
}
