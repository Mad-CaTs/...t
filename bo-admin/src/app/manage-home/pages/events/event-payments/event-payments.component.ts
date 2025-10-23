import { Component } from '@angular/core';

import { tableDataMock } from './mock';

import { TableModel } from '@app/core/models/table.model';

import { ModalRejectPaymentComponent } from '@app/validation-payments/components/modals';
import { ModalAcceptPaymentComponent } from '@shared/components/modal-accept-payment/modal-accept-payment.component';

import type { ITableEventPayment } from '@interfaces/manage-home.interface';

import { TableService } from '@app/core/services/table.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

/* === Modules === */
import { CommonModule } from '@angular/common';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { TablesModule } from '@shared/components/tables/tables.module';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalConfirmationComponent } from '@shared/components/modal-confirmation/modal-confirmation.component';

@Component({
	selector: 'app-event-payments',
	standalone: true,
	imports: [CommonModule, FormControlModule, TablesModule, ReactiveFormsModule],
	templateUrl: './event-payments.component.html',
	styleUrls: ['./event-payments.component.scss']
})
export class EventPaymentsComponent {
	public readonly table: TableModel<ITableEventPayment>;

	public form: FormGroup;

	constructor(
		private tableService: TableService,
		private builder: FormBuilder,
		private modalManager: NgbModal
	) {
		/* === Table builder === */
		this.table = this.tableService.generateTable<ITableEventPayment>({
			headers: [
				'Descripción del evento',
				'Tipo',
				'N° de entradas',
				'Paquetes',
				'Usuario',
				'Patrocinador',
				'Monto',
				'Código promocional',
				'Fecha de pago',
				'Estado',
				'Vaucher',
				'Validación'
			]
		});
		this.table.data = tableDataMock;

		this.form = builder.group({
			search: [''],
			searchAs: ['code', [Validators.required]]
		});
	}

	/* === Events === */
	public onUploadFile() {}

	public onSearch() {}

	public onPayAction(action: 'accept' | 'reject', id: number) {
		if (action === 'reject') {
			this.modalManager.open(ModalRejectPaymentComponent, { centered: true, size: 'md' });
		} else {
			const ref = this.modalManager.open(ModalAcceptPaymentComponent, { centered: true, size: 'md' });
			const modal = ref.componentInstance as ModalAcceptPaymentComponent;

			modal.voucherUrl = 'https://staticv1.inclub.world/27%20de%20enero%20vertical.jpg';
			modal.title = 'Verificación';
			modal.onConfirm.subscribe(() => {
				ref.close();
				const refC = this.modalManager.open(ModalConfirmationComponent, {
					centered: true,
					size: 'md'
				});
				const modal = refC.componentInstance as ModalConfirmationComponent;

				modal.title = 'Pago verificado';
				modal.icon = 'bi bi-check-circle-fill text-success fa-2x';
				modal.body = 'Se concretó la verificación del pago.';
			});
		}
	}
}
