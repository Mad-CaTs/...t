import { Component, Input } from '@angular/core';

import { tableDataMock } from './mock';

import { TableModel } from '@app/core/models/table.model';

import type { ITablePromotionalViewCodePackage } from '@interfaces/manage-business.interface';

import { TableService } from '@app/core/services/table.service';

/* === Modules === */
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { TablesModule } from '@shared/components/tables/tables.module';

@Component({
	selector: 'app-modal-promo-code-view-code',
	standalone: true,
	imports: [CommonModule, ModalComponent, TablesModule],
	templateUrl: './modal-promo-code-view-code.component.html',
	styleUrls: ['./modal-promo-code-view-code.component.scss']
})
export class ModalPromoCodeViewCodeComponent {
	@Input() id: number = 0;

	public readonly table: TableModel<ITablePromotionalViewCodePackage>;

	constructor(private instanceModal: NgbActiveModal, private tableService: TableService) {
		/* === Table builder === */
		this.table = this.tableService.generateTable<ITablePromotionalViewCodePackage>({
			headers: [
				'Código de promoción',
				'Fecha de creación',
				'Fecha de expiración',
				'Nombre familia de paquete',
				'Version'
			],
			noCheckBoxes: true
		});
		this.table.data = tableDataMock;
	}
}
