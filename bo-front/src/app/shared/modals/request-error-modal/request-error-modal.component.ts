import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
	selector: 'app-request-error-modal',
	standalone: true,
	imports: [CommonModule, MatIconModule],
	templateUrl: './request-error-modal.component.html',
  
	styleUrl: './request-error-modal.component.scss'
})
export class RequestErrorModalComponent {
	constructor(public ref: DynamicDialogRef) {}
	closeModal() {
		this.ref.close();
	}
}
