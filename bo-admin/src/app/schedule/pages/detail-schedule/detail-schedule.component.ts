import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalLoadingComponentManageBusiness } from '@app/manage-business/components/modals/modal-loading/modal-loading.component';
import { ModalEditScheduleComponent, ModalEditStatusComponent } from '@app/schedule/components/modals';
import { ScheduleModule } from '@app/schedule/schedule.module';
import { ScheduleService } from '@app/schedule/services/schedule.service';
import { UserService } from '@app/users/services/user.service';
import { UsersService } from '@app/users/services/users.service';
import { ISelectOpt } from '@interfaces/form-control.interface';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { TablesModule } from '@shared/components/tables/tables.module';
import { SharedModule } from '@shared/shared.module';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Component({
	selector: 'app-detail-schedule',
	templateUrl: './detail-schedule.component.html',
	styleUrls: ['./detail-schedule.component.scss'],
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
export class DetailScheduleComponent {
	idUser: number = 0;
	userName: string = '';
	fullName: string = '';
	document: string = '';
	typeDocument: string = '';
	statusValue: string = '';
	form: FormGroup;

	statusOpt: ISelectOpt[] = [];
	suscriptions: any[] = [];
	private loadingModalRef: NgbModalRef | null = null;

	constructor(
		// public activeModal: NgbActiveModal,
		private cdr: ChangeDetectorRef,
		private formBuilder: FormBuilder,
		public modalService: NgbModal,
		public userService: UserService,
		public usersService: UsersService,
		private route: ActivatedRoute,
		private scheduleService: ScheduleService,
		public modal: NgbModal,
		private router: Router
	) {
		this.form = formBuilder.group({
			search: [''],
			as: ['1']
		});
	}

	ngOnInit(): void {
		const id = Number(this.route.snapshot.paramMap.get('id'));
		const state = this.scheduleService.getUserData();
		this.idUser = id;

		if (state) {
			this.setUserData(state);
		} else {
			const storedState = localStorage.getItem('userScheduleData');
			if (storedState) {
				const parsedState = JSON.parse(storedState);
				this.setUserData(parsedState);
			}
		}

		this.userService.getAllStates().subscribe(
			(states) => {
				this.statusOpt = [
					...states.map((state) => ({
						id: state.idState.toString(),
						text: state.nameState
					}))
				];
				this.cdr.detectChanges();
				this.loadSuscriptions();
			},
			(error) => {
				console.error('Error fetching states:', error);
			}
		);
	}

	loadSuscriptions(): void {
		this.showLoadingModal();
		this.userService
			.getSuscriptionsByUserViewAdmin(this.idUser.toString())
			.pipe(
				map((response) => {
					this.hideLoadingModal();
					return response.map((suscription: any) => ({
						...suscription,
						pendingDateCuote: this.formatDate(suscription.pendingDateCuote),
						lastPayedCuoteDate: this.formatDate(suscription.lastPayedCuoteDate),
						status:
							this.statusOpt.find((opt) => opt.id === suscription.status.toString())?.text || ''
					}));
				}),
				catchError((error) => {
					console.error('Error fetching suscriptions:', error);
					this.hideLoadingModal();
					return of([]);
				})
			)
			.subscribe((suscriptions) => {
				this.suscriptions = suscriptions;
				this.cdr.detectChanges();
			});
	}

	private setUserData(user: any): void {
		this.userName = user.username;
		this.fullName = user.name && user.lastName ? `${user.name} ${user.lastName}` : user.fullname ?? '';
		this.document = user.documentNumber ?? user.document ?? '';
		this.typeDocument = user.documentName ?? user.typeDocument ?? '';
		this.statusValue = user.stateName ?? user.status ?? '';
	}

	formatDate(dateInput: string | number[]): string {
		if (Array.isArray(dateInput)) {
			const [year, month, day] = dateInput;
			const validDate = new Date(year, month - 1, day);
			return this.formatToDDMMYYYY(validDate);
		}

		if (typeof dateInput === 'string') {
			const dateParts = dateInput.split('T')[0].split('-');
			return `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
		}

		return '';
	}

	formatToDDMMYYYY(date: Date): string {
		const day = String(date.getDate()).padStart(2, '0');
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const year = date.getFullYear();
		return `${day}-${month}-${year}`;
	}

	onEditStatusSubscriptions(user: any) {
		const modalRef = this.modalService.open(ModalEditStatusComponent, {
			centered: true,
			size: 'm'
		});
		const modal = modalRef.componentInstance as ModalEditStatusComponent;
		modal.idUser = user.idUser;
		modal.userName = user.username;
		modal.fullName = user.fullname;
		modal.statusValue = user.status;
		modal.subscriptionName = user.pack.name;
	}

	onEditSubscriptions(user: any) {
		const data = {
			suscription: user.pack.name,
			idUser: this.idUser
		};
		localStorage.setItem('suscription', JSON.stringify(data));
		this.router.navigate(['/dashboard/schedule/edit-schedule', user.id]);
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

	onBack() {
		this.router.navigate(['/dashboard/schedule/list-schedule']);
	}
}
