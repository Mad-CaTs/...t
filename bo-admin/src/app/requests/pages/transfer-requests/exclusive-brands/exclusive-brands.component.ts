import { Component } from '@angular/core';

import type { ITableRequestTransferElectronicWallet } from '@interfaces/requests.interface';

import { TableModel } from '@app/core/models/table.model';

import { TableService } from '@app/core/services/table.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

/* ===Modules  === */
import { CommonModule } from '@angular/common';
import { TablesModule } from '@shared/components/tables/tables.module';

@Component({
	selector: 'app-exclusive-brands',
	standalone: true,
	imports: [CommonModule, TablesModule],
	templateUrl: './exclusive-brands.component.html',
	styleUrls: ['./exclusive-brands.component.scss']
})
export class ExclusiveBrandsComponent {
	public readonly table: TableModel<ITableRequestTransferElectronicWallet>;

	constructor(private tableService: TableService, private modal: NgbModal) {
		/* === Table builder === */
		this.table = this.tableService.generateTable<ITableRequestTransferElectronicWallet>({
			headers: [
				'N°',
				'Nombre y Apellido',
				'Titular de la cuenta',
				'Pais de operaciones',
				'Nombre del banco',
				'Código de SWIFT',
				'Código IBAN',
				'Número de cuenta',
				'Código CCI',
				'Tipo de moneda',
				'Monto solicitado'
			]
		});
		this.table.data = [];
	}
}
