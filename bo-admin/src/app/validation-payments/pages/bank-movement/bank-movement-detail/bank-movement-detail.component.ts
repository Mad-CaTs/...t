import { Component } from '@angular/core';

import { tableDataMockOne } from './mock';

import type { ITableBankMovementCharge } from '@interfaces/payment-validate.interface';

import { TableModel } from '@app/core/models/table.model';

import { TableService } from '@app/core/services/table.service';

/* === Modules === */
import { CommonModule } from '@angular/common';

import { TablesModule } from '@shared/components/tables/tables.module';
import { RouterLink } from '@angular/router';

@Component({
	selector: 'app-bank-movement-detail',
	standalone: true,
	imports: [CommonModule, TablesModule, RouterLink],
	templateUrl: './bank-movement-detail.component.html',
	styleUrls: ['./bank-movement-detail.component.scss']
})
export class BankMovementDetailComponent {
	readonly table: TableModel<ITableBankMovementCharge>;

	constructor(private tableService: TableService) {
		/* === Table builder === */
		this.table = this.tableService.generateTable<ITableBankMovementCharge>({
			headers: [
				'Fecha de Operación',
				'Fecha de Proceso',
				'N° de Operación',
				'Movimiento',
				'Descripción',
				'Canal',
				'Cargo',
				'Abono',
				'Estado'
			]
		});
		this.table.data = tableDataMockOne;
	}

	/* === Events === */
}
