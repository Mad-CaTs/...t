import { Component } from '@angular/core';

import { TableModel } from '@app/core/models/table.model';

import type { ITableEventTypes } from '@interfaces/manage-home.interface';

import { TableService } from '@app/core/services/table.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

/* === Modules === */
import { CommonModule } from '@angular/common';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { TablesModule } from '@shared/components/tables/tables.module';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { tableDataMock } from './mock';
import { ModalAddEventTypeComponent } from '@app/manage-home/components/modals/modal-add-event-type/modal-add-event-type.component';
import { ModalEditEventTypeComponent } from '@app/manage-home/components/modals/modal-edit-event-type/modal-edit-event-type.component';

@Component({
	selector: 'app-event-types',
	standalone: true,
	imports: [CommonModule, FormControlModule, TablesModule, FormsModule, ReactiveFormsModule],
	templateUrl: './event-types.component.html',
	styleUrls: ['./event-types.component.scss']
})
export class EventTypesComponent {
	public readonly table: TableModel<ITableEventTypes>;
	selectedRowId: number | null = null;
	constructor(private tableService: TableService, private modalManager: NgbModal) {
		/* === Table builder === */
		this.table = this.tableService.generateTable<ITableEventTypes>({
			headers: ['Id Tipo', 'Descripción del evento', 'Status', 'Editar'],
			noCheckBoxes: true
		});
		this.table.data = tableDataMock;
	}

	/* === Events === */

	public onCreateEventType() {
		const ref = this.modalManager.open(ModalAddEventTypeComponent, { centered: true, size: 'md' });
		const modal = ref.componentInstance as ModalAddEventTypeComponent;
	}

	public onEditEventType() {
		const selectedItem = this.table.data.find(item => item.id === this.selectedRowId);
		const ref = this.modalManager.open(ModalEditEventTypeComponent, { centered: true, size: 'md' });
		const modal = ref.componentInstance as ModalEditEventTypeComponent;
	  
		if (selectedItem) {
		  modal.data = selectedItem;
		}
	  }
	  
}
