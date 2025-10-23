import { Component } from '@angular/core';

import { tableDataMock } from './mock';

import { TableModel } from '@app/core/models/table.model';

import type { ITableWalletPaymentBoxCronogram } from '@interfaces/payment-validate.interface';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TableService } from '@app/core/services/table.service';

/* === Components === */
import { CommonModule } from '@angular/common';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { TablesModule } from '@shared/components/tables/tables.module';

@Component({
	selector: 'app-modal-payment-cronogram',
	standalone: true,
	imports: [CommonModule, ModalComponent, TablesModule],
	templateUrl: './modal-payment-cronogram.component.html',
	styleUrls: ['./modal-payment-cronogram.component.scss']
})
export class ModalPaymentCronogramComponent {
	public readonly table: TableModel<ITableWalletPaymentBoxCronogram>;

	constructor(private tableService: TableService, public instanceModal: NgbActiveModal) {
		this.table = this.tableService.generateTable<ITableWalletPaymentBoxCronogram>({
			headers: [
				'Descripción',
				'Fecha',
				'Capital',
				'Amortización',
				'Interés',
				'Cuota',
				'Puntaje',
				'Estado',
				'Cod. Operación',
				'Cod. Operación de empresa',
				'Medio de pago',
				'Moneda',
				'Subtotal',
				'Comisión',
				'Mora',
				'Total'
			],
			noCheckBoxes: true,
			headersMinWidth: [120, 100, 100, 100, 100, 100, 100, 100, 200, 200, 200, 100, 100, 100, 100, 100]
		});
		this.table.data = tableDataMock;
	}
}
