import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TableWalletHistoryComponent } from '../table-wallet-history/table-wallet-history.component';
import { ModalDetailWalletTransactionComponent } from '../../modals/modal-detail-wallet-transaction/modal-detail-wallet-transaction.component';
import { WalletService } from '../../services/wallet.service';
import { IWalletList } from '../../interfaces/wallet.interface';
import { IWalletTransactionTable } from '../../../../payment-detail/commons/interfaces/payments-and-comissions.interfaces';
import { DatePipe } from '@angular/common';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';

@Component({
	selector: 'app-wallet-transactions',
	templateUrl: './wallet-transactions.component.html',
	standalone: true,
	imports: [TableWalletHistoryComponent],
	providers: [DatePipe]
})
export class WalletTransactionsComponent implements OnChanges {
	@Input() IdWallet: number;
	@Input() walletBlock: boolean = false;
	public tableData: IWalletTransactionTable[] = [];
	public listWallet: IWalletList[];
	public loading: boolean = false;
	public selectedTransaction: IWalletTransactionTable | null = null;
	totalRecords: number = 0;
	userInfo: any;
	constructor(
		private modal: NgbModal,
		private datePipe: DatePipe,
		public userInfoService: UserInfoService,
		private walletService: WalletService
	) {
		this.userInfo = this.userInfoService.userInfo;
	}

	ngOnInit(): void {}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['IdWallet'] && this.IdWallet) {
			this.getAllWalletById(1, 10);
			/* this.getAllWalletById(this.IdWallet,1,10); */
		}
	}

	showDetail(transactionId: number) {
		this.selectedTransaction =
			this.tableData.find((transaction) => transaction.id === transactionId) || null;
		const modalRef = this.modal.open(ModalDetailWalletTransactionComponent, {
			centered: true
		});
		if (this.selectedTransaction) {
			modalRef.componentInstance.transactionData = this.selectedTransaction;
		}
	}

	/* 	private getAllWalletById(id: number): void {
			this.loading = true;
			this.walletService.getAllListWalletById(id).subscribe(
				(response: any) => {
					this.listWallet = response;
					this.tableData = this.mapToTableData(this.listWallet);
					this.loading = false;
				},
				(error) => {
					console.error('Error fetching wallet data:', error);
					this.loading = false;
				}
			);
		} */

	/*   private getAllWalletById(id: number,page: number, rows: number): void {
		const offset = (page - 1);
  
		this.loading = true;
		this.walletService.getAllListWalletById(id, offset, rows).subscribe(
		  (response: any) => {
			this.listWallet = response;
  console.log("totalRecords",this.totalRecords);
  
			this.tableData = this.mapToTableData(this.listWallet);
			this.totalRecords = response,
  
			this.loading = false;
		  },
		  (error) => {
			console.error('Error fetching wallet data:', error);
			this.loading = false;
		  }
		);
	  } */

	private getAllWalletById(page: number, rows: number): void {
		const offset = page - 1;
		this.loading = true;

		if (!this.userInfo) {
			console.error('ID no definido');
			return;
		}
		this.walletService.getWalletById(this.userInfo.id).subscribe({
			next: (response) => {
				console.log('response', response);

				this.walletService.getAllListWalletById(response.idWallet, offset, rows).subscribe(
					(response: any) => {
						this.listWallet = response.data;
						this.totalRecords = response.total;
						this.tableData = this.mapToTableData(this.listWallet);
						this.loading = false;
					},
					(error) => {
						console.error('Error al cargar los datos', error);
						this.loading = false;
					}
				);
			},
			error: (error) => {
				console.error('Error del servidor:', error);

				/* 					alert("Reiniciar la pagina web, porque el servidor esta saturado.");
				 */
			}
		});
	}

	private mapToTableData(walletList: IWalletList[]): IWalletTransactionTable[] {
		return walletList.map((wallet) => {
			const [year, month, day, hour = 0, minute = 0, second = 0] = wallet.availabilityDate.map(Number);
			const formattedDate = `${String(day).padStart(2, '0')}/${String(month).padStart(
				2,
				'0'
			)}/${year} ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
			return {
				id: wallet.idWalletTransaction,
				dateInitial: formattedDate,
				returnedType: wallet.description,
				description: wallet.referenceData,
				amount: wallet.amount
			};
		});
	}

	onPageChange(event: any): void {
		const page = event.page + 1;
		const rows = event.rows;
		this.getAllWalletById(page, rows);
	}
}
