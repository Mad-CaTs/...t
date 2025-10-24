import { Component, Inject, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
	selector: 'app-modal',
	templateUrl: './app-modal.component.html',
	styleUrls: ['./app-modal.component.scss'],
	standalone: true,
	imports: [CommonModule, ModalComponent]
})
export class AppModalComponent {
	icon: string;
	title: string;
	message: string;
	showPrimaryBtn: boolean;
	showSecondaryBtn: boolean;
	primaryBtnText: string;
	secondaryBtnText: string;
	primaryBtnColor: 'orange' | 'white';
	messageHtml: string;

	@Output() primaryAction = new EventEmitter<void>();
	@Output() secondaryAction = new EventEmitter<void>();

	constructor(
		private dialogRef: MatDialogRef<AppModalComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any
	) {
		this.icon = data.icon || 'assets/icons/info_circle_24px.svg';
		this.title = data.title || '';
		this.message = data.message || '';
		this.messageHtml = data.messageHtml || '';
		this.showPrimaryBtn = data.showPrimaryBtn || false;
		this.showSecondaryBtn = data.showSecondaryBtn || false;
		this.primaryBtnText = data.primaryBtnText || 'Aceptar';
		this.secondaryBtnText = data.secondaryBtnText || 'Cancelar';
		this.primaryBtnColor = data.primaryBtnColor || 'orange';
	}

	onPrimaryClick() {
		let value: string;
		const btnText = this.primaryBtnText.toLowerCase();
		if (btnText === 'solicitar') {
			value = 'solicitar';
		} else if (btnText === 'enviar') {
			value = 'enviar';
		} else {
			value = 'Aceptar';
		}
		this.primaryAction.emit();
		this.dialogRef.close(value);
	}

	onSecondaryClick() {
		this.secondaryAction.emit();
		this.dialogRef.close('cancelar');
	}
}
