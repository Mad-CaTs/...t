import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ToastService } from '@app/core/services/toast.service';
import { ModalLoadingComponentManageBusiness } from '@app/manage-business/components/modals/modal-loading/modal-loading.component';
import { ScheduleModule } from '@app/schedule/schedule.module';
import { UserService } from '@app/users/services/user.service';
import { ISelectOpt } from '@interfaces/form-control.interface';
import { IPartnersRegisteredTable } from '@interfaces/partners.interface';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { TablesModule } from '@shared/components/tables/tables.module';
import { SharedModule } from '@shared/shared.module';
import { InlineSVGModule } from 'ng-inline-svg-2';

@Component({
	selector: 'app-list-schedule',
	templateUrl: './list-schedule.component.html',
	styleUrls: ['./list-schedule.component.scss'],
	standalone: true,
	imports: [
		CommonModule,
		SharedModule,
		ReactiveFormsModule,
		TablesModule,
		InlineSVGModule,
		FormControlModule,
		ScheduleModule
	]
})
export class ListScheduleComponent {
	tableData: IPartnersRegisteredTable[] = [];
	form: FormGroup;

	asOpt: ISelectOpt[] = [
		{ id: '1', text: 'Usuario' },
		{ id: '2', text: 'Patrocinador' }
	];
	statusOpt: ISelectOpt[] = [];
	private loadingModalRef: NgbModalRef | null = null;

	constructor(
		private formBuilder: FormBuilder,
		public modalService: NgbModal,
		private userService: UserService,
		private cdr: ChangeDetectorRef,
		private toastService: ToastService,
		public modal: NgbModal
	) {
		this.form = formBuilder.group({
			search: [''],
			as: ['1']
		});
	}

	ngOnInit(): void {
		//Estados
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
		const as = this.form.get('as')?.value;
		const status = this.form.get('status')?.value;
		const familyPackage = this.form.get('familyPackage')?.value;
		const packagee = this.form.get('package')?.value;

		if (!as) {
			const message = 'Seleccione una opción en los campos obligatorios.';
			this.toastService.addToast(message, 'warning');
			return;
		}

		this.showLoadingModal();

		this.userService.getUsersByFilter(searchValue, status, familyPackage, packagee, as).subscribe(
			(response) => {
				this.hideLoadingModal();
				this.tableData = response.map((user: any) => ({
					id: user.idUser,
					username: user.username,
					fullname: user.name,
					lastname: user.lastName,
					startDate: user.creationDate,
					email: user.email,
					phone: user.cellPhone,
					docNumber: user.documentNumber,
					docType: user.documentName,
					partner:
						user.sponsorName || user.sponsorLastName
							? `${user.sponsorName} ${user.sponsorLastName}`.trim()
							: 'No hay sponsor',
					status: this.statusOpt.find((opt) => opt.id === user.state.toString())?.text || '',
					subscriptionQuantity: 0,
					gender: user.gender
				}));
				this.cdr.detectChanges();
			},
			(error) => {
				this.hideLoadingModal();
				console.error('Error fetching users by filter:', error);
			}
		);
	}

	private showLoadingModal(): void {
		this.loadingModalRef = this.modal.open(ModalLoadingComponentManageBusiness, {
			centered: true,
			size: 'sm'
		});
	}

	private hideLoadingModal(): void {
		if (this.loadingModalRef) {
			this.loadingModalRef.close();
			this.loadingModalRef = null;
		}
	}

	// ngOnDestroy(): void {
	// 	localStorage.removeItem('userScheduleData');
	// }
}
