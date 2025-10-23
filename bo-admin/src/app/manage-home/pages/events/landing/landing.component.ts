import { Component, TemplateRef, ViewChild } from '@angular/core';

import { TableModel } from '@app/core/models/table.model';

import { ModalEditLandingComponent } from '@app/manage-home/components/modals';

import type { ITableLanding } from '@interfaces/manage-home.interface';

import { TableService } from '@app/core/services/table.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

/* === Modules === */
import { CommonModule } from '@angular/common';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { TablesModule } from '@shared/components/tables/tables.module';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { tableDataMock } from './mock';
import { ModalAddLandingComponent } from '@app/manage-home/components/modals/modal-add-landing/modal-add-landing.component';

@Component({
	selector: 'app-landing',
	standalone: true,
	imports: [CommonModule, FormControlModule, FormsModule, TablesModule],
	templateUrl: './landing.component.html',
	styleUrls: ['./landing.component.scss']
})
export class LandingComponent {
	public readonly table: TableModel<ITableLanding>;
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
		this.table = this.tableService.generateTable<ITableLanding>({
			headers: ['Nombre', 'Link o URL', 'Imagen', 'Editar'],
			headersMinWidth: [320, 300, 180, 100],
			headersMaxWidth: [320, 500, 180, 100],
			noCheckBoxes: true
		});
		this.table.data = tableDataMock;

		this.form = builder.group({
			search: ['']
		});
	}

	/* === Events === */
	public onSearch() {}

	public onCreateLanding() {
		const ref = this.modalManager.open(ModalAddLandingComponent, { centered: true, size: 'md' });
		const modal = ref.componentInstance as ModalAddLandingComponent;
	}

	public onEditLanding() {
		const selectedItem = this.table.data.find((item) => item.id === this.selectedRowId);
		const ref = this.modalManager.open(ModalEditLandingComponent, { centered: true, size: 'md' });
		const modal = ref.componentInstance as ModalEditLandingComponent;

		if (selectedItem) {
			modal.data = selectedItem;
		}
	}

	public openImageModal(imageUrl: string, imageName: string): void {
		this.selectedImageUrl = imageUrl;
		this.selectedImageName = imageName;
		this.modalManager.open(this.imageModalRef, { centered: true, size: 'md' });
	}
}
