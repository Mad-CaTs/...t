import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RecoveryMethodButtonComponent } from './components/recovery-method-button/recovery-method-button.component';
import { StepperModule } from 'primeng/stepper';
import { ButtonModule } from 'primeng/button';
import { EmailInputComponent } from './components/email-input/email-input.component';
import { RecoveryContentComponent } from './layout/recovery-content/recovery-content.component';
import { AttemptResult, RecoveryMethod, TokenGenerationStatus } from './commons/enums/recovery.enum';
import { RecoveryService } from './commons/services/recovery.service';
import {
	RemainingTime,
	TokenGenerationResult,
	TokenValidationResult
} from './commons/interfaces/recovery.interface';
import { Steps } from './commons/constants/recovery.constants';
import { TokenInputOtpComponent } from './components/token-input-otp/token-input-otp.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { strongPasswordValidator } from './commons/validators/password.validator';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ModalInfoComponent } from '../modal/modal-info/modal-info.component';
import { DialogData } from '../modal/modal-info/interface/modal-info.interface';
import {
	ATTEMPT_MESSAGES,
	RECOVERY_MESSAGES,
	SERVER_ERROR_MESSAGES,
	TOKEN_GENERATION_MESSAGES
} from './commons/constants/recovery-dialog.constants';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
	selector: 'app-forgot-password',
	standalone: true,
	imports: [
		ReactiveFormsModule,
		RecoveryContentComponent,
		EmailInputComponent,
		RecoveryMethodButtonComponent,
		TokenInputOtpComponent,
		ChangePasswordComponent,
		StepperModule,
		ButtonModule
	],
	templateUrl: './forgot-password.component.html',
	styleUrls: ['./forgot-password.component.scss'],
	animations: [
		trigger('stepTransition', [
			transition(':enter', [
				style({ opacity: 0, transform: 'translateX(15%)' }),
				animate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
			]),
			transition(':leave', [
				animate('200ms ease-in', style({ opacity: 0, transform: 'translateX(-5%)' }))
			])
		])
	],
	providers: []
})
export default class ForgotPasswordComponent {
	steps = Steps;
	methods = Object.values(RecoveryMethod);
	VALIDATE_TOKEN_STEP: { title: string; message: string } | null = null;
	remainingTime: RemainingTime | null = null;
	loadingRecovery: boolean = false;

	private _formBuilder: FormBuilder = inject(FormBuilder);
	private _router: Router = inject(Router);
	private _dialogService: DialogService = inject(DialogService);
	private _idResetToken: number | null = null;
	private _token: string | null = null;
	private _recoveryService: RecoveryService = inject(RecoveryService);

