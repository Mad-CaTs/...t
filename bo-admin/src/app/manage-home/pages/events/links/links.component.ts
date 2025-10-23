import { Component } from '@angular/core';

import { TableModel } from '@app/core/models/table.model';

import type { ITableLink } from '@interfaces/manage-home.interface';

import { TableService } from '@app/core/services/table.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

/* === Modules === */
import { CommonModule } from '@angular/common';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { TablesModule } from '@shared/components/tables/tables.module';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalAddEventTypeComponent } from '@app/manage-home/components/modals/modal-add-event-type/modal-add-event-type.component';
import { ModalEditEventTypeComponent } from '@app/manage-home/components/modals/modal-edit-event-type/modal-edit-event-type.component';
import { tableDataMock } from './mock';
import { ModalAddLinkComponent } from '@app/manage-home/components/modals/modal-add-link/modal-add-link.component';
import { ModalEditLinkComponent } from '@app/manage-home/components/modals/modal-edit-link/modal-edit-link.component';

@Component({
	selector: 'app-links',
	standalone: true,
	imports: [CommonModule, FormControlModule, TablesModule, FormsModule, ReactiveFormsModule],
	templateUrl: './links.component.html',
	styleUrls: ['./links.component.scss']
})
export class LinksComponent {
	public readonly table: TableModel<ITableLink>;
	public form: FormGroup;
	selectedRowId: number | null = null;
	constructor(
		private tableService: TableService,
		private builder: FormBuilder,
		private modalManager: NgbModal
	) {
		/* === Table builder === */
		this.table = this.tableService.generateTable<ITableLink>({
			headers: ['Link', 'Estado', 'Editar'],
			headersMinWidth: [700, 250, 130],
			headersMaxWidth: [700, 250, 130],
			noCheckBoxes: true
		});
		this.table.data = tableDataMock;

		this.form = builder.group({
			search: ['']
		});
	}

	/* === Events === */
	public onSearch() {}

	public onCreateLink() {
		const ref = this.modalManager.open(ModalAddLinkComponent, { centered: true, size: 'md' });
		const modal = ref.componentInstance as ModalAddLinkComponent;
	}

	public onEditLink() {
		const selectedItem = this.table.data.find((item) => item.id === this.selectedRowId);
		const ref = this.modalManager.open(ModalEditLinkComponent, { centered: true, size: 'md' });
		const modal = ref.componentInstance as ModalEditLinkComponent;

		if (selectedItem) {
			modal.data = selectedItem;
		}
	}
}
