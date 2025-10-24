import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
	selector: 'app-modal-placement-error',
	templateUrl: './modal-placement-error.component.html',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule, ModalComponent],
	styleUrls: []
})
export class ModalPlacementErrorComponent implements OnInit {
data: { text: string; title: string; icon: string } | undefined;


	constructor(public config: DynamicDialogConfig) {}


	ngOnInit(): void {
		this.data = this.config.data;

	}

}