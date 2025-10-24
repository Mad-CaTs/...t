import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { CheckboxComponent } from '@shared/components/form-control/checkbox/checkbox.component';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { DynamicDialogRef, DynamicDialogConfig, DialogService } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TreeService } from '../../../../../commons/services/tree.service';
import { tap } from 'rxjs';
import { ModalSuccessComponent } from 'src/app/profiles/commons/modals/modal-success/modal-success.component';
import { InputComponent } from '@shared/components/form-control/input/input.component';
import { MatChipsModule } from '@angular/material/chips';
import { INextPayment } from '@shared/interfaces/payment/next-payment';
import { INumberAndCountry } from '@shared/interfaces/number-and-country';
import { buildWhatsAppMessage, PaymentInfo } from '@shared/interfaces/payment/buildWhatsAppMessage';

@Component({
	selector: 'app-enterprise-bank-details',
	standalone: true,
	providers: [MessageService, DatePipe],
	imports: [
		CommonModule,
		MatIconModule,
		DialogModule,
		ToastModule,
		TableModule,
		CheckboxComponent,
		ReactiveFormsModule,
		InputComponent,
		MatChipsModule
	],
	templateUrl: './paymentAlertModal.html',
	styleUrl: './paymentAlertModal.scss'
})
export class PaymentAlertModal implements OnInit {
	form: FormGroup;
	selectedSubscription: any;
	data: any;
	isLoading = false;
	subscriptionDetails: any;
	disableSubmitButton = false;
	nextPayment: INextPayment;
	numberAndCountry: INumberAndCountry;
	rowUser: any;
	phoneNumber: string = '';

	paymentData: PaymentInfo = {} as PaymentInfo;

	constructor(
		public ref: DynamicDialogRef,
		public config: DynamicDialogConfig,
		private fb: FormBuilder,
		private treeService: TreeService,
		private dialogService: DialogService,
		private datePipe: DatePipe
	) {
		this.initializeForm();
	}

	ngOnInit(): void {
		this.initializeData();
	}
	private initializeData(): void {
		this.nextPayment = this.config.data.nextPayment;
		this.rowUser = this.config.data.row;
		this.numberAndCountry = this.config.data.numberAndCountry;
		this.phoneNumber = this.numberAndCountry.countryCode + this.numberAndCountry.number;
		this.data = this.config.data;
		this.subscriptionDetails = this.data.subscriptionDetails.data;
		this.selectedSubscription = this.findSelectedSubscription();

		this.paymentData = {
			amount: this.data.subscriptionDetails.data.amount,
			dueDate: this.formatDate(this.nextPayment.nextExpirationDate) || '',
			name: this.rowUser.fullName,
			status: this.rowUser.stateName,
			membershipName: this.selectedSubscription?.nameSuscription || '',
		}
	}

	private findSelectedSubscription(): any {
		return this.data.row.suscriptions.find((sub: any) => sub.idSuscription === this.data.subscription);
	}

	private initializeForm(): void {
		this.form = this.fb.group({
			email: ['', [Validators.email]],
			sponsorChecked: [false],
			otherChecked: [false]
		});
		// this.form.get('sponsorChecked')?.disable();
		// this.form.get('otherChecked')?.disable();
		this.handleEmailValidationOnOtherChecked();
	}

	private handleEmailValidationOnOtherChecked(): void {
		this.form.get('otherChecked')?.valueChanges.subscribe((value: boolean) => {
			const emailControl = this.form.get('email');
			if (value) {
				emailControl?.setValidators([Validators.required, Validators.email]);
			} else {
				emailControl?.clearValidators();
			}
			emailControl?.updateValueAndValidity();
		});
	}

	closeModal(): void {
		this.ref.close();
	}

	onSponsorCheckedChange(): void {
		const otherChecked = this.form.get('otherChecked');
		const emailControl = this.form.get('email');
		if (this.form.get('sponsorChecked').value) {
			otherChecked?.setValue(false);
			emailControl?.disable();
			emailControl?.setValue('');
		}
	}

	onOtherCheckedChange(): void {
		const sponsorChecked = this.form.get('sponsorChecked');
		const emailControl = this.form.get('email');
		if (this.form.get('otherChecked').value) {
			sponsorChecked?.setValue(false);
			emailControl?.enable();
		}
	}

	isSubmitEnabled(): boolean {
		const sponsorChecked = this.form.get('sponsorChecked')?.value;
		const otherChecked = this.form.get('otherChecked')?.value;
		const emailValid = this.form.get('email')?.valid;
		if (sponsorChecked) {
			return true;
		}
		if (otherChecked && emailValid) {
			return true;
		}
		return false;
	}

	submitForm(): void {
		if (this.form.valid) {
			this.isLoading = true;
			const payload = this.buildPayload();
			this.treeService.sendEmail(payload).subscribe(
				(response) => {
					this.isLoading = false;
					this.ref.close();
					console.log('Correo enviado con éxito:', response);
					this.dialogService
						.open(ModalSuccessComponent, {
							data: {
								text: 'Tu alerta de pago fue enviada con éxito. ',
								title: '¡Alerta Enviada!',
								icon: 'assets/icons/Inclub.png'
							},
							width: '35%'
						})
						.onClose.pipe(
							tap(() => {
								this.ref.close();
							})
						)
						.subscribe();
				},
				(error) => {
					this.isLoading = false;
					alert('Ocurrió un inconveniente al enviar la alerta de pago.');
					console.error('Error al enviar el correo:', error);
				}
			);
		} else {
			console.error('El formulario no es válido');
		}
	}

	private buildPayload(): any {
		return {
			typeEmail: 3,
			flagSendMaster: 0,
			flagSendPartner: this.form.get('sponsorChecked')?.value ? 1 : 0,
			/* hasta habilitar cheks */
			/* 			flagSendPartner: this.form.get('sponsorChecked')?.value ? 0 : 1,
			 */ otherEmail: this.form.get('otherChecked')?.value ? this.form.get('email')?.value : null,
			idSuscription: this.selectedSubscription?.idSuscription
		};
	}

	openWhatsApp(): void {
		const message = buildWhatsAppMessage(this.paymentData);
		const url = `https://wa.me/${this.phoneNumber}?text=${encodeURIComponent(message)}`;
		window.open(url, '_blank');
	}

	formatDate(dateString: string): string | null {
		return this.datePipe.transform(dateString, 'dd/MM/yyyy');
	}
}
