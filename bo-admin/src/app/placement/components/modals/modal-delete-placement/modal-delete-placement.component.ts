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
import { InlineSVGModule } from 'ng-inline-svg-2';

@Component({
	selector: 'app-modal-delete-placement',
	standalone: true,
	imports: [CommonModule, ModalComponent, FormControlModule, InlineSVGModule, ReactiveFormsModule],
	templateUrl: './modal-delete-placement.component.html',
	styleUrls: ['./modal-delete-placement.component.scss']
})
export class ModalDeletePlacementComponent {
	@Input() idUser: number = 0;
	@Input() placementDate: string;
	@Input() username: string;
	@Input() fullName: string;
	@Input() documentNumber: string;
	@Input() sponsor: string;

	constructor(
		public instanceModal: NgbActiveModal,
		private builder: FormBuilder,
		private cdr: ChangeDetectorRef
	) {}

	ngOnInit(): void {}

	/* === Events === */
}
