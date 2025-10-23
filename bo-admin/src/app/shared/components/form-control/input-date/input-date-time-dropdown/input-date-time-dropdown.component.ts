import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

import type { AbstractControl, FormGroup } from '@angular/forms';
import { onCloseUtil } from '@utils/events';

@Component({
	selector: 'app-input-date-time-dropdown',
	templateUrl: './input-date-time-dropdown.component.html',
	styleUrls: ['./input-date-time-dropdown.component.scss']
})
export class InputDateTimeDropdownComponent implements AfterViewInit {
	@Input() controlName: string = '';
	@Input() formGroup: FormGroup;
	@Input() input: HTMLElement;

	@Output() onClose = new EventEmitter();

	@ViewChild('menu') container: ElementRef;

	ngAfterViewInit(): void {
		onCloseUtil(this.container.nativeElement, this.onClose, this.input);
	}

	/* === Events === */

	onChangeType(type: 'AM' | 'PM') {
		if (this.type === type) return;

		const date = new Date(this.control.value);
		let hours = type === 'AM' ? -12 : 12;

		if (this.hour === 12 && this.type === 'AM') hours = 11;

		date.setHours(date.getHours() + hours);
		this.control.setValue(date.toUTCString());
	}

	onModifyMinutes(newMinutes: number) {
		const date = new Date(this.control.value);

		if (newMinutes < 0) date.setMinutes(0);
		else if (newMinutes > 59) date.setMinutes(59);
		else date.setMinutes(newMinutes);

		this.control.setValue(date.toUTCString());
	}

	onModifyHours(newHours: number) {
		const date = new Date(this.control.value);

		const min = this.type === 'AM' ? 0 : 1;
		const max = this.type === 'AM' ? 11 : 12;

		let hour = 0;

		if (newHours < min) hour = min;
		else if (newHours > max) hour = max;
		else hour = newHours;

		const sumWhenIsPM = hour === 12 ? 0 : 12;

		if (this.type === 'AM') date.setHours(hour);
		else date.setHours(hour + sumWhenIsPM);

		this.control.setValue(date.toUTCString());
	}

	onChange(e: Event, type: 'HOURS' | 'MINUTES') {
		const target = e.target as HTMLSpanElement;
		let content = Number(target.textContent);

		if (isNaN(content)) content = 1;

		if (type === 'HOURS') return this.onModifyHours(content);

		this.onModifyMinutes(content);
	}

	/* === Getters === */

	get type() {
		if (this.date.getHours() < 12) return 'AM';

		return 'PM';
	}

	get hour() {
		if (this.date.getHours() < 13) return this.date.getHours();

		return this.date.getHours() - 12;
	}

	get minutes() {
		return this.date.getMinutes();
	}

	get control() {
		return this.formGroup.get(this.controlName) as AbstractControl;
	}

	get date() {
		return new Date(this.control.value);
	}

	get minutesFormated() {
		if (this.minutes < 10) return `0${this.minutes}`;

		return this.minutes;
	}
}
