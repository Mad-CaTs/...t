import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '@app/users/services/user.service';
import { ISelectOpt } from '@interfaces/form-control.interface';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { SharedModule } from '@shared/shared.module';

@Component({
	selector: 'app-modal-grace-period-detail-edit',
	templateUrl: './modal-grace-period-detail-edit.component.html',
	styleUrls: ['./modal-grace-period-detail-edit.component.scss'],
	standalone: true,
	imports: [
		CommonModule,
		ModalComponent,
		FormControlModule,
		ReactiveFormsModule,
		InlineSVGModule,
		SharedModule
	]
})
export class ModalGracePeriodDetailEditComponent {
	@Input() idUser: any;
	@Input() packages: any[] = [];
	@Input() packageCurrent: any;
	@Input() suscriptionOpt: ISelectOpt[];

	gracePeriodOpt: ISelectOpt[] = [];

	migrateToOpt: ISelectOpt[] = [];

	form: FormGroup;
	constructor(
		public instanceModal: NgbActiveModal,
		private fb: FormBuilder,
		private cdr: ChangeDetectorRef,
		public userService: UserService,
		private modalService: NgbModal
	) {
		this.form = this.fb.group({
			gracePeriod: [''],
			commission: [''],
			startDate: [''],
			limitDate: [''],
			suscription: [''],
			migrateTo: ['']
		});

		this.gracePeriodOpt = [
			{ id: '1', text: 'Primera opción' },
			{ id: '2', text: 'Segunda opción' },
			{ id: '3', text: 'Tercera opción' }
		];
		this.migrateToOpt = [
			{ id: '1', text: 'Primera opción' },
			{ id: '2', text: 'Segunda opción' },
			{ id: '3', text: 'Tercera opción' }
		];
	}

	ngOnInit(): void {
		this.setValues();
	}

	setValues() {
		const today = new Date();
		const nextMonth = new Date(today);
		nextMonth.setMonth(today.getMonth() + 1);

		const formattedToday = this.formatDate(today);
		const formattedNextMonth = this.formatDate(nextMonth);

		if (formattedToday && formattedNextMonth) {
			this.form.patchValue({
				startDate: formattedToday,
				limitDate: formattedNextMonth
			});
		} else {
			console.warn('Se detectó una fecha inválida:', {
				today: formattedToday,
				nextMonth: formattedNextMonth
			});
		}

		if (this.packageCurrent && this.suscriptionOpt.length > 0) {
			const selectedOption = this.suscriptionOpt.find((opt) => opt.id === this.packageCurrent.id);

			if (selectedOption) {
				this.form.patchValue({
					suscription: selectedOption.id
				});
				this.cdr.detectChanges();
			} else {
				console.warn('No se encontró la opción en suscriptionOpt para packageCurrent');
			}
		}
	}

	formatDate(date: Date): string {
		if (isNaN(date.getTime())) {
			console.warn('Fecha inválida:', date);
			return '';
		}
		const day = ('0' + date.getDate()).slice(-2);
		const month = ('0' + (date.getMonth() + 1)).slice(-2);
		const year = date.getFullYear();
		return `${year}-${month}-${day}`;
	}
}
