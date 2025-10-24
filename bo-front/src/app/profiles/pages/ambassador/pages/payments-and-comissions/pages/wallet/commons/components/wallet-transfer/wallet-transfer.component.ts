import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { InputComponent } from '@shared/components/form-control/input/input.component';
import { AuthenticationService } from '@shared/services';
import { catchError, of, tap } from 'rxjs';
import { WalletService } from '../../services/wallet.service';
import {
	IUserRequest,
	IWalletGenerateToken,
	IWalletRegisterTransferWallet,
	IWalletValidatePassword,
	IWalletValidateUsernameAndAmount
} from '../../../commons/interfaces/wallet.interface';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalWalletRegisterTransferComponent } from './commons/modals/modal-wallet-register-transfer.component';
import { Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { ModalSuccessComponent } from 'src/app/profiles/commons/modals/modal-success/modal-success.component';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
	selector: 'app-wallet-transfer',
	templateUrl: './wallet-transfer.component.html',
	standalone: true,
	providers: [DialogService, MessageService],
	imports: [ToastModule, CommonModule, ReactiveFormsModule, ModalSuccessComponent, InputComponent, MatIconModule],
	styleUrls: []
})
export class WalletTransferComponent implements OnInit {
	@Input() walletBlock: boolean = false;
	public form: FormGroup;
	public showPassword: boolean = false;
	public step = 1;
	public userId: number = this.userInfoService.userInfo.id;
	public body: IWalletValidateUsernameAndAmount;
	public bodyPassword: IWalletValidatePassword;
	public userIdRecived: number;
	public bodyGenerateToken: IWalletGenerateToken;
	public isPasswordValid: boolean = false;
	public bodyRegister: IWalletRegisterTransferWallet;
	public btnBack = "Atrás";
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
		private messageService: MessageService,

	) {
		// this.form = formBuilder.group({
		// 	user: ['', [Validators.required, Validators.minLength(3)]],
		// 	amount: [0, [Validators.required, Validators.min(0.01)]],
		// 	confirmCode: ['', [Validators.required, Validators.minLength(4)]],
		// 	password: ['', Validators.required]
		// });
	}




	ngOnInit(): void {
		console.log('Preloaded Transfer Data:', this.transferData);  // Aquí estás verificando si llega correctamente

		this.form = this.formBuilder.group({
			user: ['', [Validators.required, Validators.minLength(3)]],
			amount: [0, [Validators.required, Validators.min(0.01)]],
			password: ['', Validators.required],
			confirmCode: ['', [Validators.required, Validators.minLength(4)]]
		});
		if (this.walletBlock) {
			this.form.disable();
		}
		this.populateTransferData();
	}

	private populateTransferData(): void {
		if (this.transferData) {
			this.form.patchValue({
				user: this.transferData.recipientUsername,
				amount: this.transferData.transferAmount,
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
		if (this.step > 1) {
			this.step--;
		}
	}

	onNextStep() {
		if (this.step === 1) {
			this.body = {
				idUser: this.userId,
				transactionAmount: this.form.get('amount').value
			};
			console.log('Body: ', this.body);
			this.postValidateUsername();
			if (this.form.get('amount').value > 0) {
				this.step++;
			} else {
				this.messageService.add({
					severity: 'info',
					summary: 'Info',
					detail: "Monto incorrecto",
					life: 3000
				});
			}
		} else if (this.step === 2) {
			this.bodyPassword = {
				username: this.userInfoService.userInfo.username,
				password: this.form.get('password').value
			};
			console.log('BodyPassword: ', this.bodyPassword);

			this.postValidatePassword().then((isValid) => {
				if (isValid) {
					this.bodyGenerateToken = {
						idUser: this.body.idUser,
						transactionAmount: this.body.transactionAmount,
						idUserReceivingTransfer: this.userIdRecived
					};
					console.log('BodyGenerateToken: ', this.bodyGenerateToken);

					this.postGenerateToken();
					this.step++;
				}
			});
		} else if (this.step === 3) {
			console.log('codeToken: ', this.form.get('confirmCode').value);
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
			console.log('bodyRegister: ', this.bodyRegister);
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
		if (this.step === 1) return 'Datos de la transferencia';
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
		console.log("password", data.password);


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

	private postGenerateToken(): void {
		this.walletService.postGenerateToken(this.bodyGenerateToken).subscribe((response) => {
			console.log('El resultado del token: ', response.data);
		});
	}

	private postRegisterTransferWallet(): void {
		this.walletService.postRegisterTransferWallet(this.bodyRegister).subscribe((response) => {
			console.log('El resultado del register: ', response.data);
			this.dialogService
				.open(ModalSuccessComponent, {
					header: '',
					data: {
						text: 'Tu transferencia fue registrada con éxito.',
						title: '¡Éxito!',
						icon: 'check_circle_outline'
					}
				})
				.onClose.pipe(
					tap(() => {
						window.location.reload();
					})
				)
				.subscribe();
		});
	}
}
