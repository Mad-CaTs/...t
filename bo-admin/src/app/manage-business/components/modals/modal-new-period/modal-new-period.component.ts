import { ChangeDetectorRef, Component } from '@angular/core';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '@app/core/services/toast.service';

/* === Modules === */

import { CommonModule } from '@angular/common';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PackageDetailAdministratorService } from '@app/manage-business/services/PackageDetailAdministratorService';

@Component({
	selector: 'app-modal-new-period',
	standalone: true,
	imports: [CommonModule, ModalComponent, FormControlModule, ReactiveFormsModule],
	templateUrl: './modal-new-period.component.html',
	styleUrls: ['./modal-new-period.component.scss']
})
export class ModalNewPeriodComponent {
	public form: FormGroup;
	public loading: boolean = false;

	constructor(
		public instanceModal: NgbActiveModal,
		private builder: FormBuilder,
		private cdr: ChangeDetectorRef
	) {
		this.form = builder.group({
			startDate: [''],
			endDate: [''],
			payDate: ['']
		});
	}

	ngOnInit(): void {
		this.setValues();
	}

	/* === Events === */
	setValues() {
		const today = new Date();
		const nextMonth = new Date(today);
		nextMonth.setMonth(today.getMonth() + 1);
		const fortnight = new Date();
		fortnight.setDate(today.getDate() + 14);

		const formattedToday = this.formatDate(today);
		const formattedNextMonth = this.formatDate(nextMonth);
		const formattedFortnight = this.formatDate(fortnight);

		if (formattedToday && formattedNextMonth) {
			this.form.patchValue({
				startDate: formattedToday,
				endDate: formattedNextMonth,
				payDate: formattedFortnight
			});
		} else {
			console.warn('Se detectó una fecha incorrecta o incompatible con el formato de la variable.', {
				today: formattedToday,
				nextMonth: formattedNextMonth,
				fortnight: formattedFortnight
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
	/* === Getters === */
}
