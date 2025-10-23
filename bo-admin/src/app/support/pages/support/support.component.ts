import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableService } from '@app/core/services/table.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { TablesModule } from '@shared/components/tables/tables.module';
import { SharedModule } from '@shared/shared.module';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { NavigationComponent } from '@shared/components/navigation/navigation.component';

@Component({
	selector: 'app-support',
	templateUrl: './support.component.html',
	styleUrls: ['./support.component.scss'],
	standalone: true,
	imports: [
		CommonModule,
		SharedModule,
		FormsModule,
		ReactiveFormsModule,
		TablesModule,
		InlineSVGModule,
		ModalComponent,
		FormControlModule,
		NavigationComponent
	]
})
export class SupportComponent {
	public readonly form: FormGroup;

	constructor(
		private tableService: TableService,
		private builder: FormBuilder,
		public modalService: NgbModal,
		private cdr: ChangeDetectorRef
	) {}

	ngOnInit(): void {}

	getCurrentDate(): string {
		const today = new Date();
		const day = String(today.getDate()).padStart(2, '0');
		const month = String(today.getMonth() + 1).padStart(2, '0');
		const year = today.getFullYear();
		return `${day}/${month}/${year}`;
	}
}
