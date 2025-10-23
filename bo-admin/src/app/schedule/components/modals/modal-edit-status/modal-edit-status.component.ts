import { ChangeDetectorRef, Component, Input } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { UserService } from '@app/users/services/user.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ISelectOpt } from '@interfaces/form-control.interface';
import { catchError, map } from 'rxjs/operators';

@Component({
	selector: 'app-modal-edit-status',
	templateUrl: './modal-edit-status.component.html',
	styleUrls: ['./modal-edit-status.component.scss']
})
export class ModalEditStatusComponent {
	@Input() idUser: string;
	@Input() userName: string = '';
	@Input() fullName: string = '';
	@Input() statusValue: string = '';
	@Input() subscriptionName: string = '';

	form: FormGroup;
	statusOpt: ISelectOpt[] = [];
	changes: string[];
	suscriptions: any[] = [];

	constructor(
		public activeModal: NgbActiveModal,
		private fb: FormBuilder,
		private cdr: ChangeDetectorRef,
		public userService: UserService
	) {
		this.form = this.fb.group({
			status: ['']
		});

		this.statusOpt = [];
		this.changes = [];
	}

	ngOnInit(): void {
		this.loadSuscriptions();
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

	loadSuscriptions(): void {
		this.userService
			.getSuscriptionsByUserViewAdmin(this.idUser)
			.pipe(
				map((response) => {
					return response.map((suscription: any) => ({
						...suscription
					}));
				}),
				catchError((error) => {
					console.error('Error fetching suscriptions:', error);
					return [];
				})
			)
			.subscribe((suscriptions) => (this.suscriptions = suscriptions));
	}
}
