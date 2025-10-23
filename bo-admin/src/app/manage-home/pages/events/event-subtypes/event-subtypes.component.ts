import { Component } from '@angular/core';

import { TableModel } from '@app/core/models/table.model';

import type { ITableEventSubtypes } from '@interfaces/manage-home.interface';

import { TableService } from '@app/core/services/table.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

/* === Modules === */
import { CommonModule } from '@angular/common';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { TablesModule } from '@shared/components/tables/tables.module';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { tableDataMock } from './mock';
import { ModalAddEventSubtypeComponent } from '@app/manage-home/components/modals/modal-add-event-subtype/modal-add-event-subtype.component';
import { ModalEditEventSubtypeComponent } from '@app/manage-home/components/modals/modal-edit-event-subtype/modal-edit-event-subtype.component';

@Component({
	selector: 'app-event-subtypes',
	standalone: true,
	imports: [CommonModule, FormControlModule, TablesModule, FormsModule, ReactiveFormsModule],
	templateUrl: './event-subtypes.component.html',
	styleUrls: ['./event-subtypes.component.scss']
})
export class EventSubtypesComponent {
	public readonly table: TableModel<ITableEventSubtypes>;
	public form: FormGroup;

	selectedRowId: number | null = null;

	constructor(
		private tableService: TableService,
		private builder: FormBuilder,
		private modalManager: NgbModal
	) {
		/* === Table builder === */
		this.table = this.tableService.generateTable<ITableEventSubtypes>({
			headers: [
				'Nombre del subtipo',
				'Tipo de evento',
				'Landing',
				'Link del landing',
				'Género',
				'Rango',
				'Editar'
			],
			headersMinWidth: [180, 120, 150, 300, 110, 180, 60],
			headersMaxWidth: [180, 120, 150, 300, 110, 180, 60],
			noCheckBoxes: true
		});
		this.table.data = tableDataMock;

		this.form = builder.group({
			search: ['']
		});
	}

	/* === Getters Gender and Range === */
	getGenderDisplay(gender: string): string {
		return gender === 'F' ? 'Femenino' : gender === 'M' ? 'Masculino' : '-';
	}

	getRangeDisplay(range: { name: string }[]): string {
		return range.length === 0 ? '-' : range.map((r) => r.name).join(', ');
	}

	/* === Events === */
	public onSearch() {}

	public onCreateEventSubtype() {
		const ref = this.modalManager.open(ModalAddEventSubtypeComponent, { centered: true, size: 'md' });
		const modal = ref.componentInstance as ModalAddEventSubtypeComponent;
	}

	public onEditEventSubtype() {
		const selectedItem = this.table.data.find((item) => item.id === this.selectedRowId);
		const ref = this.modalManager.open(ModalEditEventSubtypeComponent, { centered: true, size: 'md' });
		const modal = ref.componentInstance as ModalEditEventSubtypeComponent;

		if (selectedItem) {
			modal.setData(selectedItem);
		}
	}
}
