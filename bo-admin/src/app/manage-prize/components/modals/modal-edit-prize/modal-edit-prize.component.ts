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
	selector: 'app-modal-edit-prize',
	templateUrl: './modal-edit-prize.component.html',
	styleUrls: ['./modal-edit-prize.component.scss'],
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
export class ModalEditPrizeComponent {
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
			statusSwitch: true
		});

		this.rangeOpt = [
			{ id: '1', text: 'Plata' },
			{ id: '2', text: 'Oro' },
			{ id: '3', text: 'Diamante' },
			{ id: '4', text: 'Zafiro' }
		];
	}

	ngOnInit(): void {
		this.form.get('emailSwitch')?.valueChanges.subscribe((value) => {
			if (!value) {
				this.form.get('emailTypeSwitch')?.reset();
			}
		});
	}

	public setData(selectedItem: any) {
		let startDate: Date | null;
		let limitDate: Date | null;

		if (
			typeof selectedItem.startDate === 'string' ||
			selectedItem.startDate instanceof String ||
			typeof selectedItem.endDate === 'string' ||
			selectedItem.endDate instanceof String
		) {
			startDate = this.parseDateString(selectedItem.startDate);
			limitDate = this.parseDateString(selectedItem.endDate);
		} else {
			startDate = selectedItem.startDate;
			limitDate = selectedItem.endDate;
		}

		if (!startDate || isNaN(startDate.getTime()) || !limitDate || isNaN(limitDate.getTime())) {
			console.error('Invalid Start Date:', selectedItem.startDate);
			console.error('Invalid Limit Date:', selectedItem.endDate);
			return;
		}
		const hasLink = selectedItem.link && selectedItem.link.trim() !== '';
		const selectedRange = this.rangeOpt.find((range) => range.text === selectedItem.range.name);
		this.form.patchValue({
			range: selectedRange ? selectedRange.id : '',
			startDate: startDate,
			limitDate: limitDate,
			destiny: selectedItem.destiny,
			bonus: selectedItem.bonusValue,
			link: selectedItem.link,
			flyer: selectedItem.flyer,
			statusSwitch: selectedItem.status === 'Activo' ? true : false,
			emailSwitch: hasLink,
			emailTypeSwitch: hasLink
		});
	}

	parseDateString(dateString: string): Date | null {
		const parts = dateString.split('/');
		if (parts.length !== 3) {
			return null;
		}

		const day = parseInt(parts[0], 10);
		const month = parseInt(parts[1], 10) - 1;
		const year = parseInt(parts[2], 10);

		return new Date(year, month, day);
	}

	private formatDateAsString(dateString: string): string {
		const parts = dateString.split('/');
		if (parts.length === 3) {
			return `${parts[2]}-${parts[1]}-${parts[0]}`;
		}
		return '';
	}

	public onSubmit() {
		this.instanceModal.close();
		const ref = this.modalService.open(ModalConfirmationComponent, { centered: true, size: 'md' });
		const modal = ref.componentInstance as ModalConfirmationComponent;

		modal.title = 'Registro exitoso';
		modal.icon = 'bi bi-check-circle-fill text-success fa-2x';
		modal.body = 'El premio ha sido modificado con éxito.';
	}
}
