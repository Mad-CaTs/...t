import { CommonModule, formatDate } from '@angular/common';
import { Component } from '@angular/core';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { BreadcrumbItem } from '@shared/interfaces/breadcrumb';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { PointCardComponent } from 'src/app/profiles/commons/components/point-card/point-card.component';
import { CardCorreoComponent } from './components/card-correo/card-correo.component';
import { MatIconModule } from '@angular/material/icon';
import { DialogService } from 'primeng/dynamicdialog';
import { EmailRateLimitModalComponent } from './commons/modals/email-rate-limit/email-rate-limit-modal.component';
import { EMAIL_CARDS } from '../../commons/contants';
import { EmailService } from '../../commons/services/email/email.service';
import { tap } from 'rxjs';
import { ModalSuccessComponent } from 'src/app/profiles/commons/modals/modal-success/modal-success.component';
import { ModalAlertComponent } from 'src/app/profiles/commons/modals/modal-alert/modal-alert.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EmailShippingTablePresenter } from '../../email-shipping.presenter';

@Component({
	selector: 'app-email-shipping-type',
	standalone: true,
	providers: [EmailShippingTablePresenter],
	imports: [
		BreadcrumbComponent,
		CommonModule,
		PointCardComponent,
		CardCorreoComponent,
		MatIconModule
	],
	templateUrl: './email-shipping-type.component.html',
	styleUrl: './email-shipping-type.component.scss'
})
export default class EmailShippingTypeComponent {
	userData: any;
	breadcrumbItems: BreadcrumbItem[] = [];
	cards1: any[] = [];
	cards2: any[] = [];
	selectedCardIndex: number | null = null;
	isChecked: boolean = false;
	email: string = '';
	showInputEmail: boolean = false;
	isEmailDisabled: boolean = true;
	nombreSuscripcionSeleccionada: string = '';
	idSuscripcionSeleccionada: number | null = null;
	sendToPartner: boolean = false;
	customEmailTypes = [1, 2, 3, 4];
	typeEmail: string = '';
	isLoading: boolean = false;
	lastEmailSentAt: Date | null = this.getLastEmailSentAt();
	form: FormGroup;
	otherEmails: string[] = [];
	isFirstEmailValid: boolean = true;
	isSecondEmailValid: boolean = true;

	constructor(
		private location: Location,
		private router: Router,
		private dialogService: DialogService,
		private emailService: EmailService,
		public presenter: EmailShippingTablePresenter,
		private fb: FormBuilder
	) {
		this.loadUserData();
	}

	ngOnInit(): void {
		this.initBreadcrumb();
		this.generateCards();
		this.generateCards2();
		this.initForm();
	}

	initForm() {
		this.form = this.presenter.initAdditionalFormLogic();
	}

	get isEnviarDisabled(): boolean {
		return this.presenter.isEnviarDisabled(this.selectedCardIndex, this.isLoading);
	}

	private loadUserData(): void {
		const userRaw = sessionStorage.getItem('selectedUser');
		const idRaw = sessionStorage.getItem('selectedSubscription');
		if (userRaw && idRaw) {
			this.userData = JSON.parse(userRaw);
			this.idSuscripcionSeleccionada = +JSON.parse(idRaw);
			console.log('userDatacrea', this.userData);
			if (this.userData && this.userData.idSuscription === this.idSuscripcionSeleccionada) {
				this.nombreSuscripcionSeleccionada = this.userData.namePackage || '';
			}
		} else {
			console.warn('No se encontró el usuario o la suscripción seleccionada');
		}
	}

	public initBreadcrumb(): void {
		this.breadcrumbItems = [
			{
				label: 'Envío de Correos',
				action: () => this.goBack()
			},
			{
				label: 'Usuarios'
			}
		];
	}

	generateCards(): void {
		this.cards1 = [
			{
				value: this.userData?.username,
				image: '',
				initialsName: `${this.userData?.name?.charAt(0) || ''}${
					this.userData?.lastName?.charAt(0) || ''
				}`.toUpperCase(),
				description: `${this.userData?.name || ''} ${this.userData?.lastName || ''}`.trim(),
				subDescription: this.userData?.email
			},
			{
				labelTop: 'Suscripción',
				value: this.nombreSuscripcionSeleccionada,
				image: 'assets/icons/Safiro.svg',
				description: this.userData?.email,
				subDescription:
					'Desde ' +
					formatDate(
						new Date(
							this.userData?.creationDateSuscription[0],
							this.userData?.creationDateSuscription[1] - 1,
							this.userData?.creationDateSuscription[2]
						),
						'dd-MM-yyyy',
						'en-US'
					)
			}
		];
	}

