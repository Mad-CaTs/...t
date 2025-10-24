import {
	Component,
	EventEmitter,
	Input,
	OnChanges,
	OnDestroy,
	Output,
	SimpleChanges,
	ViewChild
} from '@angular/core';

import { FormControl, FormsModule } from '@angular/forms';
import { IPartnerListTable } from '../../../../../commons/interfaces';
import { CommonModule } from '@angular/common';
import { TableComponent } from '@shared/components/table/table.component';
import { PartnerListResponseDTO } from '../../../../../commons/interfaces/partnerList';
import { PaginationNgPrimeComponent } from '@shared/components/pagination-ng-prime/pagination-ng-prime.component';
import { DashboardService } from 'src/app/profiles/pages/ambassador/pages/dashboard/pages/primary-and-secondary-profile/commons/services/dashboard.service';
import { MatIconModule } from '@angular/material/icon';
import { TablePaginationService } from '@shared/services/table-pagination.service';
import { ModalDetailAccountTreePartnerListComponent } from '../../modals/modal-detail-account-tree-partner-list/modal-detail-account-tree-partner-list.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MatMenuModule } from "@angular/material/menu";

@Component({
	selector: 'app-table-account-tree-partner-list',
	templateUrl: './table-account-tree-partner-list.component.html',
	standalone: true,
	imports: [CommonModule, TableComponent, PaginationNgPrimeComponent, MatIconModule, FormsModule, MatMenuModule],
	styleUrls: ['./table-account-tree-partner-list.component.scss']
})
export class TableAccountTreePartnerListComponent implements OnDestroy, OnChanges {
	@ViewChild(PaginationNgPrimeComponent) paginator: PaginationNgPrimeComponent | undefined;
	@Input() dataBody: PartnerListResponseDTO[] = [];
	//@Output() detailModal = new EventEmitter<number>();
	@Input() totalRecords: number = 0;
	@Output() pageChange: EventEmitter<any> = new EventEmitter();
	@Output() refresh: EventEmitter<any> = new EventEmitter();

	@Output() detailModal = new EventEmitter<PartnerListResponseDTO>();


	@Input() isLoading: boolean = true;
	align: string = 'right';
	public rows: number = 10;
	public first: number = 0;
	public id: string = '';
	public selected: FormControl = new FormControl(1);
	selectedRecord: any;
	dialogRef: DynamicDialogRef;
	dialogService: DialogService;

	showModal = false;

	constructor(public tableService: TablePaginationService, private dashboardService: DashboardService) {
		this.id = tableService.addTable(this.dataBody, this.rows);
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (!changes['dataBody']) return;

		this.tableService.updateTable(this.dataBody, this.id, this.rows);

		// Precargar Rango y Puntos individuales sin clic
		// for (const d of this.dataBody) {
		// 	// Rango
		// 	if (d.rango === undefined && !d.isLoadingRango && d.idUser != null) {
		// 	d.isLoadingRango = true;      
		// 	this.viewRange(d.idUser, d);  
		// 	}

		// 	// Puntos individuales
		// 	if (d.puntajeDeLaMembresia === undefined && !d.isLoading && d.idUser != null) {
		// 	d.isLoading = false;           
		// 	this.viewScores(d.idUser, d); 
		// 	}
		// }
	}

	viewScores(idUser: number, d: any): void {
		if (d.puntajeGrupal !== undefined && d.puntajeDeLaMembresia !== undefined) {
			return;
		}
		const body = { id: idUser, tipo: 'R' };

		d.isLoading = true;

		d.puntajeGrupal = undefined;
		d.puntajeDeLaMembresia = undefined;

		this.dashboardService.postPointsKafka(body).subscribe(
			(puntajes) => {
				const puntajeGrupal =
					puntajes.data.compuestoRama1 +
					puntajes.data.compuestoRama2 +
					puntajes.data.compuestoRama3;
				d.puntajeGrupal = puntajeGrupal;
				const puntajeIndividual = puntajes.data.puntajeDeLaMembresia;
				d.puntajeDeLaMembresia = puntajeIndividual;
				d.isLoading = false;
			},
			(error) => {
				console.error('Error al obtener los puntajes:', error);
				d.isLoading = false;
			}
		);
	}

	viewRange(idUser: number, d: any): void {
		d.isLoadingRango = true;
		d.rango = undefined;

		this.dashboardService.getRange(idUser).subscribe(
			(rangoData) => {
				if (rangoData && rangoData.rango) {
					d.rango = rangoData.rango;
				} else {
					d.rango = 'Socio';
				}

				d.isLoadingRango = false;
			},
			(error) => {
				console.error('Error al obtener el rango:', error);
				d.isLoadingRango = false;
				d.rango = undefined;
			}
		);
	}

	ngOnDestroy(): void {
		this.tableService.deleteTable(this.id);
	}

	onClickDetail() {
		const id = this.selected.value;
		this.detailModal.emit(id);
	}

	get table() {
		return this.tableService.getTable<PartnerListResponseDTO>(this.id);
	}


	onPageChange(event: any): void {
		this.first = event.first;
		this.rows = event.rows;
		this.pageChange.emit({ page: event.page, rows: this.rows });
	}

	onRefresh(event: any): void {
		this.rows = event.rows;
		this.refresh.emit({ rows: this.rows });
	}

	private hexToRgba(hex: string, opacity: number, factor: number): string {
		const bigint = parseInt(hex.replace('#', ''), 16);
		let r = (bigint >> 16) & 255;
		let g = (bigint >> 8) & 255;
		let b = bigint & 255;

		r = Math.floor(r * factor);
		g = Math.floor(g * factor);
		b = Math.floor(b * factor);

		return `rgba(${r}, ${g}, ${b}, ${opacity})`;
	}

	getTransparentColor(color: string): string {
		return this.hexToRgba(color, 0.4, 1);
	}

	getSolidColor(color: string): string {
		return this.hexToRgba(color, 1, 0.8);
	}

	resetPagination(): void {
		if (this.paginator) {
			this.paginator.resetPaginator();
		}
	}

	get headers() {
		const result = [
			'N°',
			'Usuario',
			'Nombres y Apellidos',
			'Estado',
			'Rango',
			'Nivel Patrocinio',
			'Patrocinador',
			'Rama',
			'Acciones'

		];
		return result;
	}

	get minWidthHeaders() {
		const result = [10, 120, 180, 30, 100, 90, 150, 100, 100];
		return result;
	}

	onAccept(row: PartnerListResponseDTO) {
		this.showModal = true;
	}

	onOpenModalDetail(): void {
		this.sendDataToKafka(this.selectedRecord.idUser, 'R');
		this.dialogRef = this.dialogService.open(ModalDetailAccountTreePartnerListComponent, {
			header: 'Detalle Prueba',
			//width: 'xl',
			data: { record: this.selectedRecord }
		});
		this.dialogRef.onClose.subscribe(() => { });
	}



	sendDataToKafka(id: number, tipo: string) {
		const pointKafkaBody = { id, tipo };
		this.dashboardService.postPointsKafka(pointKafkaBody).subscribe(
			(response: any) => { },
			(error) => {
				console.error('Error al enviar datos a Kafka:', error);
			}
		);
	}

}
