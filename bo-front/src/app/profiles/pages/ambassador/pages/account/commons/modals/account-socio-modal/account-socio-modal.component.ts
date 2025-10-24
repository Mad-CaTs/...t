import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { InputComponent } from '@shared/components/form-control/input/input.component';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { NewPartnerService } from '../../../../new-partner/commons/services/new-partner.service';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';

@Component({
	selector: 'app-account-socio-modal',
	standalone: true,
	imports: [ReactiveFormsModule, InputComponent, MatIconModule],
	templateUrl: './account-socio-modal.component.html',
	styleUrl: './account-socio-modal.component.scss'
})
export class AccountSocioModalComponent {
	constructor(
		private fb: FormBuilder,
		public ref: DynamicDialogRef,
		private newPartnerService: NewPartnerService,
		private userInfoService: UserInfoService
	) {
		this.userInfo = this.userInfoService.userInfo;
		this.formUser = this.fb.group({
			username: ['', [Validators.required, Validators.minLength(3)]],
			sponsor: [{ value: 'Omar Urteaga', disabled: true }]
		});
	}

	public userInfo: any;
	public formUser: FormGroup;
	isLoading: boolean = false;

	ngOnInit(): void {
		// Aquí podrías cargar datos iniciales si vienen de una API
		this.newPartnerService.getUserByUsername(this.userInfo.username).subscribe({
			next: (value) => {
				this.formUser.patchValue({
					username: value.userName
				});
			}
		});
		console.log('Datos User', this.userInfo);
		this.formUser.get('username').disable();
	}

	closeModal(): void {
		this.ref.close();
	}

	updateUserData(): void {
		if (this.formUser.invalid) {
			return;
		}

		this.isLoading = true;

		// Simulación de una petición a un backend
		setTimeout(() => {
			console.log('Datos actualizados:', this.formUser.getRawValue());
			this.isLoading = false;
			this.ref.close(this.formUser.getRawValue());
		}, 1500);
	}
}
