import { ChangeDetectorRef, Component } from '@angular/core';

import { tableDataMock } from './_mock';

import type { ITableGracePeriod } from '@interfaces/manage-business.interface';

import { TableModel } from '@app/core/models/table.model';

import { TableService } from '@app/core/services/table.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

/* === Modules === */
import { CommonModule } from '@angular/common';
import { TablesModule } from '@shared/components/tables/tables.module';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { UserService } from '@app/users/services/user.service';
import { ToastService } from '@app/core/services/toast.service';
import { ISelectOpt } from '@interfaces/form-control.interface';
import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { asOptMock } from '../../../users/pages/list-users/mock';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalGracePeriodDetailComponent } from '@app/manage-business/components/modals/modal-grace-period-detail/modal-grace-period-detail.component';

@Component({
	selector: 'app-grace-period',
	standalone: true,
	imports: [
		CommonModule,
		TablesModule,
		InlineSVGModule,
		FormControlModule,
		FormsModule,
		ReactiveFormsModule,
		ModalGracePeriodDetailComponent
	],
	templateUrl: './grace-period.component.html',
	styleUrls: ['./grace-period.component.scss']
})
export class GracePeriodComponent {
	readonly form: FormGroup;
	readonly table: TableModel<ITableGracePeriod>;
	statusOpt: ISelectOpt[] = [];
	packageOpt: ISelectOpt[] = [];
	selectedRowId: number | null = null;
	suscriptions: any[] = [];

	constructor(
		private tableService: TableService,
		private builder: FormBuilder,
		private userService: UserService,
		private cdr: ChangeDetectorRef,
		public modalService: NgbModal,
		private toastService: ToastService
	) {
		/* === Table builder === */
		this.table = this.tableService.generateTable<ITableGracePeriod>({
			headers: [
				'Usuario',
				'DNI',
				'Nombres y Apellidos',
				'Género',
				'Email',
				'Celular',
				'Patrocinador',
				'Estado',
				'Suscripciones'
			],
			noCheckBoxes: true
		});
		this.table.data = [];
		/* === Form builder === */
		this.form = builder.group({
			search: ['', [Validators.required, Validators.minLength(3)]],
			searchAs: ['1', [Validators.required]]
		});
	}

	/* === Events === */

	ngOnInit(): void {
		// Estados
		this.userService.getAllStates().subscribe(
			(states) => {
				this.statusOpt = [
					{ id: '-1', text: 'Todos' },
					...states.map((state) => ({
						id: state.idState.toString(),
						text: state.nameState
					}))
				];
				this.cdr.detectChanges();
			},
			(error) => {
				console.error('Error fetching states:', error);
			}
		);
	}
	onSearch() {
		const searchValue = this.form.get('search')?.value;
		const as = this.form.get('searchAs')?.value;
		const status = '-1';
		const familyPackage = '0';
		const packagee = '0';

		this.userService.getUsersByFilter(searchValue, status, familyPackage, packagee, as).subscribe(
			(response) => {
				const usersWithMembership: any[] = [];

				response.forEach((user: any) => {
					this.loadSuscriptions(user.idUser).subscribe((suscriptions) => {
						const membership = suscriptions.length;

						const userWithMembership = {
							id: user.idUser,
							username: user.username,
							dni: user.documentNumber,
							fullname: user.name + ' ' + user.lastName,
							gender: user.gender,
							email: user.email,
							phone: user.cellPhone,
							partner:
								user.sponsorName && user.sponsorLastName
									? user?.sponsorName + ' ' + user?.sponsorLastName
									: 'No hay sponsor',
							state: this.statusOpt.find((opt) => opt.id === user.state.toString())?.text || '',
							membership: membership
						};
						usersWithMembership.push(userWithMembership);

						if (usersWithMembership.length === response.length) {
							this.table.data = usersWithMembership;
							this.cdr.detectChanges();
						}
					});
				});
			},
			(error) => {
				console.error('Error fetching users by filter:', error);
			}
		);
	}

	loadSuscriptions(idUser: string): Observable<any[]> {
		return this.userService.getSuscriptionsByUserViewAdmin(idUser).pipe(
			map((response) => {
				return response.map((suscription: any) => ({
					...suscription
				}));
			}),
			catchError((error) => {
				console.error('Error fetching suscriptions:', error);
				return [];
			})
		);
	}

	onViewSubscriptions(user: any) {
		const modalRef = this.modalService.open(ModalGracePeriodDetailComponent, {
			centered: true,
			size: 'xl'
		});
		const modal = modalRef.componentInstance as ModalGracePeriodDetailComponent;
		modal.idUser = user.id;
		modal.userName = user.username;
		modal.fullName = user.fullname;
		modal.document = user.dni;
		modal.typeDocument = user.typeDocument;
	}
}
