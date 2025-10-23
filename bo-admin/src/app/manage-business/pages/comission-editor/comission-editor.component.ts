import { Component } from '@angular/core';

import { tableDataMock } from './_mock';

import type { ITableComissionEditor } from '@interfaces/manage-business.interface';

import { TableModel } from '@app/core/models/table.model';

import { TableService } from '@app/core/services/table.service';

/* === Modules === */
import { CommonModule } from '@angular/common';
import { TablesModule } from '@shared/components/tables/tables.module';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormControlModule } from '@shared/components/form-control/form-control.module';

@Component({
	selector: 'app-comission-editor',
	standalone: true,
	imports: [CommonModule, TablesModule, ReactiveFormsModule, InlineSVGModule, FormControlModule],
	templateUrl: './comission-editor.component.html',
	styleUrls: ['./comission-editor.component.scss']
})
export class ComissionEditorComponent {
	readonly form: FormGroup;
	readonly table: TableModel<ITableComissionEditor>;

	constructor(private tableService: TableService, private builder: FormBuilder) {
		/* === Table builder === */
		this.table = this.tableService.generateTable<ITableComissionEditor>({
			headers: [
				'Patrocinador',
				'Usuario socio',
				'Socio',
				'Nivel',
				'Tipo de bono',
				'Membresia',
				'Porcentajes',
				'Puntos',
				'Monto',
				'Transacción'
			],
			headersArrows: [true, true, true, true, true, true, true, true, true],
			noCheckBoxes: true
		});
		this.table.data = tableDataMock;
		/* === Form builder === */
		this.form = builder.group({
			search: ['', [Validators.required, Validators.minLength(3)]],
			searchAs: ['user', [Validators.required]]
		});
	}

	/* === Events === */
}
