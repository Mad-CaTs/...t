import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModel } from '@app/core/models/table.model';
import { TableService } from '@app/core/services/table.service';
import { ToastService } from '@app/core/services/toast.service';
import { UserService } from '@app/users/services/user.service';
import { ISelectOpt } from '@interfaces/form-control.interface';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { TablesModule } from '@shared/components/tables/tables.module';
import { SharedModule } from '@shared/shared.module';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { AffiliationModule } from '@app/affiliation/affiliation.module';
import { NavigationComponent } from '@shared/components/navigation/navigation.component';
import { mockData } from './mock';

@Component({
	selector: 'app-validate-docs',
	templateUrl: './validate-docs.component.html',
	styleUrls: ['./validate-docs.component.scss'],
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
		AffiliationModule,
		NavigationComponent
	]
})
export class ValidateDocsComponent {
	public readonly form: FormGroup;
	public readonly table: TableModel<any>;

	packageOpt: ISelectOpt[] = [];
	selectedRowId: number | null = null;

	constructor(
		private tableService: TableService,
		private builder: FormBuilder,
		public modalService: NgbModal,
		private userService: UserService,
		private cdr: ChangeDetectorRef,
		private toastService: ToastService
	) {
		this.table = this.tableService.generateTable<any>({
			headers: ['N° de registro', 'Usuario', 'Nombres y Apellidos', 'DNI', 'Verificación'],
			noCheckBoxes: true
		});
		this.table.data = mockData;
		/* === Form builder === */
		this.form = builder.group({
			search: [''],
			searchAs: ['1']
		});
	}

	ngOnInit(): void {}

	onSearch() {
	}

	getCurrentDate(): string {
		const today = new Date();
		const day = String(today.getDate()).padStart(2, '0');
		const month = String(today.getMonth() + 1).padStart(2, '0');
		const year = today.getFullYear();

		return `${day}/${month}/${year}`;
	}
}
