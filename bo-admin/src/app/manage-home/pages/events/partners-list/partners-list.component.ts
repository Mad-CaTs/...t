import { Component } from '@angular/core';

import { TableModel } from '@app/core/models/table.model';

import type { ITablePartnerList } from '@interfaces/manage-home.interface';

import { TableService } from '@app/core/services/table.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

/* === Modules === */
import { CommonModule } from '@angular/common';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { TablesModule } from '@shared/components/tables/tables.module';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { tableDataMock } from './mock';
import { ISelectOpt } from '@interfaces/form-control.interface';

@Component({
	selector: 'app-partners-list',
	standalone: true,
	imports: [CommonModule, FormControlModule, FormsModule, TablesModule],
	templateUrl: './partners-list.component.html',
	styleUrls: ['./partners-list.component.scss']
})
export class PartnersListComponent {
	public readonly table: TableModel<ITablePartnerList>;
	public form: FormGroup;
	public selectedRowId: number | null = null;
	public showDate: boolean = false;

	partnersOpt: ISelectOpt[] = [
		{ id: '1', text: 'Registrados' },
		{ id: '2', text: 'No Registrados' }
	];
	typesOpt: ISelectOpt[] = [
		{ id: '1', text: 'Soy socio' },
		{ id: '2', text: 'Redes sociales' },
		{ id: '3', text: 'Buscadores' },
		{ id: '4', text: 'Grupo de mensajería' },
		{ id: '5', text: 'Me invitó una persona' }
	];
	subtypeOpt: ISelectOpt[] = [
		{ id: '1', text: 'Facebook' },
		{ id: '2', text: 'Instagram' },
		{ id: '3', text: 'Twitter' },
		{ id: '4', text: 'Google' },
		{ id: '5', text: 'Yahoo' },
		{ id: '6', text: 'Bing' },
		{ id: '7', text: 'Whatsapp' },
		{ id: '8', text: 'Telegram' },
		{ id: '9', text: 'Soy socio' },
		{ id: '10', text: 'Me invitó una persona' }
	];
	countryOpt: ISelectOpt[] = [{ id: '1', text: 'Todos los países' }];

	constructor(
		private tableService: TableService,
		private formBuilder: FormBuilder,
		private modalManager: NgbModal
	) {
		/* === Table builder === */
		this.table = this.tableService.generateTable<ITablePartnerList>({
			headers: [
				'Fecha de registro',
				'Subtipo de evento',
				'Nombres ingresados',
				'IP detectada',
				'Email ingresado',
				'País detectado',
				'Ciudad detectada',
				'Tipo select',
				'Subtipo select',
				'Username',
				'Patrocinador'
			],
			headersMinWidth: [100, 100, 200, 100, 200, 150, 150, 150, 150, 120, 250],
			headersMaxWidth: [100, 100, 200, 100, 200, 150, 150, 150, 150, 120, 250],
			noCheckBoxes: true
		});
		this.table.data = tableDataMock;
		const today = new Date();
		this.form = formBuilder.group({
			search: [''],
			dateSwitch: [false],
			startDate: [today],
			endDate: [today],
			partners: [''],
			type: [''],
			subtype: [''],
			country: ['']
		});

		this.form.get('dateSwitch')?.valueChanges.subscribe((value) => {
			if(value) {
				this.showDate = true;
			} else {
				this.showDate = false;
			}
		});
	}

	/* === Events === */
	public onSearch() {}

	public onExport() {
	}
}
