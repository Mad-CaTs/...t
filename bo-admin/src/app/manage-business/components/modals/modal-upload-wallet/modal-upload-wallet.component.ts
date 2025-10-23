import { Component } from '@angular/core';

import type { ITableAdminWalletUpload } from '@interfaces/manage-business.interface';

import { TableModel } from '@app/core/models/table.model';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TableService } from '@app/core/services/table.service';

/* === Modules === */
import { CommonModule } from '@angular/common';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TablesModule } from '@shared/components/tables/tables.module';

@Component({
	selector: 'app-modal-upload-wallet',
	standalone: true,
	imports: [CommonModule, ModalComponent, FormControlModule, ReactiveFormsModule, TablesModule],
	templateUrl: './modal-upload-wallet.component.html',
	styleUrls: ['./modal-upload-wallet.component.scss']
})
export class ModalUploadWalletComponent {
	public readonly table: TableModel<ITableAdminWalletUpload>;

	public form: FormGroup;

	constructor(
		public instanceModal: NgbActiveModal,
		private builder: FormBuilder,
		private tableService: TableService
	) {
		/* === Table builder === */
		this.table = this.tableService.generateTable<ITableAdminWalletUpload>({
			headers: ['N°', 'Usuario origen', 'Usuario destino', 'Monto ($)', 'Fecha inicial'],
			noCheckBoxes: true
		});
		this.table.data = [];
		/* === Form === */
		this.form = builder.group({
			opType: ['', [Validators.required]],
			file: [null, [Validators.required]]
		});
	}
}
