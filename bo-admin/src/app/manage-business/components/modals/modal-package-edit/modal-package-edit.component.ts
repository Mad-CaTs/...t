import { ChangeDetectorRef, Component, Input } from '@angular/core';

import { ModalConfirmationComponent } from '@shared/components/modal-confirmation/modal-confirmation.component';

import type { IPackageDto } from '@interfaces/api';

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
import { ISelectOpt } from '@interfaces/form-control.interface';
import { ITablePackagePackage } from '@interfaces/manage-business.interface';
import { PackageAdministratorService } from '@app/manage-business/services/PackageAdministratorService';

@Component({
	selector: 'app-modal-package-upsert',
	standalone: true,
	imports: [CommonModule, ModalComponent, FormControlModule, ReactiveFormsModule],
	templateUrl: './modal-package-edit.component.html',
	styleUrls: ['./modal-package-edit.component.scss']
})
export class ModalPackageEditComponent {
	@Input() id: number;
	@Input() idFamilyPackage: String;
	@Input() package: ITablePackagePackage;

	public loading: boolean = false;

	public form: FormGroup;

	constructor(
		public instanceModal: NgbActiveModal,
		private builder: FormBuilder,
		private modalManager: NgbModal,
		private packagesApi: PackagesApiService,
		private toastManager: ToastService,
		private cdr: ChangeDetectorRef,
		private packageService: PackageAdministratorService
	) {
		this.form = builder.group({
			name: ['', [Validators.required, Validators.minLength(4)]],
			code: ['', [Validators.required, Validators.minLength(2)]],
			description: ['', [Validators.required, Validators.minLength(4)]],
			status: [true]
		});
	}

	ngOnInit(): void {
		this.form.patchValue({
			name: this.package.name,
			code: this.package.code,
			description: this.package.description,
			status: this.package.status
		});
		this.cdr.detectChanges();
	}

	/* === Events === */
	public onSubmit() {
		const name = this.form.get('name')?.value;
		const description = this.form.get('description')?.value;
		const code = this.form.get('code')?.value;
		const status = this.form.get('status')?.value;

		const body = {
			"idPackage": this.id,
			"name": name,
			"codeMembership": code,
			"description": description,
			"idFamilyPackage": this.idFamilyPackage,
			"status": status ? 1 : 0
		}

		this.loading = true;
    	this.packageService.updatePackage(body).subscribe(
      		response => {
       			this.loading = false;
        		const ref = this.modalManager.open(ModalConfirmationComponent, { centered: true, size: 'md' });
        		const modal = ref.componentInstance as ModalConfirmationComponent;

        		modal.body = 'Se actualizó el paquete';
        		modal.icon = 'bi bi-check-circle-fill text-info fa-2x';
        		modal.title = 'Éxito';
        
        		this.instanceModal.close('success');
      		},
      		error => {
        		this.loading = false;
        		this.toastManager.addToast('Hubo un error al editar.', 'error');
        		console.error('Error updating package:', error);
      		}
    	);
	}

	/* === Getters === */
	get title() {
		return 'Editar paquete';
	}
}
