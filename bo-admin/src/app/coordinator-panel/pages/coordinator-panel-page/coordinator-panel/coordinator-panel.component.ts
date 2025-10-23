import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModel } from '@app/core/models/table.model';
import { TableService } from '@app/core/services/table.service';
import { ToastService } from '@app/core/services/toast.service';
import { ScheduleModule } from '@app/schedule/schedule.module';
import { UserService } from '@app/users/services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { TablesModule } from '@shared/components/tables/tables.module';
import { SharedModule } from '@shared/shared.module';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { mockData } from './mock';
import { CoordinatorPanelModule } from '@app/coordinator-panel/coordinator-panel.module';
import { ISelectOpt } from '@interfaces/form-control.interface';

@Component({
	selector: 'app-coordinator-panel',
	templateUrl: './coordinator-panel.component.html',
	styleUrls: ['./coordinator-panel.component.scss'],
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
		CoordinatorPanelModule
	]
})
export class CoordinatorPanelComponent {
	public readonly form: FormGroup;
	public readonly table: TableModel<any>;

	selectedRowId: number | null = null;

	statusTicketOpt: ISelectOpt[] = [];
	typeTicketOpt: ISelectOpt[] = [];
	assignedToOpt: ISelectOpt[] = [];

	constructor(
		private builder: FormBuilder,
		public modalService: NgbModal,
		private userService: UserService,
		private cdr: ChangeDetectorRef,
		private tableService: TableService
	) {
		this.table = this.tableService.generateTable<any>({
			headers: [
				'N°',
				'Fecha de asignación',
				'N° de Ticket',
				'Estado de Ticket',
				'Tipología',
				'Solicitado desde',
				'Solicitante',
				'Usuario',
				'Nombres y apellidos',
				'DNI',
				'Estado de petición',
				'Asignado',
				'Observaciones'
			],
			noCheckBoxes: true,
			headersMinWidth: [50, 90, 80, 90, 100, 110, 150, 110, 150, 110, 110, 180, 110],
			headersMaxWidth: [50, 90, 80, 90, 100, 110, 150, 110, 150, 110, 110, 180, 110]
		});
		this.table.data = mockData;
		this.form = builder.group({
			search: [''],
			searchAs: ['1'],
			statusTicket: [''],
			typeTicket: [''],
			assignedTo: ['']
		});
		this.statusTicketOpt = [
			{ id: '1', text: 'Activo' },
			{ id: '2', text: 'En Proceso' },
			{ id: '3', text: 'Inactivo' }
		];
		this.typeTicketOpt = [
			{ id: '1', text: 'General' },
			{ id: '2', text: 'Soporte Técnico' },
			{ id: '3', text: 'Otro' }
		];
		this.assignedToOpt = [
			{ id: '1', text: 'Juan Pérez' },
			{ id: '2', text: 'María García' },
			{ id: '3', text: 'Pedro Sánchez' }
		];
	}

	ngOnInit(): void {}

	onRowSelect(id: number): void {
		this.selectedRowId = id;
	}
}
