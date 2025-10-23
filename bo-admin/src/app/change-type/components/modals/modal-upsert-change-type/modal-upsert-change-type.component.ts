import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

/* === Modules === */
import { CommonModule } from '@angular/common';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { ModalConfirmationComponent } from '@shared/components/modal-confirmation/modal-confirmation.component';
import { ChangeTypeService } from '@app/core/services/api/change-type/change-type.service';
import { ITypeChangeDto } from '@interfaces/api';
import { IResponseData } from '@interfaces/globals.interface';

@Component({
	selector: 'app-modal-upsert-change-type',
	standalone: true,
	imports: [CommonModule, ModalComponent, FormControlModule, ReactiveFormsModule],
	templateUrl: './modal-upsert-change-type.component.html',
	styleUrls: ['./modal-upsert-change-type.component.scss']
})
export class ModalUpsertChangeTypeComponent implements OnInit {
	@Input() id: number = 0;

	public form: FormGroup;
	public loading : boolean;
	public result: any[] = [];
	constructor(
		public instanceModal: NgbActiveModal,
		private builder: FormBuilder,
		private modalManager: NgbModal,
		private ChangeTypeService: ChangeTypeService,
		private cdr : ChangeDetectorRef
	) {
		this.form = builder.group({
			country: ['1', [Validators.required]],
			sale: ['', [Validators.required, Validators.min(0.00001)]],
			buy: ['', [Validators.required, Validators.min(0.00001)]],
			date: [new Date().toISOString(), [Validators.required]]
		});
	}

	ngOnInit(): void {
		if (this.id) {
			this.form.get('country')?.disable();
			this.form.get('date')?.disable();
		}
	}

	/* === Events === */
	public onSubmit() {
		this.instanceModal.close();
		const ref = this.modalManager.open(ModalConfirmationComponent, { centered: true, size: 'md' });
		const modal = ref.componentInstance as ModalConfirmationComponent;
		this.loading = true;
		const body : ITypeChangeDto= {
			buys : +this.form.value.buy,
			sale : +this.form.value.sale,
		}
		console.log(body);
		this.ChangeTypeService.fetchChangeCreate(body).subscribe({
			next: (result) => {
				this.result = result.data as IResponseData<any>[];
				if(result.data){
					modal.body = 'Tipo de Cambio Actualizado.';
					modal.title = 'Éxito';
					modal.icon = 'bi bi-check-circle-fill text-info fa-2x';
				}else{
					modal.body = 'Tipo de Cambio ya existe para el dia de hoy.';
					modal.title = 'Advertencia';
					modal.icon = 'bi bi-x-circle-fill text-danger fa-2x';
				}				
				this.loading = false;
				this.cdr.detectChanges();
			}
		});	
		
		modal.buttons = [{ className: 'btn btn-secondary', text: 'Volver', onClick: () => ref.close() }];
	}

	/* === Getters === */
	get title() {
		return this.id ? 'Editar' : 'Nuevo Tipo de Cambio';
	}
}
