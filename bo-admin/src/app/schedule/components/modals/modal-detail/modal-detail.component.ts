import { ChangeDetectorRef, Component, Input } from '@angular/core';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { UserService } from '@app/users/services/user.service';
import { catchError, map } from 'rxjs/operators';
import { ISelectOpt } from '@interfaces/form-control.interface';
import { ModalEditStatusComponent } from '../modal-edit-status/modal-edit-status.component';
import { ModalEditScheduleComponent } from '../modal-edit-schedule/modal-edit-schedule.component';
import { ModalLoadingComponentManageBusiness } from '@app/manage-business/components/modals/modal-loading/modal-loading.component';

@Component({
	selector: 'app-modal-detail',
	templateUrl: './modal-detail.component.html',
	styleUrls: ['./modal-detail.component.scss']
})
export class ModalDetailComponent {
	@Input() idUser: string;
	@Input() userName: string = '';
	@Input() fullName: string = '';
	@Input() document: string = '';
	@Input() typeDocument: string = '';
	@Input() statusValue: string = '';

	statusOpt: ISelectOpt[] = [];
	suscriptions: any[] = [];
	private loadingModalRef: NgbModalRef | null = null;

	constructor(
		public activeModal: NgbActiveModal,
		private cdr: ChangeDetectorRef,
		public modalService: NgbModal,
		public userService: UserService,
		public modal: NgbModal
	) {}

	ngOnInit(): void {
		this.loadSuscriptions();
		//Estados
		this.userService.getAllStates().subscribe(
			(states) => {
				this.statusOpt = [
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

	loadSuscriptions(): void {
		this.showLoadingModal();
		this.userService
			.getSuscriptionsByUserViewAdmin(this.idUser)
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
					return [];
				})
			)
			.subscribe((suscriptions) => (this.suscriptions = suscriptions));
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
		const modalRef = this.modalService.open(ModalEditScheduleComponent, {
			centered: true,
			size: 'xl'
		});
		const modal = modalRef.componentInstance as ModalEditScheduleComponent;
		modal.idSuscripcion = user.id;
		modal.idUser = user.idUser;
		modal.userName = user.username;
		modal.fullName = user.fullname;
		modal.statusValue = user.status;
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
}
