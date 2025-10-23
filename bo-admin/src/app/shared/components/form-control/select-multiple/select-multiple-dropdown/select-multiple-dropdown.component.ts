import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

import type { AbstractControl, FormGroup } from '@angular/forms';
import type { ISelectOpt } from '@interfaces/form-control.interface';

import { onCloseUtil } from '@utils/events';

@Component({
	selector: 'app-select-multiple-dropdown',
	templateUrl: './select-multiple-dropdown.component.html',
	styleUrls: ['./select-multiple-dropdown.component.scss']
})
export class SelectMultipleDropdownComponent implements AfterViewInit {
	@Input() controlName: string = '';
	@Input() formGroup: FormGroup;
	@Input() options: ISelectOpt[] = [];
	@Input() input: HTMLElement;

	@ViewChild('menu') container: ElementRef;

	@Output() onClose = new EventEmitter();

	ngAfterViewInit(): void {
		onCloseUtil(this.container.nativeElement, this.onClose, this.input);
	}

	/* === Events === */

	onStopPropagation(e: Event) {
		e.stopPropagation();
	}

	onAdd(opt: ISelectOpt) {
		let newList = [...this.values];

		if (newList.includes(opt)) newList = newList.filter((l) => l.id !== opt.id);
		else newList.push(opt);

		this.formValue.setValue(newList);
	}

	/* === Getters === */
	get values() {
		return this.formValue.value;
	}

	get formValue() {
		return this.formGroup.get(this.controlName) as AbstractControl<ISelectOpt[]>;
	}
}
