import { Component, inject } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DialogModule } from 'primeng/dialog';
import { DialogData, IconData } from './interface/modal-info.interface';
import { MODAL_INFO_CONSTANTS } from './constants/moda-info.constans';

@Component({
	selector: 'app-modal-info',
	standalone: true,
	imports: [DialogModule],
	templateUrl: './modal-info.component.html',
	styleUrl: './modal-info.component.scss'
})
export class ModalInfoComponent {
	public ref: DynamicDialogRef = inject(DynamicDialogRef);
	public config: DynamicDialogConfig<DialogData> = inject(DynamicDialogConfig);
	public data: DialogData = null;
	defaultIcon: IconData | null = null;

	ngOnInit() {
		this.data = this.config.data;
    this.getIconData();
	}

	getIconData(): IconData {
		if (this.data.kind === 'custom') {
			this.defaultIcon = this.data.icon;
		} else {
			this.defaultIcon = MODAL_INFO_CONSTANTS[this.data.type];
		}
		return this.defaultIcon;
	}

	closeModal() {
		this.ref.close();
	}
}
