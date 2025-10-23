import { Component, TemplateRef, ViewChild } from '@angular/core';

import { TableModel } from '@app/core/models/table.model';

import { ModalAddTravelComponent, ModalEditLandingComponent } from '@app/manage-home/components/modals';

import type { ITableTravel } from '@interfaces/manage-home.interface';

import { TableService } from '@app/core/services/table.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

/* === Modules === */
import { CommonModule } from '@angular/common';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { TablesModule } from '@shared/components/tables/tables.module';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { tableDataMock } from './mock';
import { ModalEditTravelComponent } from '@app/manage-home/components/modals/modal-edit-travel/modal-edit-travel.component';

@Component({
	selector: 'app-travels',
	standalone: true,
	imports: [CommonModule, FormControlModule, FormsModule, TablesModule],
	templateUrl: './travels.component.html',
	styleUrls: ['./travels.component.scss']
})
export class TravelsComponent {
	public readonly table: TableModel<ITableTravel>;
	public form: FormGroup;
	selectedRowId: number | null = null;
	selectedImageUrl: string = '';
	selectedImageName: string;

	@ViewChild('imageModal') imageModalRef!: TemplateRef<any>;
	constructor(
		private tableService: TableService,
		private builder: FormBuilder,
		private modalManager: NgbModal
	) {
		/* === Table builder === */
		this.table = this.tableService.generateTable<ITableTravel>({
			headers: ['Destino', 'Fecha', 'Estado', 'Flyer', 'Editar'],
			headersMinWidth: [250, 200, 200, 350, 100],
			headersMaxWidth: [250, 200, 200, 350, 100],
			noCheckBoxes: true
		});
		this.table.data = tableDataMock;

		this.form = builder.group({
			search: ['']
		});
	}

	/* === Events === */
	public onSearch() {}

	public onCreateTravel() {
		const ref = this.modalManager.open(ModalAddTravelComponent, { centered: true, size: 'md' });
		const modal = ref.componentInstance as ModalAddTravelComponent;
	}

	public onEditTravel() {
		const selectedItem = this.table.data.find((item) => item.id === this.selectedRowId);
		const ref = this.modalManager.open(ModalEditTravelComponent, { centered: true, size: 'md' });
		const modal = ref.componentInstance as ModalEditTravelComponent;

		if (selectedItem) {
			modal.data = selectedItem;
		}
	}

	public openImageModal(imageUrl: string, destiny: string): void {
		this.selectedImageUrl = imageUrl;
		this.selectedImageName = destiny;
		this.modalManager.open(this.imageModalRef, { centered: true, size: 'md' });
	}
}
