import { Component, inject, OnInit } from '@angular/core';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogData, PackageToTransfer } from '../commons/interfaces/new-partner-select-package';
import { PackageToTransferComponent } from './package-to-transfer/package-to-transfer.component';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NewPartnerService } from '../../../commons/services/new-partner.service';
import { AuthenticationService } from '@shared/services';
import { Router } from '@angular/router';
import { TransferResponseModalComponent } from './transfer-response-modal/transfer-response-modal.component';

@Component({
	selector: 'app-multi-code-packages',
	standalone: true,
	imports: [
		PackageToTransferComponent,
		CommonModule,
		ReactiveFormsModule,
	],
	templateUrl: './multi-code-packages.component.html',
	styleUrl: './multi-code-packages.component.scss'
})
export class MultiCodePackagesComponent implements OnInit {
	private router: Router = inject(Router);
	public ref: DynamicDialogRef = inject(DynamicDialogRef);
	public config: DynamicDialogConfig = inject(DynamicDialogConfig);
	private _newPartnerService: NewPartnerService = inject(NewPartnerService);
	private _authenticationService: AuthenticationService = inject(AuthenticationService);
	private _formBuilder: FormBuilder = inject(FormBuilder);
	private dialogService: DialogService = inject(DialogService);
	public packages: PackageToTransfer[] = [];
	public isLoading: boolean = true;
	public selectedPackage: PackageToTransfer | null = null;
	public disabledTransfer: boolean = true;

	form: FormGroup = this._formBuilder.group({
		package: [null, Validators.required]
	});

	ngOnInit() {
		this.packages = this.config.data;
		setTimeout(() => {
			this.isLoading = false;
		}, 1000);
	}

	closeModal() {
		this.ref.close();
	}

	onPackageSelected(idSubscription: number) {
		this.selectedPackage = this.packages.find((pkg) => pkg.idSubscription === idSubscription);
		if (this.selectedPackage) {
			this.disabledTransfer = false;
		}
	}

	onSubmit() {
		if (this.form.valid) {
			const payload = {
				idSubscription: this.selectedPackage?.idSubscription,
				idSponsor: this.selectedPackage?.idSponsor,
				typeUser: this.selectedPackage?.typeUser,
			};
			this._newPartnerService.createNewParner(payload).subscribe({
				next: (response) => {
					this._authenticationService.getUser();
					this.closeModal();
					this.modalResponse(true);
				},
				error: (error) => {
					this.modalResponse(false);
					console.error('Error creating package:', error);
				}
			});
		} else {
			this.form.markAllAsTouched();
		}
	}

	modalResponse(isSuccess: boolean) {
		let data: DialogData = null;
		if (isSuccess) {
			data = {
				title: 'Registro exitoso',
				message: `Los datos de tu registro se guardaron exitosamente. Su membresía <b>${this.selectedPackage?.nameSubscription}</b> ha sido transferida correctamente.`,
				icon: {
					name: 'pi pi-check-circle',
					color: '3,152,85',
					bgColor: '#D1FADF',
					borderColor: '#ECFDF3'
				}
			};
		} else {
			data = {
				title: 'Error en la transferencia',
				message: 'Ha ocurrido un error al transferir la membresía. Por favor, intente nuevamente.',
				icon: {
					name: 'pi pi-times-circle',
					color: '220,53,69',
					bgColor: '#F5C2C7',
					borderColor: '#F8E0E2'
				}
			};
		}

		if (data) {
			const dialog = this.dialogService.open(TransferResponseModalComponent, {
				width: '390px',
				data: data,
				breakpoints: {
					'400px': '90vw',
					'320px': '95vw'
				}
			});

			dialog.onClose.subscribe(() => {
				if (isSuccess) {
					this.router.navigate(['/profile/partner']);
				}
			});
		}
	}
}
