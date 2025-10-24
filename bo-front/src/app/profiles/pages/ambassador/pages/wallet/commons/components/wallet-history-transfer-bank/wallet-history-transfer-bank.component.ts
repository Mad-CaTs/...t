import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from "@angular/core";
import { TableWalletHistoryTransactionBankComponent } from "./commons/components/table-wallet-history-transaction-bank/table-wallet-history-transaction-bank.component";
import { DatePipe } from "@angular/common";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { UserInfoService } from "src/app/profiles/commons/services/user-info/user-info.service";
import { WalletService } from "../../services/wallet.service";
import { IWalletHistoryBankTable, IWalletHistoryTransactionTable } from "./../../../../payments-and-comissions/pages/payment-detail/commons/interfaces/payments-and-comissions.interfaces";
import { ModalWalletDetailHistoryBankTransactionComponent } from './commons/modals/modal-wallet-detail-history-transaction/modal-wallet-detail-history-bank-transaction.component';
import { ModalWalletDetailRequestBankTransferBankComponent } from "./commons/modals/modal-wallet-detail-request-transfer/modal-wallet-detail-request-bank-transfer.component";

@Component({
	selector: 'app-wallet-history-transfer-bank',
	templateUrl: './wallet-history-transfer-bank.component.html',
	standalone: true,
	imports: [TableWalletHistoryTransactionBankComponent],
	providers: [DatePipe],
	styleUrls: []
})
export class WalletHistoryTransferBankComponent implements OnInit {
	@Input() walletBlock: boolean = false;
	public userId: number = this.userInfoService.userInfo.id;
	public tableData: IWalletHistoryTransactionTable[] = [];
	public listHistory: IWalletHistoryBankTable[];
	public loading: boolean = false;

	@ViewChild(TableWalletHistoryTransactionBankComponent) tableComponent!: TableWalletHistoryTransactionBankComponent;

	constructor(
		private modal: NgbModal,
		private datePipe: DatePipe,
		public userInfoService: UserInfoService,
		private walletService: WalletService
	) { }

	ngOnInit(): void {
		this.getHistoryBank(this.userId);
	}

	public onOpenDetail(data: { selectedData: IWalletHistoryTransactionTable | undefined }) {
		const ref = this.modal.open(ModalWalletDetailHistoryBankTransactionComponent, {
			centered: true
		});
		const modal = ref.componentInstance;

		modal.selectedData = data.selectedData;
	}

	private getHistoryBank(id: number): void {
		this.loading = true;
		this.walletService.getHistoryBank(id).subscribe(
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

	private mapToTableDataHistory(historyList: IWalletHistoryBankTable[]): IWalletHistoryTransactionTable[] {
		return historyList.map((item) => {
			const [year, month, day, hour, minute, second, millisecond] = item.closingDate.map(Number);
			const serverDate = new Date(year, month - 1, day, hour, minute, second, millisecond / 1000000);
			const localDate = new Date(serverDate.getTime() - serverDate.getTimezoneOffset() * 60000);
			const formattedDate = this.datePipe.transform(localDate, 'dd/MM/yyyy HH:mm');

			return {
				id: item.id,
				date: formattedDate,
				fullname: item.nameUser + ' ' + item.lastNameUser,
				account: item.email,
				description: item.referenceData,
				amount: item.amount,
				request: item.nameRequest
			};
		});
	}

	public handleRequestTransferCompleted() {
		this.getHistoryBank(this.userId);
	}
}
