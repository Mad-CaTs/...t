import { Component } from '@angular/core';

import { tableDataMock } from './mock';
import { monthNamesConstant } from '@constants/date.constant';

import { TableModel } from '@app/core/models/table.model';

import type { ITableChangeType } from '@interfaces/change-type.interface';

import { TableService } from '@app/core/services/table.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

/* === Modules === */
import { CommonModule } from '@angular/common';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { TablesModule } from '@shared/components/tables/tables.module';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalUpsertChangeTypeComponent } from '@app/change-type/components/modals';

@Component({
	selector: 'app-detailed',
	standalone: true,
	imports: [CommonModule, FormControlModule, TablesModule, ReactiveFormsModule],
	templateUrl: './detailed.component.html',
	styleUrls: ['./detailed.component.scss']
})
export class DetailedComponent {
	public readonly table: TableModel<ITableChangeType>;

	public form: FormGroup;
	public monthSelected: number = 0;
	public yearSelected: number = 2024;

	private monthNames = monthNamesConstant;

	constructor(
		private builder: FormBuilder,
		private tableService: TableService,
		private modalManager: NgbModal
	) {
		this.form = builder.group({
			country: ['', [Validators.required]]
		});

		this.table = this.tableService.generateTable<ITableChangeType>({
			headers: ['N°', 'Fecha', 'Soles', 'Dólares', 'Pesos Colombianos', 'Colones'],
			noCheckBoxes: true
		});
		this.table.data = tableDataMock;
	}

	/* === Events === */
	public onChangeSelectedMonth(newMonth: number) {
		if (newMonth > 11) {
			this.monthSelected = 0;
			this.yearSelected += 1;
		} else if (newMonth < 0) {
			this.monthSelected = 11;
			this.yearSelected -= 1;
		} else this.monthSelected = newMonth;
	}

	public onCreate() {
		const ref = this.modalManager.open(ModalUpsertChangeTypeComponent, { centered: true, size: 'md' });
		const modal = ref.componentInstance as ModalUpsertChangeTypeComponent;

		modal.id = 0;
	}

	public onEdit(id: number) {
		const ref = this.modalManager.open(ModalUpsertChangeTypeComponent, { centered: true, size: 'md' });
		const modal = ref.componentInstance as ModalUpsertChangeTypeComponent;

		modal.id = id;
	}

	/* === Getters === */
	get monthName() {
		return this.monthNames[this.monthSelected];
	}

	get country() {
		return this.form.get('country')?.value as string;
	}
}
