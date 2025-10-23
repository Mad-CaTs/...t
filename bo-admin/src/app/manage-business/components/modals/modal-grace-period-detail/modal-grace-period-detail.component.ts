import { ChangeDetectorRef, Component, Input } from '@angular/core';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { UserService } from '@app/users/services/user.service';
import { catchError, map } from 'rxjs/operators';
import { ISelectOpt } from '@interfaces/form-control.interface';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { ReactiveFormsModule } from '@angular/forms';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { TableComponent } from '@shared/components/table/table.component';
import { SharedModule } from '@shared/shared.module';
import { ModalGracePeriodDetailEditComponent } from '../modal-grace-period-detail-edit/modal-grace-period-detail-edit.component';

@Component({
	selector: 'app-modal-grace-period-detail',
	templateUrl: './modal-grace-period-detail.component.html',
	styleUrls: ['./modal-grace-period-detail.component.scss'],
	standalone: true,
	imports: [
		CommonModule,
		ModalComponent,
		FormControlModule,
		ReactiveFormsModule,
		InlineSVGModule,
		SharedModule,
		ModalGracePeriodDetailEditComponent
	]
})
export class ModalGracePeriodDetailComponent {
	@Input() idUser: string;
	@Input() userName: string = '';
	@Input() fullName: string = '';
	@Input() document: string = '';
	@Input() typeDocument: string = '';
	@Input() statusValue: string = '';

	allData: any | null = null;
	statusOpt: ISelectOpt[] = [];
	suscriptions: any[] = [];
	suscriptionsOpt: ISelectOpt[] = [];

	constructor(
		public activeModal: NgbActiveModal,
		private cdr: ChangeDetectorRef,
		public modalService: NgbModal,
		public userService: UserService
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
		this.userService
			.getSuscriptionsByUserViewAdmin(this.idUser)
			.pipe(
				map((response) => {
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
					return [];
				})
			)
			.subscribe((suscriptions) => (this.suscriptions = suscriptions));
	}

	formatDate(dateString: string): string {
		if (!dateString) return '';
		const dateParts = dateString.split('T')[0].split('-');
		return `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
	}

	onEditSubscriptions(user: any) {
		const modalRef = this.modalService.open(ModalGracePeriodDetailEditComponent, {
			centered: true,
			size: 'm'
		});
		const modal = modalRef.componentInstance as ModalGracePeriodDetailEditComponent;

		modal.idUser = user.idUser;

		modal.suscriptionOpt = Array.from(
			this.suscriptions
				.reduce((map, s) => {
					if (!map.has(s.pack.idPackage)) {
						map.set(s.pack.idPackage, {
							id: s.pack.idPackage.toString(),
							text: s.pack.name
						});
					}
					return map;
				}, new Map())
				.values()
		);

		modal.packageCurrent = {
			id: user.pack.idPackage.toString(),
			text: user.pack.name
		};
	}
}
