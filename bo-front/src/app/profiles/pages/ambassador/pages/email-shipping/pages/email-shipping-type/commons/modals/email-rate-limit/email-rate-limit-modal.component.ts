import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
	selector: 'email-rate-limit-modal',
	templateUrl: './email-rate-limit-modal.component.html',
	standalone: true,
	imports: [CommonModule],
	styleUrls: []
})
export class EmailRateLimitModalComponent  {

	constructor(private ref: DynamicDialogRef

	) {}

	close() {
		this.ref.close();
	  }
	

}