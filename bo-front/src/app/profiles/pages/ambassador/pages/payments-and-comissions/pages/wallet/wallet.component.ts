import { Component, Output } from '@angular/core';
import { paymentsAndComissionsNavigation } from '../../commons/mocks/mock';
import { walletNavigation } from './commons/mocks/mock';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ModalWalletReportProblemComponent } from './commons/modals/modal-wallet-report-problem/modal-wallet-report-problem.component';
import { WalletTransactionsComponent } from './commons/components/wallet-transactions/wallet-transactions.component';
import { WalletTransferComponent } from './commons/components/wallet-transfer/wallet-transfer.component';
import { WalletHistoryTransferComponent } from './commons/components/wallet-history-transfer/wallet-history-transfer.component';
import { WalletService } from './commons/services/wallet.service';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';
import { IWallet, IWalletList } from './commons/interfaces/wallet.interface';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { NavigationComponent } from '@shared/components/navigation/navigation.component';
import { WalletHistoryTransferBankComponent } from './commons/components/wallet-history-transfer-bank/wallet-history-transfer-bank.component';
import { ConciliationService } from '../conciliation/commons/services/conciliation.service';
import { ModalSuccessComponent } from 'src/app/profiles/commons/modals/modal-success/modal-success.component';
import { DialogService } from 'primeng/dynamicdialog';
import { IWalletTransactionTable } from '../payment-detail/commons/interfaces/payments-and-comissions.interfaces';

@Component({
	selector: 'app-wallet',
	templateUrl: './wallet.component.html',
	standalone: true,
	imports: [
		CommonModule,
		NavigationComponent,
		MatIconModule,
		WalletTransactionsComponent,
		WalletHistoryTransferComponent,
		WalletTransferComponent,
		ProgressSpinnerModule,
		WalletHistoryTransferBankComponent
	],
	styleUrls: []
})
export class WalletComponent {
	public navigation = paymentsAndComissionsNavigation;
	public currentTab = 2;
	public sponsorId: number = this.userInfoService.userInfo.id;
	public walletNavigation = walletNavigation;
	public currentWalletNavigation = 1;
	public dataWallet: IWallet;
	public isLoading: boolean = false;
	public walletBlock: boolean = false;
	public isDisabled: boolean = true;
	public disabledUser: boolean = this.userInfoService.disabled;
	public preloadedTransferData = {
		recipientUsername: '',
		transferAmount: null
	};
	public transactionHistory: IWalletTransactionTable[] = [];

	@Output() IdWallet: number;

	constructor(
		public router: Router,
		private modal: NgbModal,
		public userInfoService: UserInfoService,
		private walletService: WalletService,
		private dialogService: DialogService,
		private conciliationService: ConciliationService,
		private route: ActivatedRoute
	) {}

	ngOnInit(): void {
		this.checkTabFromQueryParams();
		this.getWalletById(this.sponsorId);
	}

	/*  private checkTabFromQueryParams(): void {
		this.route.queryParams.subscribe(params => {
		  const tabParam = +params['tab'];
		  if (tabParam) {
			this.currentWalletNavigation = tabParam;
		  }
		});
	  }  */
/* 	private checkTabFromQueryParams(): void {
		this.route.queryParams.subscribe(({ tab, user, amount }) => {
			this.currentWalletNavigation = +tab || 2;
			this.preloadedTransferData = { recipientUsername: user ?? '', transferAmount: +amount || null };
		});
	} */

	private checkTabFromQueryParams(): void {
		this.route.queryParams.subscribe(({ tab, user, amount }) => {
			console.log('Query Params:', { tab, user, amount });

			this.currentWalletNavigation = tab ? +tab : this.currentWalletNavigation;
			this.preloadedTransferData = { recipientUsername: user ?? '', transferAmount: +amount || null };

			console.log('Preloaded Transfer Data:', this.preloadedTransferData);
		});
	}

	onReportProblem() {
		this.modal.open(ModalWalletReportProblemComponent, { centered: true });
	}

	onNavigateWallet(id: number) {
		if (id === 1) this.router.navigate(['/profile/ambassador/payments']);
		if (id === 2) this.router.navigate(['/profile/ambassador/payments/wallet']);
		if (id === 3) this.router.navigate(['/profile/ambassador/payments/conciliation']);
		if (id === 4) this.router.navigate(['/profile/ambassador/payments/rent']);
		if (id === 5) this.router.navigate(['/profile/ambassador/payments/prize']);
	}

	private getWalletById(id: number): void {
		this.isLoading = true;
		this.walletService.getWalletById(id).subscribe(
			(response: any) => {
				this.conciliationService.getConciliationPendingByUserId(this.sponsorId).subscribe({
					next: (check) => {
						this.dataWallet = response;
						this.isLoading = false;
						this.IdWallet = this.dataWallet.idWallet;
						this.walletBlock = check.data;
						this.isDisabled = false;
						if (check.data) {
							this.dialogService.open(ModalSuccessComponent, {
								header: '',
								data: {
									text: 'Para habilitar wallet, falta subir conciliación.',
									title: '¡Alerta!',
									icon: 'assets/icons/Inclub.png'
								}
							});
						}
						// Recalculate balances after fetching data
						this.calculateBalances();
					}
				});
			},
			(error: any) => {
				this.isLoading = false;
				this.isDisabled = true;
			}
		);
	}

	onUpdateBalance() {
		this.getWalletById(this.sponsorId);
	}

	updateTransactionData(transactions: IWalletTransactionTable[]) {
		this.transactionHistory = transactions;
		this.calculateBalances();
	}

	calculateBalances(): { availableBalance: number; accountingBalance: number } {
		if (!this.dataWallet || !this.transactionHistory) {
			return { availableBalance: 0, accountingBalance: 0 };
		}

		// Initial balances from dataWallet
		let availableBalance = this.dataWallet.availableBalance || 0;
		let accountingBalance = this.dataWallet.accountingBalance || 0;

		// Sum all transaction amounts to adjust balances
		const totalTransactionAmount = this.transactionHistory.reduce((sum, transaction) => sum + (transaction.amount || 0), 0);

		// Apply the net effect of transactions to both balances
		availableBalance += totalTransactionAmount;
		accountingBalance += totalTransactionAmount;

		return { availableBalance, accountingBalance };
	}
}
