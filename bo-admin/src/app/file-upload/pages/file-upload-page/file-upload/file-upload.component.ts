import { Component } from '@angular/core';

/* ==== Modules === */
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { TablesModule } from '@shared/components/tables/tables.module';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TableModel } from '@app/core/models/table.model';
import { TableService } from '@app/core/services/table.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ISelectOpt } from '@interfaces/form-control.interface';
import { fileUploadMockData } from './mock';
import { SharedModule } from '@shared/shared.module';

@Component({
	selector: 'app-file-upload',
	standalone: true,
	imports: [CommonModule, FormControlModule, TablesModule, ReactiveFormsModule, FormsModule, SharedModule],
	templateUrl: './file-upload.component.html',
	styleUrls: ['./file-upload.component.scss'],
	providers: [CurrencyPipe]
})
export class FileUploadComponent {
	public readonly form: FormGroup;
	public readonly table: TableModel<any>;

	selectedRowId: number | null = null;

	bankOpt: ISelectOpt[] = [
		{ id: '1', text: 'BCP' },
		{ id: '2', text: 'Interbank' }
	];
	constructor(private tableService: TableService, private builder: FormBuilder, private modal: NgbModal) {
		/* === Table builder === */
		this.table = this.tableService.generateTable<any>({
			headers: [
				'N°',
				'Fecha',
				'Usuario',
				'Descripción de Operación',
				'Monto',
				'Saldo',
				'Sucursal Agencia',
				'Operación Número',
				'Operación Hora',
				'UTC',
				'Referencia 2'
			],
			noCheckBoxes: true
		});
		this.table.data = fileUploadMockData;
		/* === Form builder === */
		this.form = builder.group({
			search: ['', [Validators.required, Validators.minLength(3)]],
			bank: ['', [Validators.required]]
		});
	}

	/* === Events === */
	onUpload() {}

	onSave() {}
}
