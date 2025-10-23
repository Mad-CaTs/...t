import {
	AfterViewInit,
	Component,
	ElementRef,
	EventEmitter,
	Input,
	OnInit,
	Output,
	ViewChild
} from '@angular/core';

import { monthNamesConstant, weekDaysConstant } from '@constants/date.constant';

import type { AbstractControl, FormGroup } from '@angular/forms';
import { onCloseUtil } from '@utils/events';

@Component({
	selector: 'app-input-date-calendar-dropdown',
	templateUrl: './input-date-calendar-dropdown.component.html',
	styleUrls: ['./input-date-calendar-dropdown.component.scss']
})
export class InputDateCalendarDropdownComponent implements OnInit, AfterViewInit {
	@Input() controlName: string = '';
	@Input() formGroup: FormGroup;
	@Input() input: HTMLElement;

	@Output() onClose = new EventEmitter();

	@ViewChild('menu') container: ElementRef;

	yearSelected: number = 2023;
	monthSelected: number = 7;
	days: number[][] = [];
	weekDays = weekDaysConstant;
	monthNames = monthNamesConstant;

	show: number = 1;

	ngOnInit(): void {
		this.setSelected();
		this.generateDays();
	}

	ngAfterViewInit(): void {
		onCloseUtil(this.container.nativeElement, this.onClose, this.input);
	}

	/* === Initializer === */

	generateDays() {
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

	setSelected() {
		this.yearSelected = this.date.getFullYear();
		this.monthSelected = this.date.getMonth();
	}

	/* === Events === */

	onChangeSelectedMonth(newMonth: number) {
		if (newMonth > 11) {
			this.monthSelected = 0;
			this.yearSelected += 1;
		} else if (newMonth < 0) {
			this.monthSelected = 11;
			this.yearSelected -= 1;
		} else this.monthSelected = newMonth;

		this.generateDays();
	}

	onSelectDate(n: number) {
		const currentSelected = new Date(this.control.value);

		currentSelected.setFullYear(this.yearSelected);
		currentSelected.setMonth(this.monthSelected);
		currentSelected.setDate(n);

		this.control.setValue(currentSelected.toUTCString());
	}

	onOpenMonth() {
		if (this.show === 2) return (this.show = 1);

		this.show = 2;
	}

	onOpenYear() {
		if (this.show === 3) return (this.show = 1);

		this.show = 3;
	}

	/* === Helpers === */

	isMuted(n: number, i: number) {
		const isPrevMonth = n < 32 && n > 24 && i === 0;
		const isNextMonth = n >= 1 && n < 8 && i === this.days.length - 1;

		return isNextMonth || isPrevMonth;
	}

	isToday(n: number) {
		const now = new Date();

		const yearCorrect = this.yearSelected === now.getFullYear();
		const monthCorrect = this.monthSelected === now.getMonth();
		const dayCorrect = n === now.getDate();

		return yearCorrect && monthCorrect && dayCorrect;
	}

	isSelected(n: number) {
		const yearCorrect = this.yearSelected === this.date.getFullYear();
		const monthCorrect = this.monthSelected === this.date.getMonth();
		const dayCorrect = n === this.date.getDate();

		return yearCorrect && monthCorrect && dayCorrect;
	}

	/* === Getters === */

	get date() {
		return new Date(this.control.value);
	}

	get control() {
		return this.formGroup.get(this.controlName) as AbstractControl;
	}

	get monthName() {
		return this.monthNames[this.monthSelected];
	}

	get years() {
		const prevYears = Array.from({ length: 3 }, (_, i) => this.yearSelected - (i + 1));
		const nextYears = Array.from({ length: 3 }, (_, i) => this.yearSelected + (i + 1));

		return [...prevYears, this.yearSelected, ...nextYears];
	}
}
