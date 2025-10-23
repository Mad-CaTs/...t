import { Component } from '@angular/core';

import { tableDataMock } from './mock';

import type { ITableBankMovement } from '@interfaces/payment-validate.interface';

import { TableModel } from '@app/core/models/table.model';

import { TableService } from '@app/core/services/table.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

/* === Modules === */
import { CommonModule } from '@angular/common';
import { TablesModule } from '@shared/components/tables/tables.module';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { ModalUploadBankArchiveComponent } from '@app/validation-payments/components/modals';
import { RouterLink } from '@angular/router';

@Component({
	selector: 'app-bank-movement',
	standalone: true,
	imports: [CommonModule, TablesModule, InlineSVGModule, RouterLink],
	templateUrl: './bank-movement.component.html',
	styleUrls: ['./bank-movement.component.scss']
})
export class BankMovementComponent {
	readonly table: TableModel<ITableBankMovement>;

	constructor(private tableService: TableService, private modal: NgbModal) {
		/* === Table builder === */
		this.table = this.tableService.generateTable<ITableBankMovement>({
			headers: [
				'Nombre del Banco',
				'N° de Cuenta',
				'Tipo de Cuenta',
				'Fecha de carga',
				'N° de registros',
				'Registros Validados',
				'Pendientes',
				'Acciones'
			],
			noCheckBoxes: true
		});
		this.table.data = tableDataMock;
	}

	/* === Events === */
	onUpload() {
		this.modal.open(ModalUploadBankArchiveComponent, { centered: true, size: 'md' });
	}
}
