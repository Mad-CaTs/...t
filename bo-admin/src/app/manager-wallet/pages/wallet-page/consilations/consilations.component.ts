import { Component } from '@angular/core';

import { TableAdminWalletConsilationMock } from '../mock';

import { TableModel } from '@app/core/models/table.model';

import {
	ModalPayConsilationComponent,
	ModalWalletEditLimitDateComponent
} from '@app/manage-business/components/modals';

import type { ITableAdminWalletConsilation } from '@interfaces/manage-business.interface';

import { TableService } from '@app/core/services/table.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

/* === Modules === */
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TablesModule } from '@shared/components/tables/tables.module';
import { FormControlModule } from '@shared/components/form-control/form-control.module';

@Component({
	selector: 'app-consilations',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule, TablesModule, FormControlModule],
	templateUrl: './consilations.component.html',
	styleUrls: ['./consilations.component.scss']
})
export class ConsilationsComponent {
	public readonly form: FormGroup;
	public readonly table: TableModel<ITableAdminWalletConsilation>;

	constructor(private tableService: TableService, private builder: FormBuilder, private modal: NgbModal) {
		/* === Table builder === */
		this.table = this.tableService.generateTable<ITableAdminWalletConsilation>({
			headers: [
				'N°',
				'Fecha límite de pago',
				'Nombre y Apellidos',
				'Usuario',
				'Resumen del mes',
				'Monto',
				'Status',
				'Notificar',
				'Acciones'
			]
		});
		this.table.data = TableAdminWalletConsilationMock;
		/* === Form builder === */
		this.form = builder.group({
			search: ['', [Validators.required, Validators.minLength(3)]],
			searchAs: ['user', [Validators.required]]
		});
	}

	/* === Events === */
	onEditDateLimit() {
		this.modal.open(ModalWalletEditLimitDateComponent, { centered: true });
	}

	onViewDocument() {
		// this.modal.open(ModalViewDocumentComponent, { centered: true, size: 'lg' });
	}

	onPay() {
		this.modal.open(ModalPayConsilationComponent, { centered: true, size: 'md' });
	}
}
