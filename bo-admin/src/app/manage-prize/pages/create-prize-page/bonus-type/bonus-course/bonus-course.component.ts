import { Component } from '@angular/core';

import { TableModel } from '@app/core/models/table.model';

import { TableService } from '@app/core/services/table.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

/* === Modules === */
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { TablesModule } from '@shared/components/tables/tables.module';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ITableBonusCourse } from '@interfaces/create-prize.interface';
import { tableDataMock } from './mock';
import { ISelectOpt } from '@interfaces/form-control.interface';
import { ModalDetailCourseComponent } from '@app/manage-prize/components/modals/modal-detail-course/modal-detail-course.component';

@Component({
	selector: 'app-bonus-course',
	standalone: true,
	imports: [CommonModule, FormControlModule, TablesModule, FormsModule, ReactiveFormsModule],
	templateUrl: './bonus-course.component.html',
	styleUrls: ['./bonus-course.component.scss'],
	providers: [CurrencyPipe]
})
export class BonusCourseComponent {
	public readonly table: TableModel<ITableBonusCourse>;
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
		this.table = this.tableService.generateTable<ITableBonusCourse>({
			headers: [
				'N°',
				'Nombres y Apellidos',
				'Fecha de Inicio',
				'Fecha Límite',
				'Rango',
				'Ciclos de Calificación',
				'N° de recalificación',
				'Validar',
				'Editar'
			],
			headersMinWidth: [50, 240, 120, 120, 120, 120, 120, 120, 50],
			headersMaxWidth: [50, 240, 120, 120, 120, 120, 120, 120, 50],
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

	public onView() {
		const selectedItem = this.table.data.find((item) => item.id === this.selectedRowId);
		const ref = this.modalManager.open(ModalDetailCourseComponent, { centered: true, size: 'md' });
		const modal = ref.componentInstance as ModalDetailCourseComponent;

		if (selectedItem) {
			modal.data = selectedItem;
		}
	}

	public onEditCourse() {
		// const selectedItem = this.table.data.find((item) => item.id === this.selectedRowId);
		// const ref = this.modalManager.open(ModalEditLandingComponent, { centered: true, size: 'md' });
		// const modal = ref.componentInstance as ModalEditLandingComponent;
		// if (selectedItem) {
		// 	modal.data = selectedItem;
		// }
	}
}
