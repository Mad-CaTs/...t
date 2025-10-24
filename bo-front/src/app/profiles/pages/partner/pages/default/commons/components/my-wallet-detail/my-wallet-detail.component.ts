import { CommonModule } from '@angular/common';
import { Component, Input, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { InputComponent } from '@shared/components/form-control/input/input.component';
import { WalletDetailPresenter } from './wallet-detail.presenter';
import { ConciliationService } from 'src/app/profiles/pages/ambassador/pages/payments-and-comissions/pages/conciliation/commons/services/conciliation.service';
import { DialogService } from 'primeng/dynamicdialog';
import { ModalSuccessComponent } from 'src/app/profiles/commons/modals/modal-success/modal-success.component';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';
import { IWallet } from 'src/app/profiles/pages/ambassador/pages/wallet/commons/interfaces/wallet.interface';
import { catchError, of, tap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthenticationService } from '@shared/services';
import { MessageService } from 'primeng/api';

@Component({
	selector: 'app-my-wallet-detail',
	standalone: true,
	providers: [MessageService],
	imports: [CommonModule, InputComponent],
	templateUrl: './my-wallet-detail.component.html',
	styleUrl: './my-wallet-detail.component.scss'
})
export class MyWalletDetailComponent {
	@Input() withoutBox: boolean = false;
	@Input() wallet: IWallet;
	showBalance: boolean = false;
	public currentWalletNavigation = 2;
	public form: FormGroup;
	private presenter: WalletDetailPresenter;
	userId: any;
	userInfo: any;
	public isTransferring: boolean = false;
	public userIdRecived: number;

	constructor(
		private router: Router,
		private fb: FormBuilder,
		private conciliationService: ConciliationService,
		private dialogService: DialogService,
		private userInfoService: UserInfoService,
		private authenticationService: AuthenticationService,
		private messageService: MessageService,

	) {
		this.presenter = new WalletDetailPresenter(this.fb);
		this.form = this.presenter.buildForm();
		this.userId = this.userInfoService.userInfo.id;
		this.userInfo = this.userInfoService.userInfo;
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['wallet']) {
			console.log('Wallet data actualizado en hijo:', this.wallet);
		}
	}

	toggleBalanceVisibility(): void {
		this.showBalance = !this.showBalance;
	}

	/* 	goToWallet() {
		const { user, amount } = this.form.value;

		this.router.navigate(['/profile/ambassador/payments/wallet'], {
			queryParams: { tab: 2, user: user, amount: amount }
		});
	} */
	getUsername(): void {
		const username = this.form.get('user').value;
		if (username) {
			this.authenticationService
				.getUserInfo(username)
				.pipe(
					tap((response: any) => {
						const userControl = this.form.get('user');
						if (response.result && response.data) {
							userControl.setErrors(null); // Limpiar los errores
							this.userIdRecived = response.data.id;
							console.log('el userIdRecived: ', this.userIdRecived);
						} else {
							userControl.setErrors({ userNotFound: true }); // Setear el error
						}

						// Marcar el control como "touched" y "dirty"
						userControl.markAsTouched();
						userControl.markAsDirty();
					}),
					catchError((error: HttpErrorResponse) => {
						const userControl = this.form.get('user');
						if (error.status === 404) {
							userControl.setErrors({ userNotFound: true }); // Error si no se encuentra el usuario
						} else {
							userControl.setErrors({ pattern: true }); // Error de patrón si el usuario tiene otro problema
						}

						// Marcar el control como "touched" y "dirty"
						userControl.markAsTouched();
						userControl.markAsDirty();

						return of(null);
					})
				)
				.subscribe();
		}
	}

	get isValidBtn() {
		const userField = this.form.get('user');
		const amountField = this.form.get('amount');

		return userField.valid && amountField.valid && amountField.value > 0;
	}
	goToWallet() {
		this.isTransferring = true

		this.conciliationService.getConciliationPendingByUserId(this.userId).subscribe({
			next: (check) => {

				if (check.data) {
					this.dialogService.open(ModalSuccessComponent, {
						header: '',
						data: {
							text: 'Para transferir, falta subir conciliación.',
							title: '¡Alerta!',
							icon: 'assets/icons/Inclub.png'
						}
					});
					this.isTransferring = false;
					return;
				}

				const { user, amount } = this.form.value;
				localStorage.setItem("walletUser", user)
				localStorage.setItem("walletAmount", amount)
				//this.router.navigate(['/profile/ambassador/wallet/transferir/entre-wallet']);
				this.router.navigate(['/profile/ambassador/wallet/transferir/entre-wallet'], {
					state: {
						user: user,
						amount: amount,
						userIdRecived:this.userIdRecived
					}
					//queryParams: { user, amount }
				});
			},
			error: () => {
				this.isTransferring = false;
				this.dialogService.open(ModalSuccessComponent, {
					header: '',
					data: {
						text: 'Error al verificar la conciliación. Intenta más tarde.',
						title: 'Error',
						icon: 'assets/icons/Inclub.png'
					}
				});
			}
		});
	}

}
