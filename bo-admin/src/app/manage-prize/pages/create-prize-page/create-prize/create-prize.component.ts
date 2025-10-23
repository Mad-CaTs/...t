import { Component, TemplateRef, ViewChild } from '@angular/core';

import { TableModel } from '@app/core/models/table.model';

import { TableService } from '@app/core/services/table.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

/* === Modules === */
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { TablesModule } from '@shared/components/tables/tables.module';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { tableDataMock } from './mock';
import { ModalAddPrizeComponent } from '@app/manage-prize/components/modals';
import { ModalEditPrizeComponent } from '@app/manage-prize/components/modals/modal-edit-prize/modal-edit-prize.component';
import { ITableCreatePrize } from '@interfaces/create-prize.interface';

@Component({
	selector: 'app-create-prize',
	standalone: true,
	imports: [CommonModule, FormControlModule, TablesModule, FormsModule, ReactiveFormsModule],
	templateUrl: './create-prize.component.html',
	styleUrls: ['./create-prize.component.scss'],
	providers: [CurrencyPipe]
})
export class CreatePrizeComponent {
	public readonly table: TableModel<ITableCreatePrize>;
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
		this.table = this.tableService.generateTable<ITableCreatePrize>({
			headers: [
				'N°',
				'Rango',
				'Fecha de inicio',
				'Fecha de fin',
				'Destino',
				'Valor Bono',
				'Link del grupo',
				'Flyer',
				'Estado',
				'Editar'
			],
			headersMinWidth: [35, 100, 100, 100, 200, 120, 200, 110, 88, 50],
			headersMaxWidth: [35, 100, 100, 100, 200, 120, 200, 110, 88, 50],
			noCheckBoxes: true
		});
		this.table.data = tableDataMock;

		this.form = builder.group({
			search: ['']
		});
	}

	/* === Getters Range === */
	getRangeDisplay(range: { name: string }): string {
		return range.name;
	}

	public openImageModal(imageUrl: string, imageName: string): void {
		this.selectedImageUrl = imageUrl;
		this.selectedImageName = imageName;
		this.modalManager.open(this.imageModalRef, { centered: true, size: 'md' });
	}

	/* === Events === */
	public onSearch() {}

	public onCreatePrize() {
		const ref = this.modalManager.open(ModalAddPrizeComponent, { centered: true, size: 'md' });
		const modal = ref.componentInstance as ModalAddPrizeComponent;
	}

	public onEditPrize() {
		const selectedItem = this.table.data.find((item) => item.id === this.selectedRowId);
		const ref = this.modalManager.open(ModalEditPrizeComponent, { centered: true, size: 'md' });
		const modal = ref.componentInstance as ModalEditPrizeComponent;

		if (selectedItem) {
			modal.setData(selectedItem);
		}
	}
}
