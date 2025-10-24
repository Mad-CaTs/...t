import { Component, inject, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MatIconModule } from '@angular/material/icon';
import { DialogData } from '../../commons/interfaces/new-partner-select-package';

@Component({
	selector: 'app-transfer-response-modal',
	standalone: true,
	imports: [MatIconModule],
	templateUrl: './transfer-response-modal.component.html',
	styleUrl: './transfer-response-modal.component.scss'
})
export class TransferResponseModalComponent implements OnInit {
	public ref: DynamicDialogRef = inject(DynamicDialogRef);
	public config: DynamicDialogConfig<DialogData> = inject(DynamicDialogConfig);
	public data: DialogData = null;

	ngOnInit() {
		this.data = this.config.data;
	}

	closeModal() {
		this.ref.close();
	}
}
