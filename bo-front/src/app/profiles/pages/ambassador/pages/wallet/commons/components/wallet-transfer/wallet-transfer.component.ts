import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, LOCALE_ID, OnInit, SimpleChanges } from '@angular/core';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { InputComponent } from '@shared/components/form-control/input/input.component';
import { AuthenticationService } from '@shared/services';
import { catchError, of, tap } from 'rxjs';
import { WalletService } from '../../services/wallet.service';
import {
	IUserRequest,
	IWallet,
	IWalletGenerateToken,
	IWalletRegisterTransferWallet,
	IWalletValidatePassword,
	IWalletValidateUsernameAndAmount
} from '../../../commons/interfaces/wallet.interface';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalWalletRegisterTransferComponent } from './commons/modals/modal-wallet-register-transfer.component';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ModalSuccessComponent } from 'src/app/profiles/commons/modals/modal-success/modal-success.component';
import { ModalAlertComponent } from 'src/app/profiles/commons/modals/modal-alert/modal-alert.component';
import { ModalSuccessWalletComponent } from '../../modals/modal-success-wallet/modal-success-wallet.component';
import { ConciliationService } from '../../../../payments-and-comissions/pages/conciliation/commons/services/conciliation.service';

@Component({
	selector: 'app-wallet-transfer',
	templateUrl: './wallet-transfer.component.html',
	standalone: true,
	providers: [DialogService, DynamicDialogRef],
	imports: [CommonModule, ReactiveFormsModule, ModalSuccessComponent, InputComponent, MatIconModule],
	styleUrls: ['./wallet-transfer.component.scss']
})
export class WalletTransferComponent implements OnInit {
	@Input() walletBlock: boolean = false;
	public form: FormGroup;
	public showPassword: boolean = false;
	public step = 1;
	public userId: number = this.userInfoService.userInfo.id;
	public isLoading: boolean = false;
	verificacion = false;
	userEmail = this.userInfoService.userInfo.email;
	public sponsorId: number = this.userInfoService.userInfo.id;
	dataWallet!: IWallet;
	public body: IWalletValidateUsernameAndAmount;
	public bodyPassword: IWalletValidatePassword;
	public userIdRecived: number;
	public bodyGenerateToken: IWalletGenerateToken;
	public isPasswordValid: boolean = false;
	public bodyRegister: IWalletRegisterTransferWallet;
	public btnBack = 'Volver';
	public disabledUser: boolean = this.userInfoService.disabled;
	@Input() transferData: any;
	constructor(
		public router: Router,
		private modal: NgbModal,
		private formBuilder: FormBuilder,
		public userInfoService: UserInfoService,
		private authenticationService: AuthenticationService,
		private walletService: WalletService,
		private dialogService: DialogService,
		private route: ActivatedRoute,
		public ref: DynamicDialogRef,
		private conciliationService: ConciliationService
	) {
		// this.form = formBuilder.group({
		// 	user: ['', [Validators.required, Validators.minLength(3)]],
		// 	amount: [0, [Validators.required, Validators.min(0.01)]],
		// 	confirmCode: ['', [Validators.required, Validators.minLength(4)]],
		// 	password: ['', Validators.required]
		// });
	}

