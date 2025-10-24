import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { SelectComponent } from '@shared/components/form-control/select/select.component';
import {
	DialogService,
	DynamicDialogConfig,
	DynamicDialogModule,
	DynamicDialogRef
} from 'primeng/dynamicdialog';
import { DialogModule } from 'primeng/dialog';
import { Router } from '@angular/router';

@Component({
	selector: 'modal-prodts-detail',
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		MatIconModule,
		SelectComponent,
		DialogModule,
		DynamicDialogModule
	],
	templateUrl: './modal-bonus-list-detail.html',
	styleUrls: ['./modal-bonus-list-detail.scss'],
	providers: [DialogService]
})
export class ModalBonusDetailComponent implements OnInit {
	showMoreDetails = false;
	selectedSponsorId: any = null;
	constructor(
		private router: Router,
		public ref: DynamicDialogRef,
		public config: DynamicDialogConfig,
		private dialogService: DialogService
	) {}

	ngOnInit(): void {}

	closeModal() {
		this.ref.close();
	}
}
