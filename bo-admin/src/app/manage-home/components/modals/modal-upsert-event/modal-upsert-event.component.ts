import { Component, Input } from '@angular/core';

/* === Modules === */
import { CommonModule } from '@angular/common';
import {
	AbstractControl,
	FormArray,
	FormBuilder,
	FormGroup,
	ReactiveFormsModule,
	Validators
} from '@angular/forms';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfirmationComponent } from '@shared/components/modal-confirmation/modal-confirmation.component';

@Component({
	selector: 'app-modal-upsert-event',
	standalone: true,
	imports: [CommonModule, ModalComponent, ReactiveFormsModule, FormControlModule],
	templateUrl: './modal-upsert-event.component.html',
	styleUrls: ['./modal-upsert-event.component.scss']
})
export class ModalUpsertEventComponent {
	@Input() id: number = 0;

	public step = 1;
	public form: FormGroup;
	public inputTypes: FormArray<FormGroup>;

	public readonly durationRegex = /^(\d+h)?\s?(\d+m)?$/;

	constructor(
		private builder: FormBuilder,
		public instanceModal: NgbActiveModal,
		private modalManager: NgbModal
	) {
		this.form = builder.group({
			name: ['', [Validators.required, Validators.minLength(2)]],
			startDate: [new Date().toISOString(), [Validators.required]],
			time: ['', [Validators.required]],
			duration: ['', [Validators.required]],
			presenter: ['', [Validators.required]],
			location: ['', [Validators.required]],
			linkEvent: ['', [Validators.required]],
			sendByEmail: [false],
			remember: ['', [Validators.required]],
			description: ['', Validators.required, Validators.minLength(8)],
			flyer: ['', [Validators.required]],
			inputType: ['1', [Validators.required]]
		});
		this.inputTypes = builder.array<FormGroup>([]);
	}

	/* === Events === */
	public onAddNew() {
		const newGroup = this.builder.group({
			zone: ['', [Validators.required, Validators.minLength(3)]],
			price: ['', [Validators.required, Validators.min(0)]],
			capacity: ['', [Validators.required, Validators.min(0)]],
			seats: ['', [Validators.required, Validators.min(0)]],
			seatType: ['', [Validators.required]]
		});

		this.inputTypes.push(newGroup);
	}

	public onSubmit() {
		if (this.step === 1) {
			this.instanceModal.update({ size: 'xl' });
			return this.step++;
		}

		this.instanceModal.close();
		const ref = this.modalManager.open(ModalConfirmationComponent, { centered: true, size: 'md' });
		const modal = ref.componentInstance as ModalConfirmationComponent;

		modal.title = 'Registro exitoso';
		modal.icon = 'bi bi-check-circle-fill text-success fa-2x';
		modal.body = 'El evento ha sido creado con éxito.';
	}

	/* === Helpers === */
	public getControl(name: string) {
		return this.form.get(name) as AbstractControl;
	}

	/* === Getters === */
	get title() {
		if (!this.id) return 'Nuevo evento';

		return 'Editar Evento';
	}

	get invalidForm() {
		if (this.step === 1) return this.form.invalid;

		const invalidSome =
			this.inputTypes.controls.some((group) => group.invalid) || this.inputTypes.controls.length === 0;
		const isFree = this.getControl('inputType').value === '1';

		if (isFree) return this.form.invalid;
		else return this.form.invalid || invalidSome;
	}

	get helperDuration() {
		const date = new Date(this.getControl('startDate').value);
		const time = this.getControl('time').value as string;
		const duration = this.getControl('duration').value as string;
		const validDuration = this.durationRegex.test(duration);

		if (!validDuration || !time) return 'Este evento tendrá lugar...';

		try {
			const [entryHours, entryMinutes] = time.split(':').map(Number);
			const durationRegex = /^(\d+h)?\s?(\d+m)?$/;
			const durationMatch = duration.match(durationRegex);

			if (!durationMatch) return 'Este evento tendra lugar...';

			const durationHours = durationMatch[1] ? parseInt(durationMatch[1]) : 0;
			const durationMinutes = durationMatch[2] ? parseInt(durationMatch[2]) : 0;
			const endHours = entryHours + durationHours;
			const endMinutes = entryMinutes + durationMinutes;
			const formattedDate = new Intl.DateTimeFormat('es-ES', {
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			}).format(date);
			const formattedEntryTime = `${entryHours}:${entryMinutes.toString().padStart(2, '0')}`;
			const formattedEndTime = `${endHours}:${endMinutes.toString().padStart(2, '0')}`;
			const result = `Este evento tendrá lugar el ${formattedDate} de ${formattedEntryTime} a ${formattedEndTime}.`;

			return result;
		} catch (e) {
			return 'Este evento tendrá lugar...';
		}
	}
}
