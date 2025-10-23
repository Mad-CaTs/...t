import { Component } from '@angular/core';

import { ModalConfirmationComponent } from '@shared/components/modal-confirmation/modal-confirmation.component';

import { catchError, finalize, map } from 'rxjs/operators';
import { of } from 'rxjs';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PackagesApiService } from '@app/core/services/api/manage-business/packages-api.service';
import { ToastService } from '@app/core/services/toast.service';

/* === Modules === */
import { CommonModule } from '@angular/common';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FamilyPackageAdministratorService } from '@app/manage-business/services/FamilyPackageAdministratorService';

@Component({
	selector: 'app-modal-family-create',
	standalone: true,
	imports: [CommonModule, ModalComponent, FormControlModule, ReactiveFormsModule],
	templateUrl: './modal-family-create.component.html',
	styleUrls: ['./modal-family-create.component.scss']
})
export class ModalFamilyCreateComponent {
	public form: FormGroup;
	public loading: boolean;

	constructor(
		public instanceModal: NgbActiveModal,
		private builder: FormBuilder,
		private modalManager: NgbModal,
		private packagesApi: PackagesApiService,
		private toastManager: ToastService,
		private familyPackageService: FamilyPackageAdministratorService
	) {
		this.form = builder.group({
			name: ['', [Validators.required, Validators.minLength(4)]],
			description: ['', [Validators.required, Validators.minLength(4)]]
		});
	}

	/* === Events === */
	public onSubmit() {
		if (this.form.invalid) {
		  this.toastManager.addToast('Por favor, complete todos los campos correctamente.', 'warning');
		  return;
		}
	
		const { name, description } = this.form.getRawValue();
		this.loading = true;
	
		this.familyPackageService.createNewFamilyPackage(name, description).pipe(
			map(res => {
				this.instanceModal.close();
	
				const ref = this.modalManager.open(ModalConfirmationComponent, { centered: true, size: 'md' });
				const modal = ref.componentInstance as ModalConfirmationComponent;
	
				modal.body = 'Se creó la Familia de paquetes';
				modal.icon = 'bi bi-check-circle-fill text-info fa-2x';
				modal.title = 'Éxito';
		  	}),
		  	catchError(e => {
				this.toastManager.addToast('Hubo un error al crear.', 'error');
				return of(undefined);
		  	}),
		  	finalize(() => this.loading = false)
		).subscribe();
	}
	
}
