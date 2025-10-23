import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from '@app/users/services/user.service';
import { ISelectOpt } from '@interfaces/form-control.interface';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-modal-edit-schedule-commission',
	templateUrl: './modal-edit-schedule-commission.component.html',
	styleUrls: ['./modal-edit-schedule-commission.component.scss']
})
export class ModalEditScheduleComissionComponent {
	@Input() idUser: string;
	@Input() userName: string = '';
	@Input() fullName: string = '';

	form: FormGroup;
	typeCommissionOpt: ISelectOpt[] = [];
	changes: string[];

	constructor(
		public activeModal: NgbActiveModal,
		private fb: FormBuilder,
		private cdr: ChangeDetectorRef,
		public userService: UserService
	) {
		this.form = this.fb.group({
			typeCommission: [''],
			commission: [''],
			date: new Date()
		});

		this.typeCommissionOpt = [];
		this.changes = [];
	}
}
