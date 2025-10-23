import { Component } from '@angular/core';

import { TableModel } from '@app/core/models/table.model';

import { TableService } from '@app/core/services/table.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

/* === Modules === */
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { TablesModule } from '@shared/components/tables/tables.module';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ITableBonusEstate } from '@interfaces/create-prize.interface';
import { tableDataMock } from './mock';
import { ISelectOpt } from '@interfaces/form-control.interface';
import { ModalDetailCourseComponent } from '@app/manage-prize/components/modals/modal-detail-course/modal-detail-course.component';
import { ModalDetailCarComponent, ModalPromformaCarComponent, ModalPromformaEstateComponent } from '@app/manage-prize/components/modals';
import { ModalDetailEstateComponent } from '@app/manage-prize/components/modals/modal-detail-estate/modal-detail-estate.component';

@Component({
	selector: 'app-bonus-estate',
	standalone: true,
	imports: [CommonModule, FormControlModule, TablesModule, FormsModule, ReactiveFormsModule],
	templateUrl: './bonus-estate.component.html',
	styleUrls: ['./bonus-estate.component.scss'],
	providers: [CurrencyPipe]
})
export class BonusEstateComponent {
	public readonly table: TableModel<ITableBonusEstate>;
	public form: FormGroup;

	selectedRowId: number | null = null;

	rangeOpt: ISelectOpt[] = [
		{ id: '1', text: 'Plata' },
		{ id: '2', text: 'Oro' },
		{ id: '3', text: 'Diamante' },
		{ id: '4', text: 'Zafiro' }
	];

	constructor(
		private tableService: TableService,
		private builder: FormBuilder,
		private modalManager: NgbModal
	) {
		/* === Table builder === */
		this.table = this.tableService.generateTable<ITableBonusEstate>({
			headers: [
				'N°',
				'Nombres y Apellidos',
				'Fecha de Inicio',
				'Fecha Límite',
				'Rango',
				'Ciclos de Calificación',
				'N° de recalificación',
				'Precio del Inmueble',
				'Proforma',
				'Validar',
				'Editar'
			],
			headersMinWidth: [35, 160, 100, 100, 90, 100, 100, 100, 110, 120, 50],
			headersMaxWidth: [35, 160, 100, 100, 90, 100, 100, 100, 110, 120, 50],
			noCheckBoxes: true
		});
		this.table.data = tableDataMock;

		const today = new Date();
		this.form = builder.group({
			startDate: [today],
			limitDate: [today],
			range: ['']
		});
	}

	/* === Events === */
	public onExport() {}

	public onGenerate() {}

	public onViewProforma() {
		const selectedItem = this.table.data.find((item) => item.id === this.selectedRowId);
		const ref = this.modalManager.open(ModalPromformaEstateComponent, { centered: true, size: 'md' });
		const modal = ref.componentInstance as ModalPromformaEstateComponent;

		if (selectedItem) {
			modal.data = selectedItem;
		}
	}

	public onView() {
		const selectedItem = this.table.data.find((item) => item.id === this.selectedRowId);
		const ref = this.modalManager.open(ModalDetailEstateComponent, { centered: true, size: 'md' });
		const modal = ref.componentInstance as ModalDetailEstateComponent;

		if (selectedItem) {
			modal.data = selectedItem;
		}
	}

	public onEditEstate() {
		// const selectedItem = this.table.data.find((item) => item.id === this.selectedRowId);
		// const ref = this.modalManager.open(ModalEditLandingComponent, { centered: true, size: 'md' });
		// const modal = ref.componentInstance as ModalEditLandingComponent;
		// if (selectedItem) {
		// 	modal.data = selectedItem;
		// }
	}
}
