import { ChangeDetectorRef, Component, Input } from '@angular/core';

import { ModalConfirmationComponent } from '@shared/components/modal-confirmation/modal-confirmation.component';

import type { IPackageDetailDto } from '@interfaces/api';

import { of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PackagesApiService } from '@app/core/services/api/manage-business/packages-api.service';
import { ToastService } from '@app/core/services/toast.service';

/* === Modules === */

import { CommonModule } from '@angular/common';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ITablePackagePackage } from '@interfaces/manage-business.interface';
import { MembershipVersionAdministratorService } from '@app/manage-business/services/MembershipVersionAdministratorService';
import { PackageAdministratorService } from '@app/manage-business/services/PackageAdministratorService';

@Component({
	selector: 'app-modal-create-continue-package',
	standalone: true,
	imports: [CommonModule, ModalComponent, FormControlModule, ReactiveFormsModule],
	templateUrl: './modal-package-create-continue.component.html',
	styleUrls: ['./modal-package-create-continue.component.scss']
})
export class ModalPackageCreateContinueComponent {
	@Input() package: ITablePackagePackage;
	public form: FormGroup;
	public loading: boolean = false;
	public lastVersion: String;

	constructor(
		public instanceModal: NgbActiveModal,
		private builder: FormBuilder,
		private toastManager: ToastService,
		private modalManager: NgbModal,
		private membershipVersionService: MembershipVersionAdministratorService,
		private packageService: PackageAdministratorService,
		private cdr: ChangeDetectorRef
	) {
		this.form = builder.group({
			family: ['1', [Validators.required]],
			lastVersion: ['', [Validators.required]],
			months: ['', [Validators.required, Validators.min(1)]],
			price: ['', [Validators.required, Validators.min(0)]],
			cuotes: ['', [Validators.required, Validators.min(0)]],
			initialPrice: ['', [Validators.required, Validators.min(0)]],
			cuotePrice: ['', [Validators.required, Validators.min(0)]],
			volume: ['', [Validators.required, Validators.min(0)]],
			cuoteN: ['', [Validators.required, Validators.min(0)]],
			comission: ['', [Validators.required, Validators.min(0)]],
			accionsN: ['', [Validators.required, Validators.min(0)]]
		});

		this.form.get('lastVersion')?.disable();
	}

	ngOnInit(): void {

		this.membershipVersionService.getLastMembershipVersionByFamilyPackage(this.package.id.toString()).subscribe(
			(data) => {
				if (data) {
					this.lastVersion = data.idMembershipVersion;
					this.form.get('lastVersion')?.setValue(this.lastVersion);
					this.cdr.detectChanges();
				} 
				else {
					console.error('No se encontró la última versión de membresía');
				}
			},
			(error) => {
				console.error('Error al obtener la última versión de membresía:', error);
			}
		);
	}

	/* === Events === */
	public onSubmit() {
		if (this.form.valid) {
			const raw = this.form.getRawValue();
			const packageToSend = {
				name: this.package.name,
				codeMembership: this.package.code,
				description: this.package.description,
				idFamilyPackage: this.package.id,
				status: this.package.status ? 1 : 0,
				packageDetail: [
			  	{
					idPackage: this.package.id,
					monthsDuration: Number(raw.months),
					price: Number(raw.price),
					numberQuotas: Number(raw.cuotes),
					initialPrice: Number(raw.initialPrice),
					quotaPrice: Number(raw.cuotePrice),
					volume: Number(raw.volume),
					numberInitialQuote: Number(raw.cuoteN),
					comission: Number(raw.comission),
					numberShares: Number(raw.accionsN),
					idFamilyPackage: Number(raw.family),
					idMembershipVersion: Number(raw.lastVersion),
					membershipMaintenance: 0,
					//IsSpecialFractional: false, 
					//IsFamilyBonus: false 
			  	}]
		  	};

			this.loading = true;

			this.packageService.createPackage(packageToSend).subscribe(
				(response) => {
	
					const ref = this.modalManager.open(ModalConfirmationComponent, { centered: true, size: 'md' });
					const modal = ref.componentInstance as ModalConfirmationComponent;
	
					modal.body = 'Se creó el paquete exitosamente';
					modal.icon = 'bi bi-check-circle-fill text-info fa-2x';
					modal.title = 'Éxito';
	
					this.instanceModal.close();
					this.loading = false; 
				},

				(error) => {
					console.error('Error al crear el paquete:', error);

					this.toastManager.addToast('Hubo un error al crear el paquete.', 'error');
	
					this.loading = false; 
				}
			);
			
		} 
		else {

			this.toastManager.addToast('Hubo un error al crear el paquete.', 'error');
			this.loading = false; 
			console.error('Formulario inválido');
		}
	}	  

	/* === Helpers === */
	private create(dto: IPackageDetailDto) {

	}

	
	/* === Getters === */
	get title() {
		return 'Agregar detalle de paquete';
	}
}
