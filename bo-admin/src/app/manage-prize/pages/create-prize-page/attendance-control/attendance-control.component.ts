import { Component } from '@angular/core';

import { TableModel } from '@app/core/models/table.model';

import { TableService } from '@app/core/services/table.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

/* === Modules === */
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { TablesModule } from '@shared/components/tables/tables.module';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ITableAttendanceControl } from '@interfaces/create-prize.interface';
import { ISelectOpt } from '@interfaces/form-control.interface';
import { tableDataMock } from './mock';

@Component({
	selector: 'app-attendance-control',
	standalone: true,
	imports: [CommonModule, FormControlModule, TablesModule, FormsModule, ReactiveFormsModule],
	templateUrl: './attendance-control.component.html',
	styleUrls: ['./attendance-control.component.scss'],
	providers: [CurrencyPipe]
})
export class AttendanceControlComponent {
	public readonly table: TableModel<ITableAttendanceControl>;
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
		this.table = this.tableService.generateTable<ITableAttendanceControl>({
			headers: [
				'N°',
				'Status',
				'Invitado de quien',
				'Nombres y Apellidos',
				'Tipo de Bono',
				'Premio',
				'Estado',
				'Notificación'
			],
			headersMinWidth: [35, 140, 180, 200, 98, 200, 100, 150],
			headersMaxWidth: [35, 140, 180, 200, 98, 200, 100, 150],
			noCheckBoxes: true
		});
		this.table.data = tableDataMock;

		const today = new Date();
		this.form = builder.group({
			search: [''],
			searchAs: ['partner', [Validators.required]]
		});
	}

	/* === Events === */
	public onExport() {}

	public onGenerate() {}

	public onAttend() {}

	public onNotAttend() {}
}
