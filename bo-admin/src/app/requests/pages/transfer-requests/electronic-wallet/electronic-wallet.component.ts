import { Component } from '@angular/core';

import { tableDataMock } from './_mock';

import type { ITableRequestTransferElectronicWallet } from '@interfaces/requests.interface';

import { TableModel } from '@app/core/models/table.model';

import { TableService } from '@app/core/services/table.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

/* ===Modules  === */
import { CommonModule } from '@angular/common';
import { TablesModule } from '@shared/components/tables/tables.module';

@Component({
	selector: 'app-electronic-wallet',
	standalone: true,
	imports: [CommonModule, TablesModule],
	templateUrl: './electronic-wallet.component.html',
	styleUrls: ['./electronic-wallet.component.scss']
})
export class ElectronicWalletComponent {
	public readonly table: TableModel<ITableRequestTransferElectronicWallet>;

	constructor(private tableService: TableService, private modal: NgbModal) {
		/* === Table builder === */
		this.table = this.tableService.generateTable<ITableRequestTransferElectronicWallet>({
			headers: [
				'N°',
				'Fecha de solicitud',
				'Nombre y Apellido',
				'Destino',
				'Titular de la cuenta',
				'Usuario',
				'Link',
				'Tipo de moneda',
				'Monto solicitado',
				'Validar',
				'Visualizar'
			],
			noCheckBoxes: true
		});
		this.table.data = tableDataMock;
	}
}
