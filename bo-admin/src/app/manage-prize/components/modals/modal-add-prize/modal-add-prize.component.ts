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
import { ModalConfirmationComponent } from '@shared/components/modal-confirmation/modal-confirmation.component';

@Component({
	selector: 'app-modal-add-prize',
	templateUrl: './modal-add-prize.component.html',
	styleUrls: ['./modal-add-prize.component.scss'],
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
export class ModalAddPrizeComponent {
	rangeOpt: ISelectOpt[] = [];

	form: FormGroup;
	constructor(
		public instanceModal: NgbActiveModal,
		private fb: FormBuilder,
		private cdr: ChangeDetectorRef,
		public userService: UserService,
		private modalService: NgbModal
	) {
		this.form = this.fb.group({
			range: [''],
			startDate: [''],
			limitDate: [''],
            destiny: [''],
			bonus: [''],
			emailSwitch: false,
			emailTypeSwitch: true,
			link: [''],
			flyer: [''],
            statusSwitch: true,
		});

		this.rangeOpt = [
			{ id: '1', text: 'Plata' },
			{ id: '2', text: 'Oro' },
			{ id: '3', text: 'Diamante' },
			{ id: '4', text: 'Zafiro' }
		];
	}

	ngOnInit(): void {
		this.setValues();
		this.form.get('emailSwitch')?.valueChanges.subscribe((value) => {
			if (!value) {
				this.form.get('emailTypeSwitch')?.reset();
			}
		});
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

    public onSubmit() {
		this.instanceModal.close();
		const ref = this.modalService.open(ModalConfirmationComponent, { centered: true, size: 'md' });
		const modal = ref.componentInstance as ModalConfirmationComponent;

		modal.title = 'Registro exitoso';
		modal.icon = 'bi bi-check-circle-fill text-success fa-2x';
		modal.body = 'El premio ha sido creado con éxito.';
	}
}
