import { Component, OnInit } from '@angular/core';

import { tableDataMock } from './mock';

import { TableModel } from '@app/core/models/table.model';

import type { ITablePromotionalCodePackage } from '@interfaces/manage-business.interface';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TableService } from '@app/core/services/table.service';

/* === Modules === */
import { CommonModule } from '@angular/common';
import { TablesModule } from '@shared/components/tables/tables.module';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
	ModalPromoCodeAddComponent,
	ModalPromoCodeViewCodeComponent
} from '@app/manage-business/components/modals';

@Component({
	selector: 'app-promotinal-codes-page',
	templateUrl: './promotinal-codes-page.component.html',
	styleUrls: ['./promotinal-codes-page.component.scss'],
	standalone: true,
	imports: [CommonModule, TablesModule, ReactiveFormsModule, FormControlModule]
})
export class PromotinalCodesPageComponent implements OnInit {
	public readonly table: TableModel<ITablePromotionalCodePackage>;

	public form: FormGroup;

	constructor(
		private formBuilder: FormBuilder,
		private modal: NgbModal,
		private tableService: TableService
	) {
		this.form = formBuilder.group({
			search: ['']
		});

		/* === Table builder === */
		this.table = this.tableService.generateTable<ITablePromotionalCodePackage>({
			headers: ['Usuario', 'Nombre', 'DNI', 'Email', 'Celular', 'Rango Compuesto', 'Ver código'],
			headersArrows: [true, true, true, true, true, true],
			noCheckBoxes: true
		});
		this.table.data = tableDataMock;
	}

	ngOnInit(): void {}

	/* === Events === */
	public onSearch() {}

	public onAdd() {
		this.modal.open(ModalPromoCodeAddComponent, { centered: true, size: 'md' });
	}

	public onViewCode(id: number) {
		const ref = this.modal.open(ModalPromoCodeViewCodeComponent, { centered: true, size: 'xl' });
		const modal = ref.componentInstance as ModalPromoCodeViewCodeComponent;

		modal.id = id;
	}
}
