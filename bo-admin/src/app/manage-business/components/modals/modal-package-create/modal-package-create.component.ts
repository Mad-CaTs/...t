import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

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
import { ModalPackageCreateContinueComponent } from '../modal-package-create-continue/modal-package-create-continue.component';

@Component({
	selector: 'app-modal-package-upsert',
	standalone: true,
	imports: [CommonModule, ModalComponent, FormControlModule, ReactiveFormsModule],
	templateUrl: './modal-package-create.component.html',
	styleUrls: ['./modal-package-create.component.scss']
})
export class ModalPackageCreateComponent implements OnInit, OnChanges {
	@Input() idFamilypackage: any;
	@Input() options: ISelectOpt[];

	public loading: boolean = false;

	public form: FormGroup;

	constructor(
		public instanceModal: NgbActiveModal,
		private builder: FormBuilder,
		private cdr: ChangeDetectorRef
	) {
		
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['idFamilypackage'] && this.form) {
			this.form.patchValue({
				family: this.idFamilypackage || '1'
			});
		}
	}

	ngOnInit(): void {
		this.form = this.builder.group({
			name: ['', [Validators.required, Validators.minLength(4)]],
			code: ['', [Validators.required, Validators.minLength(2)]],
			description: ['', [Validators.required, Validators.minLength(4)]],
			status: [true],
			family: this.idFamilypackage || '1'
		});
		this.cdr.detectChanges();
	}

	/* === Events === */
	public onSubmit() {
		if (this.form.valid) {
			const packageToSend: ITablePackagePackage = {
				id: Number(this.form.get('family')?.value),
				name: this.form.get('name')?.value,
				code: this.form.get('code')?.value,
				description: this.form.get('description')?.value,
				status: this.form.get('status')?.value
			};

			// Cerrar el modal y enviar los datos
			this.instanceModal.close({ continue: true, packageData: packageToSend });
		}
	}

	/* === Helpers === */

	/* === Getters === */
	get title() {
		return 'Agregar paquete';
	}
}
