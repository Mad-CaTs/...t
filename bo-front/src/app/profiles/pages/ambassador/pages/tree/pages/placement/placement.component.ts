import { AfterViewInit, Component, Input, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalPlacementComponent } from './commons/modals/modal-placement/modal-placement.component';
import { ModalUnplacementComponent } from './commons/modals/modal-unplacement/modal-unplacement.component';
import { IPlacementListTable } from '../../commons/interfaces';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';
import { PlacementService } from './commons/services/placement.service';
import { placementNavigationMock } from './commons/mocks/mock';
import { TableService } from '../../../../commons/services/table/table.service';
import { TableAccountTreePlacementComponent } from './commons/components/table-account-tree-placement/table-account-tree-placement.component';
import { CommonModule } from '@angular/common';
import { NavigationComponent } from '@shared/components/navigation/navigation.component';

@Component({
	selector: 'app-placement',
	templateUrl: './placement.component.html',
	styleUrls: [],
	standalone: true,
	imports: [NavigationComponent, TableAccountTreePlacementComponent, CommonModule],
	providers: [TableService]
})
export default class PlacementComponent implements AfterViewInit {
	@Input() sponsorId: number = this.userInfoService.userInfo.id;
	public dataBody: IPlacementListTable[] = [];
	public dataUnplacement: IPlacementListTable[] = [];
	public tableDataPlacement: IPlacementListTable[] = [];
	public tableDataUnplacement: IPlacementListTable[] = [];
	public navigationData = placementNavigationMock;
	public selectedId = 1;
	public fullnames: { name: string; id: number }[] = [];
	public loading: boolean = false;
	public loadingUnplacement: boolean = false;
	public disabledUser: boolean = this.userInfoService.disabled;

	@ViewChild(TableAccountTreePlacementComponent) tableComponent!: TableAccountTreePlacementComponent;

	constructor(
		private modal: NgbModal,
		public userInfoService: UserInfoService,
		private placementService: PlacementService,
		public tableService: TableService,
		private cdr: ChangeDetectorRef
	) {}

	ngOnInit(): void {
		this.getPlacementData(this.sponsorId);
		this.getUnplacementData(this.sponsorId);
	}

	ngAfterViewInit(): void {
		this.updateTableData();
		this.cdr.detectChanges();
	}

	public onOpenModal(data: {
		selectedData: IPlacementListTable | undefined;
		fullnames: { name: string; id: number }[];
	}) {
		let component;

		if (this.selectedId === 1) component = ModalPlacementComponent;
		else component = ModalUnplacementComponent;

		const ref = this.modal.open(component, { centered: true });
		const modal = ref.componentInstance;

		modal.selectedData = data.selectedData;
		modal.fullnames = data.fullnames;

		modal.closeModal.subscribe(() => {
			ref.close();
		});
	}

	get btnText() {
		return this.selectedId === 1 ? 'Posicionar' : 'Desposicionar';
	}

	private getPlacementData(id: number): void {
		this.loading = true;
		this.placementService.getListPlacement(id).subscribe(
			(response: any) => {
				this.dataBody = this.transformData(response.idSon);
				this.tableDataPlacement = [...this.dataBody];
				this.fullnames = this.dataBody.map((item) => ({ name: item.fullname, id: item.id }));
				this.updateTableData();
				this.loading = false;
			},
			(error) => {
				console.error('Error al obtener los datos:', error);
				this.loading = false;
			}
		);
	}

	private getUnplacementData(id: number): void {
		this.loadingUnplacement = true;
		this.placementService.getListUnplacement(id).subscribe(
			(response: any) => {
				this.dataUnplacement = this.transformDataUnplacement(response);
				this.tableDataUnplacement = [...this.dataUnplacement];
				this.updateTableData();
				this.loadingUnplacement = false;
			},
			(error) => {
				console.error('Error al obtener los datos:', error);
				this.loadingUnplacement = false;
			}
		);
	}

	private transformData(data: any[]): IPlacementListTable[] {
		return data.map((user) => {
			const formattedDate = this.formatDate(user.registrationDate);
			return {
				id: user.idUser,
				username: user.userName,
				fullname: `${user.name} ${user.lastName}`,
				date: formattedDate,
				membership: user.namePackage,
				status: user.status
			};
		});
	}

	private transformDataUnplacement(data: any[]): IPlacementListTable[] {
		return data.map((user) => {
			const formattedDate = this.formatDate(user.fechaRegistro);
			return {
				id: user.idsocio,
				username: user.nombre_socio,
				fullname: user.nombre_socio,
				date: formattedDate,
				membership: `Elite`,
				status: user.estado_socio
			};
		});
	}

	private formatDate(dateArray: number[]): string {
		const [year, month, day, hour, minute, second] = dateArray;
		const defaultDate = new Date(2000, 0, 1, 0, 0, 0);
		const validDate = new Date(
			year || defaultDate.getFullYear(),
			(month || 1) - 1,
			day || 1,
			hour || 0,
			minute || 0,
			second || 0
		);
		if (isNaN(validDate.getTime())) {
			console.error(`Invalid date: ${year}-${month}-${day} ${hour}:${minute}:${second}`);
			return '';
		}
		return validDate.toLocaleString('es-ES', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric'
		});
	}

	public onChangeSelected(selectedId: number) {
		this.selectedId = selectedId;
		this.updateTableData();
	}

	private updateTableData() {
		if (this.tableComponent) {
			if (this.selectedId === 1) {
				this.tableComponent.dataBody = this.tableDataPlacement;
			} else if (this.selectedId === 2) {
				this.tableComponent.dataBody = this.tableDataUnplacement;
			}
			this.tableComponent.fullnames = this.fullnames;
			this.tableComponent.selectedId = this.selectedId;
		}
	}
}