	ngOnInit(): void {

		this.getWalletById(this.sponsorId);

		this.form = this.formBuilder.group({
			user: ['', [Validators.required, Validators.minLength(3)]],
			amount: [0, [Validators.required, Validators.min(0.01)]],
			password: ['', Validators.required],
			confirmCode: ['', [Validators.required, Validators.minLength(4)]]
		});
		this.myWalletReceptor()


		if (this.walletBlock) {
			this.form.disable();
		}
		this.populateTransferData();
	}
	myWalletReceptor() {
		const state = history.state;


		// 2. Si no hay datos, verifica si es una recarga
		if (!state || Object.keys(state).length === 0) {
			console.warn('No se recibieron datos de estado');
			// Aquí puedes redirigir o cargar datos por defecto
			return;
		}

		// 3. Si hay datos, actualiza el formulario
		if (state) {
			this.form.patchValue({
				user: state.user || '',
				amount: state.amount || 0
			});
			this.userIdRecived = state.userIdRecived
		}
		// 4. Opcional: Limpia el estado después de usarlo
		history.replaceState({}, '');
		/* 		this.route.queryParams.subscribe((params) => {
					const user = params['user'];
					const amount = parseFloat(params['amount']);
					if (user) this.form.get('user')?.setValue(user);
					if (!isNaN(amount)) this.form.get('amount')?.setValue(amount);
				}); */
	}
	private getWalletById(id: number): void {
		this.walletService.getWalletById(id).subscribe((response: any) => {
			this.dataWallet = response;

			this.conciliationService.getConciliationPendingByUserId(this.sponsorId).subscribe({
				next: (check) => {
					this.walletBlock = check.data;
					if (this.walletBlock) {
						this.form.disable();
					}
					if (check.data) {
						this.modalConciliacion();
					}
				}
			});
		});
	}
	modalConciliacion() {
		this.dialogService.open(ModalSuccessComponent, {
			header: '',
			data: {
				text: 'Para habilitar wallet, falta subir conciliación.',
				title: '¡Alerta!',
				icon: 'assets/icons/Inclub.png'
			}
		});
	}
	private populateTransferData(): void {
		if (this.transferData) {
			this.form.patchValue({
				user: this.transferData.recipientUsername,
				amount: this.transferData.transferAmount
			});

			// Ejecutamos getUsername solo si hay user
			if (this.transferData.recipientUsername) {
				this.getUsername();
			}
		}
	}

	/* === Events === */
	onReset() {
		this.step = 1;
		this.form.reset();
	}

	onPreviousStep() {
		if (this.step == 1) {
			this.router.navigate(['../'], { relativeTo: this.route });
		}
		if (this.step > 1) {
			this.step--;
		}
	}

	onNextStep() {
		if (this.step === 1) {
			const amount = Number(this.form.get('amount').value);
			this.body = {
				idUser: this.userId,
				transactionAmount: amount
			};

			// ---------- Validación de saldo ----------
			if (amount > this.dataWallet.availableBalance) {
				this.dialogService.open(ModalSuccessComponent, {
					header: '',
					data: {
						text: [
							'No cuentas con el saldo suficiente para realizar esta transferencia.',
							`Tu saldo disponible actual es de: $${this.dataWallet.availableBalance.toFixed(
								2
							)}`
						],
						title: '¡Alerta!',
						icon: 'assets/icons/Inclub.png'
					}
				});

				return;
			}
			// -----------------------------------------

			this.postValidateUsername();
			this.step++; // avanza solo si la validación fue satisfactoria
		} else if (this.step === 2) {
			this.bodyPassword = {
				username: this.userInfoService.userInfo.username,
				password: this.form.get('password').value
			};

			this.postValidatePassword().then((isValid) => {
				if (isValid) {
					this.bodyGenerateToken = {
						idUser: this.body.idUser,
						transactionAmount: this.body.transactionAmount,
						idUserReceivingTransfer: this.userIdRecived
					};
					this.postGenerateToken();
					this.step++;
				}
			});
		} else if (this.step === 3) {
			this.bodyRegister = {
				idUser: this.body.idUser,
				idUserReceivingTransfer: this.userIdRecived,
				walletTransaction: {
					initialDate: this.getCurrentDateFormatted(),
					amount: this.body.transactionAmount
				},
				tokenRequest: {
					idUser: this.body.idUser,
					codeToken: this.form.get('confirmCode').value
				}
			};
			this.postRegisterTransferWallet();

			return;
		}
	}

	/* === Getters === */
	get isValidBtn() {
		const userField = this.form.get('user');
		const amountField = this.form.get('amount');
		const passwordField = this.form.get('password');
		const codeField = this.form.get('confirmCode');

		if (this.step === 1) return userField.valid && amountField.valid;
		if (this.step === 2) return passwordField.valid && !passwordField.errors;

		return codeField.valid;
	}

	get title() {
		if (this.step === 1) return 'Transferir dinero entre wallet';
		if (this.step === 2) return 'Verificación de solicitud';

		return 'Confirmación de solicitud';
	}

	get btnText() {
		if (this.step === 1) return 'Siguiente';
		if (this.step === 2) return 'Validar contraseña';

		return 'Validar código';
	}

	get amount() {
		const amountField = this.form.get('amount');

		const vl = Number(amountField.value);

		if (isNaN(vl)) return '0.00';

		return vl.toFixed(2);
	}

	showNotification() {
		const ref = this.modal.open(ModalWalletRegisterTransferComponent, { centered: true });
		const modal = ref.componentInstance as ModalWalletRegisterTransferComponent;
	}

