import { Component } from '@angular/core';

import { tableDataMock } from './mock';

import { TableModel } from '@app/core/models/table.model';

import { ModalUpsertEventComponent } from '@app/manage-home/components/modals';
import { ModalConfirmationComponent } from '@shared/components/modal-confirmation/modal-confirmation.component';

import type { ITableEventList } from '@interfaces/manage-home.interface';

import { TableService } from '@app/core/services/table.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

/* === Modules === */
import { CommonModule } from '@angular/common';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { TablesModule } from '@shared/components/tables/tables.module';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
	selector: 'app-events',
	standalone: true,
	imports: [CommonModule, FormControlModule, TablesModule],
	templateUrl: './events.component.html',
	styleUrls: ['./events.component.scss']
})
export class EventsComponent {
	public readonly table: TableModel<ITableEventList>;

	public form: FormGroup;

	constructor(
		private tableService: TableService,
		private builder: FormBuilder,
		private modalManager: NgbModal
	) {
		/* === Table builder === */
		this.table = this.tableService.generateTable<ITableEventList>({
			headers: [
				'Subtipo de evento',
				'Presentador',
				'Inicio',
				'Fin',
				'Flyer',
				'Link de la reunión / Sede central',
				'Tipo de entrada',
				'Estado',
				'Editar',
				'Eliminar'
			]
		});
		this.table.data = tableDataMock;

		this.form = builder.group({
			search: ['']
		});
	}

	/* === Events === */
	public onSearch() {}

	public onCreateEvent() {
		const ref = this.modalManager.open(ModalUpsertEventComponent, { centered: true, size: 'md' });
		const modal = ref.componentInstance as ModalUpsertEventComponent;

		modal.id = 0;
	}

	public onEditEvent(id: number) {
		const ref = this.modalManager.open(ModalUpsertEventComponent, { centered: true, size: 'md' });
		const modal = ref.componentInstance as ModalUpsertEventComponent;

		modal.id = id;
	}


	public onDeleteEvent(id: number) {
		const ref = this.modalManager.open(ModalConfirmationComponent, { centered: true, size: 'md' });
		const modal = ref.componentInstance as ModalConfirmationComponent;

		modal.title = '¿Estás seguro?';
		modal.icon = 'bi bi-exclamation-circle text-danger fa-2x';
		modal.body = 'Estás a punto de eliminar un evento, ¿estás seguro de realizar esta operación?';
		modal.buttons = [
			{
				text: 'Cancelar',
				className: 'btn btn-outline-secondary',
				onClick: () => ref.close()
			},
			{
				text: 'Eliminar',
				className: 'btn btn-danger',
				onClick: () => ref.close()
			}
		];
	}
}