	recoveryForm: FormGroup = this._formBuilder.group({
		methodForm: this._formBuilder.group({
			method: [null, Validators.required]
		}),

		emailForm: this._formBuilder.group({
			email: [
				'',
				[Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]
			]
		}),

		codeForm: this._formBuilder.group({
			token: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4)]]
		}),

		changePasswordForm: this._formBuilder.group({
			password: ['', [Validators.required, strongPasswordValidator(), Validators.maxLength(64)]],
			confirmPassword: ['', [Validators.required, strongPasswordValidator(), Validators.maxLength(64)]]
		})
	});

	methodGroup = this.recoveryForm.get('methodForm');
	emailGroup = this.recoveryForm.get('emailForm');
	codeGroup = this.recoveryForm.get('codeForm');
	changePasswordGroup = this.recoveryForm.get('changePasswordForm');

	onEmailWritten(email: string) {
		this.VALIDATE_TOKEN_STEP = {
			title: this.steps.VALIDATE_TOKEN_STEP.title,
			message: this.steps.VALIDATE_TOKEN_STEP.message(email)
		};
	}

	sendRecoveryRequest(nextCallback) {
		if (this.methodGroup.valid && this.emailGroup.valid) {
			this.loadingRecovery = true;
			const method = this.methodGroup.value.method as RecoveryMethod;
			const email = this.emailGroup.value.email;

			this._recoveryService.sendRecoveryToken({ email, method }).subscribe({
				next: (result: TokenGenerationResult) => {
					this.remainingTime = result.remainingTime;
					this.loadingRecovery = false;
					if (result.status === TokenGenerationStatus.ALLOWED) {
						this._idResetToken = result.resetTokenId;
						const data: DialogData = TOKEN_GENERATION_MESSAGES[TokenGenerationStatus.ALLOWED];
						this.openModalInfo(data).onClose.subscribe({
							next: () => {
								nextCallback.emit();
							}
						});
					} else {
						this.resultTokenGeneration(result);
					}
				},
				error: (e) => {
					this.loadingRecovery = false;
					if (e.status === 404) {
						const data: DialogData = RECOVERY_MESSAGES.EMAIL_NOT_FOUND;
						this.openModalInfo(data);
					}
					if (e.error.message === 'This account is multicode.') {
						const data: DialogData = RECOVERY_MESSAGES.ITS_MULTICODE_ACCOUNT;
						this.openModalInfo(data);
					}
					if (e.error.message === 'This account is not multicode.') {
						const data: DialogData = RECOVERY_MESSAGES.ITS_USER_ACCOUNT;
						this.openModalInfo(data);
					}
					const serverError: DialogData = SERVER_ERROR_MESSAGES.DEFAULT;
					this.openModalInfo(serverError);
				}
			});
		}
	}

	onRequestNewCode() {
		if (this.methodGroup.valid && this.emailGroup.valid) {
			this.loadingRecovery = true;
			const method = this.methodGroup.value.method as RecoveryMethod;
			const email = this.emailGroup.value.email;

			this._recoveryService.sendRecoveryToken({ email, method }).subscribe({
				next: (result: TokenGenerationResult) => {
					this.remainingTime = result.remainingTime;
					this.loadingRecovery = false;
					if (result.status === TokenGenerationStatus.ALLOWED) {
						this._idResetToken = result.resetTokenId;
						const data: DialogData = TOKEN_GENERATION_MESSAGES[TokenGenerationStatus.ALLOWED];
						this.openModalInfo(data);
					} else {
						this.resultTokenGeneration(result);
					}
				},
				error: (e) => {
					this.loadingRecovery = false;
					const serverError: DialogData = SERVER_ERROR_MESSAGES.DEFAULT;
					this.openModalInfo(serverError);
				}
			});
		}
	}

	resultTokenGeneration(result: TokenGenerationResult) {
		if (result.status === TokenGenerationStatus.ERROR_TOO_SOON) {
			const config = TOKEN_GENERATION_MESSAGES[TokenGenerationStatus.ERROR_TOO_SOON];
			const message: string = this.calculateTimeLeft(this.remainingTime);
			const data: DialogData = this.resolveDialogData(config, message);
			this.openModalInfo(data);
		}
		if (result.status === TokenGenerationStatus.ERROR_COOLDOWN_EXCEEDED) {
			const config = TOKEN_GENERATION_MESSAGES[TokenGenerationStatus.ERROR_COOLDOWN_EXCEEDED];
			const message: string = this.calculateTimeLeft(this.remainingTime);
			const data: DialogData = this.resolveDialogData(config, message);
			this.openModalInfo(data);
		}
	}

	validateToken(nextCallback) {
		if (this.codeGroup.valid) {
			this.loadingRecovery = true;
			const token = this.codeGroup.value.token;
			this._recoveryService.validateToken({ recoveryTokenId: this._idResetToken, token }).subscribe({
				next: (result: TokenValidationResult) => {
					this.loadingRecovery = false;
					if (result.isValidToken) {
						const data: DialogData = ATTEMPT_MESSAGES[AttemptResult.SUCCESS];
						this.openModalInfo(data).onClose.subscribe({
							next: () => {
								this._token = token;
								nextCallback.emit();
							}
						});
					} else {
						this.resultTokenValidation(result);
					}
				},
				error: (e) => {
					this.loadingRecovery = false;
					const serverError: DialogData = SERVER_ERROR_MESSAGES.DEFAULT;
					this.openModalInfo(serverError);
				}
			});
		}
	}

	recoverPassword() {
		if (this.changePasswordGroup.valid) {
			const { password, confirmPassword } = this.changePasswordGroup.value;
			if (password === confirmPassword) {
				this.loadingRecovery = true;
				this._recoveryService
					.changePassword({
						recoveryTokenId: this._idResetToken,
						token: this._token,
						newPassword: password
					})
					.subscribe({
						next: (result: TokenValidationResult) => {
							this.loadingRecovery = false;
							if (result.isValidToken) {
								const data: DialogData = RECOVERY_MESSAGES.SUCCESS;
								this.openModalInfo(data).onClose.subscribe({
									next: () => {
										this.recoveryForm.reset();
										this.goLogin();
									}
								});
							} else {
								this.resultTokenValidation(result);
							}
						},
						error: (e) => {
							this.loadingRecovery = false;
							const serverError: DialogData = SERVER_ERROR_MESSAGES.DEFAULT;
							this.openModalInfo(serverError);
						}
					});
			} else {
				const data: DialogData = RECOVERY_MESSAGES.PASSWORDS_NOT_MATCH;
				this.openModalInfo(data);
			}
		}
	}

	resultTokenValidation(result: TokenValidationResult) {
		if (result.attemptResult === AttemptResult.EXPIRED) {
			const data: DialogData = ATTEMPT_MESSAGES[AttemptResult.EXPIRED];
			this.openModalInfo(data);
		}
		if (result.attemptResult === AttemptResult.TOO_MANY_ATTEMPTS) {
			const data: DialogData = ATTEMPT_MESSAGES[AttemptResult.TOO_MANY_ATTEMPTS];
			this.openModalInfo(data);
		}
		if (result.attemptResult === AttemptResult.ALREADY_USED) {
			const data: DialogData = ATTEMPT_MESSAGES[AttemptResult.ALREADY_USED];
			this.openModalInfo(data);
		}
		if (result.attemptResult === AttemptResult.FAILURE) {
			const data: DialogData = ATTEMPT_MESSAGES[AttemptResult.FAILURE];
			this.openModalInfo(data);
		}
	}

	openModalInfo(data: DialogData): DynamicDialogRef {
		return this._dialogService.open(ModalInfoComponent, {
			data,
			width: '440px',
			breakpoints: {
				'450px': '90vw',
				'320px': '95vw'
			},
			styleClass: 'custom-info-dialog'
		});
	}

	calculateTimeLeft(remainingTime: RemainingTime): string {
		const paddedSec =
			remainingTime.seconds < 10 ? '0' + remainingTime.seconds : remainingTime.seconds.toString();
		if (remainingTime.minutes > 0) {
			return `${remainingTime.minutes}:${paddedSec} minuto${remainingTime.minutes > 1 ? 's' : ''}`;
		}
		return `${paddedSec} segundo${remainingTime.seconds > 1 ? 's' : ''}`;
	}

	resolveDialogData<T extends DialogData>(config: T, arg?: string): T {
		return {
			...config,
			message: typeof config.message === 'function' ? config.message(arg ?? '') : config.message
		};
	}

	goLogin() {
		this._router.navigate(['/login-nuevo']);
	}
}
