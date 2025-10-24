import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from '@shared/components/form-control/input/input.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';
import { AccountServiceService } from '../../services/account-service.service';
import { ModalSuccessComponent } from 'src/app/profiles/commons/modals/modal-success/modal-success.component';
import { ModalAlertComponent } from 'src/app/profiles/commons/modals/modal-alert/modal-alert.component';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from 'src/app/authentication/commons/services/services-auth/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ModalLoadingComponent } from '@shared/components/modal/modal-loading/modal-loading.component';
import { finalize } from 'rxjs';
import { CodeConfirmationComponent } from '../code-confirmation/code-confirmation.component';

@Component({
	selector: 'app-account-change-password-modal',
	standalone: true,
	imports: [InputComponent, ReactiveFormsModule, CommonModule],
	templateUrl: './account-change-password-modal.component.html',
	styleUrl: './account-change-password-modal.component.scss'
})
export class AccountChangePasswordModalComponent {
	formPassword: FormGroup;
	isLoading = false;
	public userInfo: any;
	errorAlert: string;
	dialogRef: DynamicDialogRef;
	public disabledUser: boolean = this.userInfoService.disabled;

	constructor(
		private fb: FormBuilder,
		public ref: DynamicDialogRef,
		private userInfoService: UserInfoService,
		private accountService: AccountServiceService,
		private dialogService: DialogService,
		private cookieService: CookieService,
		private authService: AuthService,
		private router: Router
	) {
		this.userInfo = this.userInfoService.userInfo;
		this.formPassword = this.fb.group({
			currentPassword: ['', [Validators.required, Validators.minLength(8)]],
			newPassword: ['', [Validators.required, Validators.minLength(8)]],
			confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
			forceLogout: [false]
		});
	}

	ngOnInit(): void {
	}

	private handleSuccess(response: any, newPassword: string): void {
		console.log('msgSuccess', response);

		const ref = this.dialogService.open(ModalSuccessComponent, {
			header: '',
			data: {
				text: `La contraseña se actualizó con éxito. \nSu nueva contraseña es: ${newPassword}`,
				title: '¡Éxito!',
				icon: 'assets/icons/Inclub.png'
			}
		});
		ref.onClose.subscribe(() => this.logout());
		this.ref.close(true);
	}

	private handleError(error: any): void {
		this.dialogService.open(ModalAlertComponent, {
			header: '',
			data: {
				message: `La contraseña no se pudo actualizar: \n${error.error.message}`,
				title: '¡Error!',
				icon: 'pi pi-times-circle'
			}
		});
		this.ref.close(true);
	}

	updatePassword() {
		this.isLoading = true;
		const { currentPassword, newPassword, confirmPassword } = this.formPassword.value;
		if (newPassword !== confirmPassword) {
			alert('Las contraseñas no coinciden');
			this.isLoading = false;
			return;
		}
		this.authService.login(this.userInfo.username, currentPassword).subscribe({
			next: (response) => {
				this.accountService.sendCode(this.userInfo?.email).subscribe({
					next: () => {
						this.dialogRef = this.dialogService.open(CodeConfirmationComponent, {
							header: 'Validar código',
							width: '20%',
							data: {
								userId: this.userInfo.id
							}
						});
						this.dialogRef.onClose.subscribe((data) => {
							this.isLoading = false;
							if (data === true) {
								this.isLoading = true;
								const passwordData = {
									username: this.userInfo?.username,
									oldPassword: currentPassword,
									newPassword: newPassword
								};
								if (!passwordData.username) {
									this.isLoading = false;
									return;
								}
								this.accountService.changePassword(passwordData)
									.pipe(
										finalize(() => {
											this.isLoading = false;
										})
									)
									.subscribe({
										next: (response) => this.handleSuccess(response, passwordData.newPassword),
										error: (error) => this.handleError(error)
									});
							} else if (data === false) {
								alert('Código inválido, volver a generarlo.');
							}
						});
					},
					error: () => {
						alert('Error al enviar el correo');
					}
				});
			},
			error: (error) => {
				this.isLoading = false;
				if (error?.error?.errorCode === 'CREDENTIALS_ERROR') {
					alert('Clave actual incorrecta.');
				} else {
					alert(error?.error?.message || 'Error desconocido');
				}
			}
		});
	}

	logout(): void {
		this.cookieService.deleteAll();
		localStorage.clear();
		sessionStorage.clear();
		this.authService.logout().subscribe({
			next: (response) => { },
			error: (error) => { },
			complete: () => {
				this.router.navigate(['/home']).then(() => {
					window.location.reload();
				});
			}
		});
	}

	closeModal() {
		this.ref.close();
	}

	trimSpaces(field: string): void {
		const control = this.formPassword.get(field);
		if (control) {
			const trimmedValue = control.value.replace(/\s+/g, '');
			control.setValue(trimmedValue);
		}
	}
}
