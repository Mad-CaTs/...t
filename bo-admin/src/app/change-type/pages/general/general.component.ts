import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { monthNamesConstant, weekDaysFullConstant } from '@constants/date.constant';

import { ModalUpsertChangeTypeComponent } from '@app/change-type/components/modals';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

/* === Modules === */
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { ChangeTypeService } from '@app/core/services/api/change-type/change-type.service';
import { IResponseData } from '@interfaces/globals.interface';

@Component({
	selector: 'app-general',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule, FormControlModule],
	templateUrl: './general.component.html',
	styleUrls: ['./general.component.scss']
})
export class GeneralComponent implements OnInit {
	public form: FormGroup;

	/* === Calendar === */
	public monthSelected: number = 8;
	public yearSelected: number = 2019;
	public days: number[][] = [];

	public weekDays = weekDaysFullConstant;
	private monthNames = monthNamesConstant;
	public loading = false;
	public result: any[] = [];
	constructor(private builder: FormBuilder, private modalManager: NgbModal, private ChangeTypeService: ChangeTypeService,private cdr: ChangeDetectorRef){
		this.form = builder.group({
			country: ['', [Validators.required]],
			currency: [''],
			changeType: ['']
		});
	}

	ngOnInit(): void {
		const today = new Date();

		this.monthSelected = today.getMonth();
		this.yearSelected = today.getFullYear();
		this.generateDays();
		this.getDataChanges();
	}

	/* === Events === */
	public onChangeSelectedMonth(newMonth: number) {
		if (newMonth > 11) {
			this.monthSelected = 0;
			this.yearSelected += 1;
		} else if (newMonth < 0) {
			this.monthSelected = 11;
			this.yearSelected -= 1;
		} else this.monthSelected = newMonth;

		this.generateDays();
	}

	public onReset() {
		this.form.setValue({ country: '', currency: '', changeType: '' });
	}

	public onCreate() {
		const ref = this.modalManager.open(ModalUpsertChangeTypeComponent, { centered: true, size: 'md' });
		const modal = ref.componentInstance as ModalUpsertChangeTypeComponent;

		modal.id = 0;
	}

	public onEdit(id: number) {
		const ref = this.modalManager.open(ModalUpsertChangeTypeComponent, { centered: true, size: 'md' });
		const modal = ref.componentInstance as ModalUpsertChangeTypeComponent;

		modal.id = id;
	}

	/* === Helpers === */
	private generateDays() {
		this.days = [];
		const daysDateActual = new Date(this.yearSelected, this.monthSelected + 1, 0).getDate();
		const daysDatePrev = new Date(this.yearSelected, this.monthSelected, 0).getDate();
		const day = new Date(this.yearSelected, this.monthSelected, 1).getDay();
		const startDayNextMonth = new Date(this.yearSelected, this.monthSelected + 1, 1).getDay();
		let daysNext: number[] = [];

		const daysPrevMonth = Array.from({ length: daysDatePrev }, (_, i) => i + 1);
		const days = Array.from({ length: daysDateActual }, (_, i) => i + 1);
		const daysPrev = Array.from({ length: day }, (_, i) => daysPrevMonth[daysPrevMonth.length - 1 - i]);

		if (startDayNextMonth !== 0) {
			daysNext = Array.from({ length: 7 - startDayNextMonth }, (_, i) => i + 1);
		}

		const listDays = [...daysPrev.reverse(), ...days, ...daysNext];

		for (let i = 0; i < listDays.length; i += 7) this.days.push(listDays.slice(i, i + 7));
	}

	public isMuted(n: number, i: number) {
		const isPrevMonth = n < 32 && n > 24 && i === 0;
		const isNextMonth = n >= 1 && n < 8 && i === this.days.length - 1;

		return isNextMonth || isPrevMonth;
	}

	public isToday(n: number) {
		const now = new Date();

		const yearCorrect = this.yearSelected === now.getFullYear();
		const monthCorrect = this.monthSelected === now.getMonth();
		const dayCorrect = n === now.getDate();

		return yearCorrect && monthCorrect && dayCorrect;
	}

	/* === Getters === */
	get monthName() {
		return this.monthNames[this.monthSelected];
	}

	get country() {
		return this.form.get('country')?.value as string;
	}

	getDataChanges(): void {
        this.loading = true;
        this.ChangeTypeService.fetchChanges().subscribe({
            next: (result) => {
				this.result = result.data as IResponseData<any>[];
				console.log("Mi",result);
                this.loading = false;
				this.cdr.detectChanges();
            }
        });
    }
	public getExchangeRate(day: number): any | undefined {
		return this.result.find((rate) => {
			const date = rate.date;
			return (
				date[2] === day && // Día
				date[1] - 1 === this.monthSelected && // Mes (date[1] está basado en 1)
				date[0] === this.yearSelected // Año
			);
		});
	}
}