	generateCards2(): void {
		this.cards2 = EMAIL_CARDS;
	}

	onSendToPartnerChange(value: boolean): void {
		this.sendToPartner = value;
		console.log('¿Enviar al patrocinador?:', this.sendToPartner);
	}

	goBack() {
		this.location.back();
	}

	openRejectModal() {
		this.dialogService.open(EmailRateLimitModalComponent, {
			width: '40vw',
			closable: true,
			dismissableMask: true,
			contentStyle: {
				padding: '0.5rem 1rem'
			}
		});
	}

	onCardSelect(index: number): void {
		this.selectedCardIndex = index;
		console.log('Seleccionaste la card número:', index + 1);
		this.typeEmail = this.customEmailTypes[index].toString();
	}

	get fullSponsorName(): string {
		return `${this.userData?.sponsorName || ''} ${this.userData?.sponsorLastName || ''}`.trim();
	}

	onEmailBlur(): void {
		console.log('El campo de correo ha perdido el foco.');
	}

	private getLastEmailSentAt(): Date | null {
		const timestamp = localStorage.getItem('lastEmailSentAt');
		return timestamp ? new Date(timestamp) : null;
	}

	onOtherEmailChange(email: string, index: number): void {
		this.otherEmails[index] = email;
		console.log(`Correo ${index + 1}: ${email}`);
	}

	handleEmailClick(): void {
		const now = new Date();
		if (this.lastEmailSentAt) {
			const diffMs = now.getTime() - this.lastEmailSentAt.getTime();
			const diffMinutes = diffMs / 60000;
			if (diffMinutes < 10) {
				this.openRejectModal();
				return;
			}
		}
		this.sendEmailToUser();
	}

	sendEmailToUser(): void {
		const payload = this.buildEmailPayload();
		this.isLoading = true;

		this.emailService
			.sendEmailNotification(payload)
			.pipe(
				tap(() => {
					const ref = this.dialogService.open(ModalSuccessComponent, {
						header: '',
						width: '40%',
						data: {
							text: 'El correo se envió correctamente al usuario.',
							title: 'Correo enviado con éxito',
							icon: 'check_circle_outline'
						}
					});

					ref.onClose.subscribe(() => {
						this.resetForm();
						this.router.navigate(['/profile/ambassador/email-shipping']);
					});
					const now = new Date();
					this.lastEmailSentAt = now;
					localStorage.setItem('lastEmailSentAt', now.toISOString());
				})
			)
			.subscribe({
				next: (res) => {
					console.log('Correo enviado exitosamente', res);
					this.isLoading = false;
				},
				error: (err) => {
					this.dialogService.open(ModalAlertComponent, {
						header: '',
						data: {
							message: 'Hubo un error al intentar enviar el correo. Inténtalo nuevamente.',
							title: '¡Error!',
							icon: 'pi pi-times-circle'
						}
					});
					console.error('Error al enviar el correo', err);
					this.isLoading = false;
				}
			});
	}

	private buildEmailPayload(): any {
		// Collect emails for otherEmail, ensuring no duplicates
		const otherEmails = [
			this.form.get('checked2')?.value ? this.form.get('email2')?.value?.trim() : null,
			this.form.get('checked3')?.value ? this.form.get('email3')?.value?.trim() : null
		].filter(email => email && email.length > 0); // Filtra valores nulos o vacíos

		// Use Set to remove duplicate emails
		const uniqueEmails = [...new Set(otherEmails)];

		// Set flagSendMaster to 1 if either checked2 or checked3 is true
		const flagSendMaster = this.form.get('checked2')?.value || this.form.get('checked3')?.value ? 1 : 0;

		return {
			typeEmail: this.customEmailTypes[this.selectedCardIndex],
			flagSendMaster: flagSendMaster,
			flagSendPartner: this.form.get('checked1')?.value ? 1 : 0,
			otherEmail: uniqueEmails.length > 0 ? uniqueEmails.join(',') : null,
			idSuscription: this.userData?.idSuscription
		};
	}

	private resetForm(): void {
		this.form.reset({
			checked1: false,
			checked2: false,
			email2: '',
			checked3: false,
			email3: ''
		});
		this.form.get('email2')?.disable();
		this.form.get('email3')?.disable();
		this.selectedCardIndex = null;
		this.form.get('checked1')?.setValue(false, { emitEvent: false });
		this.presenter.updateEnviarButtonState();
	}
}
