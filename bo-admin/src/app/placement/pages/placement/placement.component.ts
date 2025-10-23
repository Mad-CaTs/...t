import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModel } from '@app/core/models/table.model';
import { TableService } from '@app/core/services/table.service';
import { ToastService } from '@app/core/services/toast.service';
import { PlacementModule } from '@app/placement/placement.module';
import { UserService } from '@app/users/services/user.service';
import { ISelectOpt } from '@interfaces/form-control.interface';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { TablesModule } from '@shared/components/tables/tables.module';
import { SharedModule } from '@shared/shared.module';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { mockData } from './mock';
import { ModalEditPlacementComponent } from '@app/placement/components/modals/modal-edit-placement/modal-edit-placement.component';
import { ModalDeletePlacementComponent } from '@app/placement/components/modals/modal-delete-placement/modal-delete-placement.component';
import { PlacementService } from '@app/placement/services/placement-service';
import { ArrayDatePipe } from '@shared/pipes/array-date.pipe';

@Component({
	selector: 'app-placement',
	templateUrl: './placement.component.html',
	styleUrls: ['./placement.component.scss'],
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
		PlacementModule,
		ArrayDatePipe
	]
})
export class PlacementComponent {
	readonly form: FormGroup;
	readonly table: TableModel<any>;

	packageOpt: ISelectOpt[] = [];
	selectedRowId: number | null = null;
	loading: boolean = false;

	constructor(
		private tableService: TableService,
		private builder: FormBuilder,
		public modalService: NgbModal,
		private userService: UserService,
		private placementService: PlacementService,
		private cdr: ChangeDetectorRef,
		private toastService: ToastService
	) {
		this.table = this.tableService.generateTable<any>({
			headers: [
				'N°',
				'Fecha de Afiliación',
				'Usuario',
				'Nombres y Apellidos',
				'N° de documento',
				'Upliner',
				'Patrocinador'
			],
			noCheckBoxes: true,
			headersMinWidth: [70, 130, 130, 110, 160, 110, 130, 130, 130],
			headersMaxWidth: [70, 130, 130, 110, 160, 110, 130, 130, 130]
		});
		// this.table.data = [];
		this.table.data = []
			;
		/* === Form builder === */
		this.form = this.builder.group({
			username: [''],
			familyPackage: [-1],
			packageDetail: [-1],
			typeUser: ['1'],
			status: [-1],
		});

	}

	ngOnInit(): void { }

	onSearch() {
		this.loading = true;
		const body = {
			"username": this.form.get('username')!.value,
			"state": this.form.get('status')!.value,
			"familyPackage": this.form.get('status')!.value,
			"packageDetail": this.form.get('status')!.value,
			"typeUser": Number(this.form.get('typeUser')!.value)
		}
		this.placementService.getPlacementUpliner(body).subscribe({
			next: (response) => {
				this.table.data = response;
				console.log(response);
				this.loading = false;
				this.cdr.detectChanges();
			}
		});
	}

	onEditPlacementDate(item: any) {
		let placementDate: Date | null;

		if (typeof item.placementDate === 'string' || item.placementDate instanceof String) {
			placementDate = this.parseDateString(item.placementDate);
		} else {
			placementDate = item.placementDate;
		}

		if (!placementDate || isNaN(placementDate.getTime())) {
			console.error('Invalid Date:', item.placementDate);
			return;
		}

		const modalRef = this.modalService.open(ModalEditPlacementComponent, {
			centered: true,
			size: 'm'
		});
		const modal = modalRef.componentInstance as ModalEditPlacementComponent;

		modal.idUser = item.idUser;
		modal.placementDate = placementDate;
	}

	parseDateString(dateString: string): Date | null {
		const parts = dateString.split('/');
		if (parts.length !== 3) {
			return null;
		}

		const day = parseInt(parts[0], 10);
		const month = parseInt(parts[1], 10) - 1;
		const year = parseInt(parts[2], 10);

		return new Date(year, month, day);
	}

	onDeletePlacementDate(item: any) {
		const modalRef = this.modalService.open(ModalDeletePlacementComponent, {
			centered: true,
			size: 'm'
		});
		const modal = modalRef.componentInstance as ModalDeletePlacementComponent;

		modal.idUser = item.idUser;
		modal.placementDate = item.placementDate;
		modal.username = item.username;
		modal.fullName = item.fullName;
		modal.documentNumber = item.documentNumber;
		modal.sponsor = item.sponsor;
	}
}