	private getCurrentDateFormatted(): string {
		const date = new Date();

		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');

		const hours = String(date.getHours()).padStart(2, '0');
		const minutes = String(date.getMinutes()).padStart(2, '0');
		const seconds = String(date.getSeconds()).padStart(2, '0');

		return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
	}
	private getVerificacion() {
		return (this.verificacion = false);
	}
	name: string = '';
	lastName: string = '';
	username: string = '';
	private getUsername(): void {
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
							this.name = response.data.name;
							this.lastName = response.data.lastName;
							this.username = response.data.username;
							//this.userEmail = response.data.email;
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

	/* 
		private getUsername(): void {
			const username = this.form.get('user').value;
			if (username) {
				this.authenticationService
					.getUserInfo(username,)
					.pipe(
						tap((response: any) => {
							const userControl = this.form.get('user');
							if (response.result && response.data) {
								userControl.setErrors(null);
								this.userIdRecived = response.data.id;
								console.log('el userIdRecived: ', this.userIdRecived);
							} else {
								userControl.setErrors({ userNotFound: true });
							}
						}),
						catchError((error: HttpErrorResponse) => {
							const userControl = this.form.get('user');
							if (error.status === 404) {
								userControl.setErrors({ userNotFound: true });
							} else {
								userControl.setErrors({ pattern: true });
							}
							return of(null);
						})
					)
					.subscribe();
			}
		} */
	/* 
		private postValidateUsername(): void {
			this.walletService.postValidateUsername(this.body).subscribe((response) => {
				console.log('Validate username: ', response.data);
			});
		} */

	private postValidateUsername(): void {
		const data = {
			username: this.userInfoService.userInfo.username,
			password: this.form.get('password').value
		};

		this.walletService.postValidateUsername(data).subscribe(
			(response) => {
				console.log('Respuesta de validación de contraseña: ', response);
			},
			(error) => {
				console.error('Error en la validación de contraseña: ', error);
			}
		);
	}

	private postValidatePassword(): Promise<boolean> {
		let user = new IUserRequest();
		user.username = this.userInfoService.userInfo.username;
		user.password = this.form.get('password').value;
		return new Promise((resolve) => {
			this.walletService
				.postValidatePassword(user)
				.pipe(
					tap((response) => {
						const userControl = this.form.get('password');
						if (response.data === true) {
							userControl.setErrors(null);
							this.isPasswordValid = true;
							resolve(true);
						} else {
							userControl.setErrors({ passwordInvalid: true });
							this.isPasswordValid = false;
							resolve(false);
						}
					})
				)
				.subscribe();
		});
	}
	reenviarCodeV: boolean = false;
	private postGenerateToken(): void {
		this.isLoading = true;
		this.walletService.postGenerateToken(this.bodyGenerateToken).subscribe((response) => {
			this.isLoading = false;
			if (this.reenviarCodeV) {
				this.reenviarCodeV = false;
				this.modalEnvioCode();
			}
		});
	}

	private postRegisterTransferWallet(): void {
		console.log(this.bodyRegister);

		this.walletService.postRegisterTransferWallet(this.bodyRegister).subscribe((response) => {
			if (response == null || response?.data == false) this.verificacion = true;
			if (response != null && response.data == true) {
				this.dialogService
					.open(ModalSuccessWalletComponent, {
						header: '',
						data: {
							text: 'Tu transferencia fue registrada con éxito.',
							title: '¡Éxito!',
							icon: 'check_circle_outline',
							name: this.name,
							lastName: this.lastName,
							username: this.username,
							monto: this.form.get('amount').value,
							initialDate: this.bodyRegister.walletTransaction.initialDate
						}
					})
					.onClose.pipe(
						tap(() => {
							this.router.navigate(['/profile/ambassador/wallet']);

							//	window.location.reload();
						})
					)
					.subscribe();
			}
		});
	}
	reenviarCode() {
		this.reenviarCodeV = true;

		//reenviar codigo
		this.postGenerateToken();
	}
	modalEnvioCode() {
		this.dialogService.open(ModalAlertComponent, {
			header: '',
			data: {
				message: `Se ha reenviado un código de confirmación al correo : ${this.userEmail}`,
				title: 'Verifica tu Correo!',
				icon: 'pi pi-envelope'
			}
		});
		this.ref.close(true);
	}
}
