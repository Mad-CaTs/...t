import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TableWalletHistoryComponent } from '../table-wallet-history/table-wallet-history.component';
import { ModalDetailWalletTransactionComponent } from '../../modals/modal-detail-wallet-transaction/modal-detail-wallet-transaction.component';
import { WalletService } from '../../services/wallet.service';
import { IWalletList } from '../../interfaces/wallet.interface';
import { IWalletTransactionTable } from '../../../../payments-and-comissions/pages/payment-detail/commons/interfaces/payments-and-comissions.interfaces';
import { CommonModule, DatePipe } from '@angular/common';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
	selector: 'app-wallet-transactions',
	templateUrl: './wallet-transactions.component.html',
	standalone: true,
	imports: [CommonModule, TableWalletHistoryComponent, ProgressSpinnerModule],
	providers: [DatePipe]
})
export class WalletTransactionsComponent implements OnChanges {
	@Input() IdWallet: number;
	@Input() navegation: number;
	@Input() search: any;
	@Input() walletBlock: boolean = false;
	public tableData: IWalletTransactionTable[] = [];
	public listWallet: IWalletList[];
	public loading: boolean = true;
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
		if ((changes['IdWallet'] && this.IdWallet) || this.navegation) {
			this.loading = true;

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

		if (!this.userInfo) {
			console.error('ID no definido');
			return;
		}
		this.walletService.getWalletById(this.userInfo.id).subscribe({
			next: (response) => {
				this.getAllWallet(response.idWallet, offset, rows);
				/* this.walletService.getAllListWalletById(response.idWallet, offset, rows).subscribe(
						(response: any) => {
							console.log('response', response);

							this.listWallet = response.data;
							this.totalRecords = response.total;
							this.tableData = this.mapToTableData(this.listWallet);
							this.loading = false;
						},
						(error) => {
							console.error("Error al cargar los datos", error);
							this.loading = false;
						}
					); */
			},
			error: (error) => {
				console.error('Error del servidor:', error);

				/* 					alert("Reiniciar la pagina web, porque el servidor esta saturado.");
				 */
			}
		});
	}
	getAllWallet(idWallet, offset, rows) {
		console.log(this.navegation);

		let serviceAllWallet: any;
		if (this.navegation == 1) {
			serviceAllWallet = this.walletService.getAllListWalletById(idWallet, offset, rows, this.search);
		} else if (this.navegation == 2) {
			serviceAllWallet = this.walletService.getAllListWalletRecharge(
				idWallet,
				offset,
				rows,
				this.search
			);
		} else {
			serviceAllWallet = this.walletService.getAllListWalletTransaction(
				idWallet,
				offset,
				rows,
				this.search
			);
		}

		serviceAllWallet.subscribe(
			(response: any) => {
				this.loading = false;
				console.log('response', response);

				this.listWallet = response.data;
				this.totalRecords = response.total;
				this.tableData = this.mapToTableData(this.listWallet);
			},
			(error) => {
				console.error('Error al cargar los datos', error);
				this.loading = false;
			}
		);
	}
	private mapToTableData(walletList: IWalletList[]): IWalletTransactionTable[] {
		return walletList.map((wallet) => {
			const [yearFin, monthFin, dayFin, hourFin = 0, minuteFin = 0, secondFin = 0] =
				wallet.availabilityDate.map(Number);
			const formattedDateFin = `${String(dayFin).padStart(2, '0')}/${String(monthFin).padStart(
				2,
				'0'
			)}/${yearFin} ${String(hourFin).padStart(2, '0')}:${String(minuteFin).padStart(2, '0')}`;
			const [yearInicial, monthInicial, dayInicial, hourInicial = 0, minuteInicial = 0] =
				wallet.initialDate.map(Number);
			const mesesAbreviados = [
				'Ene',
				'Feb',
				'Mar',
				'Abr',
				'May',
				'Jun',
				'Jul',
				'Ago',
				'Sep',
				'Oct',
				'Nov',
				'Dic'
			];
			const nombreMes = mesesAbreviados[monthInicial - 1];
			const formattedDateInicial = `${dayInicial} de ${nombreMes}`;

			return {
				id: wallet.idWalletTransaction,
				dateInitial: formattedDateInicial,
				dateFinal: formattedDateFin,
				returnedType: wallet.description,
				description: wallet.referenceData,
				amount: wallet.amount,
				solicitud: wallet.isSucessfulTransaction
			};
		});
	}

	onPageChange(event: any): void {
		const page = event.page + 1;
		const rows = event.rows;
		const filter = event.filter;
		this.getAllWalletById(page, rows);
	}
}
