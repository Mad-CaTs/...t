import { ChangeDetectorRef, Component } from '@angular/core';

import { TableModel } from '@app/core/models/table.model';

import { ModalDeleteUserComponent } from '@app/users/components/modals/modal-delete-user/modal-delete-user.component';

import type { ITableUsers } from '@interfaces/users.interface';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TableService } from '@app/core/services/table.service';

/* === Modules === */
import { CommonModule } from '@angular/common';
import { TablesModule } from '@shared/components/tables/tables.module';
import { ModalUserUpsertComponent } from '@app/users/components/modals';
import { UsersService } from '@app/users/services/users.service';
import { ModalLoadingComponentManageBusiness } from '@app/manage-business/components/modals/modal-loading/modal-loading.component';
import { LoadingService } from '@shared/services/loading.service';

@Component({
	selector: 'app-users',
	templateUrl: './users.component.html',
	styleUrls: ['./users.component.scss'],
	standalone: true,
	imports: [CommonModule, TablesModule]
})
export class UsersComponent {
	public readonly table: TableModel<ITableUsers>;
	public usersList: any[] = [];
	private loadingModalRef: NgbModalRef | null = null;

	constructor(
		public modalService: NgbModal,
		private tableService: TableService,
		private usersService: UsersService,
		private cdr: ChangeDetectorRef,
		public modal: NgbModal,
		private loadingService: LoadingService
	) {
		/* === Table builder === */
		this.table = this.tableService.generateTable<ITableUsers>({
			headers: ['Nombres y Apellidos', 'Usuario', 'Rol', 'Correo', 'Telefono', 'Editar'],
			noCheckBoxes: false,
			headersMinWidth: [100, 100, 100, 80, 100, 100]
		});
	}

	ngOnInit(): void {
		this.loadUsers();
	}

	private loadUsers(): void {
		this.loadingService.showLoadingModal();
		this.usersService.getUsers().subscribe({
			next: (users) => {
				this.loadingService.hideLoadingModal();
				this.table.data = users;
				this.cdr.detectChanges();
			},
			error: (err) => {
				this.loadingService.hideLoadingModal();

				console.error('Error al cargar los usuarios:', err);
			}
		});
	}

	/* === Events === */
	public onCreate() {
		const modalRef = this.modalService.open(ModalUserUpsertComponent, { centered: true, size: 'md' });
		modalRef.componentInstance.loadRoles();
	}

	public onEdit(id: number): void {
		const ref = this.modalService.open(ModalUserUpsertComponent, { centered: true, size: 'md' });
		ref.componentInstance.loadRoles();

		const modal = ref.componentInstance as ModalUserUpsertComponent;
		modal.id = id;
		this.loadingService.showLoadingModal();
		this.usersService.getUserById(id).subscribe({
			next: (user) => {
				this.loadingService.hideLoadingModal();
				modal.form.patchValue({
					names: user.name,
					lastnames: user.lastName,
					username: user.userName,
					role: user.idRol,
					password: '',
					email: user.email,
					phoneNumber: user.nroTelf
				});
			},
			error: (err) => {
				console.error('Error al cargar los datos del usuario:', err);
				this.loadingService.hideLoadingModal();
				alert('Hubo un error al cargar los datos del usuario.');
			}
		});
	}
}
