import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { DialogModule } from 'primeng/dialog';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

export interface ModalSuccessData {
	text: string | string[];
	title: string;
	icon?: string;
}

@Component({
	selector: 'app-modal-success',
	templateUrl: './modal-success.component.html',
	styleUrls: ['./modal-success.component.scss'],
	standalone: true,
	imports: [CommonModule, MatIconModule, DialogModule]
})
export class ModalSuccessComponent {
	constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig<ModalSuccessData>) {}

	closeModal() {
		this.ref.close();
	}

	get data() {
		const icon = this.config.data?.icon;
		if (!this.isImage(icon)) {
			this.config.data.icon = 'assets/icons/Inclub.png';
		}
		return this.config.data;
	}

	isImage(icon: string): boolean {
		return icon.includes('.png') || icon.includes('.jpg') || icon.includes('.jpeg');
	}

	isArray(value: unknown): value is string[] {
		return Array.isArray(value);
	}
}
