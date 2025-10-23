import { Component, Input, OnInit } from '@angular/core';

import { operationOptMock } from './mock';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '@app/core/services/toast.service';

/* === Modules === */
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { ModalConfirmationComponent } from '@shared/components/modal-confirmation/modal-confirmation.component';
import { WalletService } from '@app/manage-business/services/wallet-service.service';
import { finalize } from 'rxjs/operators';

@Component({
	selector: 'app-modal-wallet-operation',
	templateUrl: './modal-wallet-operation.component.html',
	styleUrls: ['./modal-wallet-operation.component.scss'],
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule, FormControlModule, ModalComponent]
})
export class ModalWalletOperationComponent implements OnInit {
	@Input() id: number = 1;

	public form: FormGroup;
	public operationOpt = operationOptMock;
	isLoading: boolean = false;
	descriptionLabel = 'Descripción (Opcional)';

	constructor(
		private modal: NgbModal, public instanceModal: NgbActiveModal,
		public formBuilder: FormBuilder, public toastService: ToastService,
		private walletService: WalletService
	) {
		this.form = formBuilder.group({
			opType: ['', [Validators.required]],
			amount: [0, [Validators.required, Validators.min(1)]],
			description: ['', [Validators.required]]
		});
	}

	ngOnInit(): void {
		const opTypeControl = this.form.get('opType') as AbstractControl;
		opTypeControl.valueChanges.subscribe((op) => {
			this.updateFormValidators(op);
		});
	}

	/* === Events === */
	public onSubmit() {
		this.isLoading = true;
		const data = {
			operationType: Number(this.form.get('opType')?.value),
			idUser: this.id,
			idUserSecondary: null,
			amount: Number(this.form.get('amount')?.value),
			note: this.form.get('description')?.value
		};
		this.walletService.getPercentOverdueTypes(data).subscribe({
			next: () => {
				this.instanceModal.close();
				const ref = this.modal.open(ModalConfirmationComponent, { centered: true });
				const modal = ref.componentInstance as ModalConfirmationComponent;
				modal.icon = 'bi bi-check-circle text-success';
				modal.title = 'Registro exitoso';
				modal.body = 'La operación ha sido registrada con éxito.';
			},
			error: () => {
				this.instanceModal.close();
				const ref = this.modal.open(ModalConfirmationComponent, { centered: true, size: 'md' });
				const modal = ref.componentInstance as ModalConfirmationComponent;

				modal.title = 'Fallo en el registro';
				modal.icon = 'bi bi-info-circle custom-color fa-2x';
				modal.body = 'La solicitud de transferencia ha fallado.';
			},
			complete: () => {
				this.isLoading = false;
			}
		});
	}

	/* === Helpers === */
	private updateFormValidators(op: string) {
		const descriptionControl = this.form.get('description') as AbstractControl;
		let validators = [Validators.required, Validators.minLength(4)];

		if (op !== '3') {
			this.descriptionLabel = 'Descripción (Opcional)';
			descriptionControl.removeValidators(validators);
			descriptionControl.updateValueAndValidity();
			return;
		}

		this.descriptionLabel = 'Descripción';
		descriptionControl.setValidators(validators);
		descriptionControl.updateValueAndValidity();
	}

	/* === Getters === */
	get user() {
		const partner = [{ id: 1 }].find((p) => p.id === this.id);

		return partner;
	}
}
