import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TableWalletHistoryTransactionComponent } from './commons/components/table-wallet-history-transaction/table-wallet-history-transaction.component';
import { ModalWalletDetailHistoryTransactionComponent } from './commons/modals/modal-wallet-detail-history-transaction/modal-wallet-detail-history-transaction.component';
import { WalletService } from '../../services/wallet.service';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';
import {
	IWalletHistoryTable,
	IWalletHistoryTransactionTable
} from '../../../../payment-detail/commons/interfaces/payments-and-comissions.interfaces';
import { DatePipe } from '@angular/common';

@Component({
	selector: 'app-wallet-history-transfer',
	templateUrl: './wallet-history-transfer.component.html',
	standalone: true,
	imports: [TableWalletHistoryTransactionComponent],
	providers: [DatePipe],
	styleUrls: []
})
export class WalletHistoryTransferComponent implements OnInit {
	@Input() walletBlock: boolean = false;
	public userId: number = this.userInfoService.userInfo.id;
	public tableData: IWalletHistoryTransactionTable[] = [];
	public listHistory: IWalletHistoryTable[];
	public loading: boolean = false;

	@ViewChild(TableWalletHistoryTransactionComponent) tableComponent!: TableWalletHistoryTransactionComponent;

	constructor(
		private modal: NgbModal,
		private datePipe: DatePipe,
		public userInfoService: UserInfoService,
		private walletService: WalletService
		) {}

	ngOnInit(): void {
		this.getHistoryElectronicWallet(this.userId);
	}

	// ngOnChanges(changes: SimpleChanges): void {
	// 	if (changes['userId'] && this.userId) {
	// 		console.log('this.userId en ngOnChanges', this.userId);
	// 		this.getHistoryElectronicWallet(this.userId);
	// 	}
	// }
	public onOpenDetail(data: { selectedData: IWalletHistoryTransactionTable | undefined } ) {
		const ref = this.modal.open(ModalWalletDetailHistoryTransactionComponent, {
			centered: true
		});
		const modal = ref.componentInstance;

		modal.selectedData = data.selectedData;
	}

	private getHistoryElectronicWallet(id: number): void {
		this.loading = true;
		this.walletService.getHistoryElectronicWallet(id).subscribe(
			(response: any) => {
				this.listHistory = response;
				this.tableData = this.mapToTableDataHistory(this.listHistory);
				this.loading = false;
			},
			(error) => {
				console.error('Error fetching wallet data:', error);
				this.loading = false;
			}
		);
	}

	private mapToTableDataHistory(historyList: IWalletHistoryTable[]): IWalletHistoryTransactionTable[] {
		return historyList.map((item) => {
			const [year, month, day, hour, minute, second, millisecond] = item.closingDate.map(Number);
			const serverDate = new Date(year, month - 1, day, hour, minute, second, millisecond / 1000000);
			const localDate = new Date(serverDate.getTime() - serverDate.getTimezoneOffset() * 60000);
			const formattedDate = this.datePipe.transform(localDate, 'dd/MM/yyyy HH:mm');

			return {
				id: item.id,
				date: formattedDate,
				fullname: item.nameUser + ' ' + item.lastNameUser,
				account: item.usernameAccount,
				description: item.referenceData,
				amount: item.amount,
				request: item.nameRequest
			};
		});
	}

	public handleRequestTransferCompletedE() {
		this.getHistoryElectronicWallet(this.userId);
	}
}
