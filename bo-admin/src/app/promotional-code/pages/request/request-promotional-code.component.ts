import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { TableModel } from '@app/core/models/table.model';
import { TableService } from '@app/core/services/table.service';
import { ModalLoadingComponentManageBusiness } from '@app/manage-business/components/modals/modal-loading/modal-loading.component';
import { PromotionalCodeService } from '@app/promotional-code/services/promotional-code.service';
import { ITablePromotionalCodeRequest } from '@interfaces/promotional-code.interface';
import { ITableUsers } from '@interfaces/users.interface';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NavigationComponent } from '@shared/components/navigation/navigation.component';
import { TablesModule } from '@shared/components/tables/tables.module';
import { ArrayDatePipe } from '@shared/pipes/array-date.pipe';

@Component({
	selector: 'app-request-promotional-code',
	templateUrl: './request-promotional-code.component.html',
	styleUrls: ['./request-promotional-code.component.scss'],
	standalone: true,
	imports: [CommonModule, NavigationComponent, RouterOutlet, TablesModule, ArrayDatePipe, FormsModule]
})
export class RequestPromotionalCodeComponent {
	public readonly table: TableModel<ITablePromotionalCodeRequest>;
	fullData: ITablePromotionalCodeRequest[] = [];
	dataLoaded: boolean = false;
	private loadingModalRef: NgbModalRef | null = null;
	buttonLoading: { [key: number]: { asistio: boolean; noAsistio: boolean } } = {};
	searchQuery: string = '';
	constructor(
		public modalService: NgbModal,
		private tableService: TableService,
		private promotionalCodeService: PromotionalCodeService,
		private cdr: ChangeDetectorRef,
		public modal: NgbModal
	) {
		this.table = this.tableService.generateTable<ITablePromotionalCodeRequest>({
			headers: [
				'N',
				'Fecha de solcitud',
				'Invitado',
				'Tipo de invitado',
				'Membresía',
				'DNI',
				'Email',
				'Celular',
				'Fecha de nacimiento',
				'Patrocinador',
				'Usuario',
				'Estado',
				'Notificación'
			],
			noCheckBoxes: true,
			headersMinWidth: [70, 130, 180, 180,180,110, 200, 110, 130, 130, 130, 130, 220],
			headersMaxWidth: [70, 130, 180,180,180, 110, 200, 110, 130, 130, 130, 130, 220]
		});

		this.loadData();
	}

	filterData(): void {
		const query = this.searchQuery.toLowerCase().trim();
		if (query) {
			this.table.data = this.fullData.filter(
				(item) =>
					item.name.toLowerCase().includes(query) ||
					item.nroDocument.toLowerCase().includes(query) ||
					item.sponsorFullname.toLowerCase().includes(query) ||
					item.lastname.toLowerCase().includes(query) ||
					this.getStatusText(item.status).toLowerCase().includes(query) ||
					item.sponsorUsername.toLowerCase().includes(query)
			);
		} else {
			this.table.data = [...this.fullData];
		}
		this.cdr.detectChanges();
	}

	private getStatusText(status: number): string {
		switch (status) {
			case 1:
				return 'Pendiente';
			case 2:
				return 'Asistió';
			case 3:
				return 'No asistió';
			default:
				return '';
		}
	}
	private loadData(): void {
		this.showLoadingModal();
		this.promotionalCodeService.getPromotionalGuests().subscribe(
			(response: any) => {
				if (response && response.data && Array.isArray(response.data)) {
					this.fullData = response.data;
					this.table.data = response.data;
					this.table.data.forEach((item, index) => {
						item.orderN = index + 1;
					});
					this.filterData();
				} else {
					console.error('Formato de respuesta inesperado:', response);
					this.table.data = [];
				}
				this.cdr.detectChanges();
				this.hideLoadingModal();
			},
			(error) => {
				console.error('Error al cargar datos:', error);
				this.hideLoadingModal();
			}
		);
	}

	private showLoadingModal(): void {
		this.loadingModalRef = this.modal.open(ModalLoadingComponentManageBusiness, {
			centered: true,
			size: 'sm'
		});
	}

	public actualizarDatos() {
		this.searchQuery = '';
		this.loadData();
	}

	public onEdit(id: number) {}

	private hideLoadingModal(): void {
		if (this.loadingModalRef) {
			this.loadingModalRef.close();
			this.loadingModalRef = null;
		}
	}

	confirmAssist(id: number, newStatus: number): void {
		if (!this.buttonLoading[id]) {
			this.buttonLoading[id] = { asistio: false, noAsistio: false };
		}
		if (newStatus === 2) {
			this.buttonLoading[id].asistio = true;
		} else if (newStatus === 3) {
			this.buttonLoading[id].noAsistio = true;
		}

		this.promotionalCodeService.confirmAssist(id, newStatus).subscribe(
			(response) => {
				const item = this.table.data.find((row: any) => row.id === id);
				if (item) {
					item.status = newStatus;
				}
				this.cdr.detectChanges();
			},
			(error) => {
				console.error('Error al confirmar asistencia:', error);

				const item = this.table.data.find((row: any) => row.id === id);
				if (item) {
					item.status = 1;
				}
			},
			() => {
				if (newStatus === 2) {
					this.buttonLoading[id].asistio = false;
				} else if (newStatus === 3) {
					this.buttonLoading[id].noAsistio = false;
				}
			}
		);
	}
}
