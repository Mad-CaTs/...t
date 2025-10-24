import { CommonModule } from '@angular/common';
import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	EventEmitter,
	Input,
	Output
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ControlErrorComponent } from '@shared/components/control-error/control-error.component';
import { ISelect } from '@shared/interfaces/forms-control';
import { DropdownModule } from 'primeng/dropdown';

@Component({
	selector: 'app-select',
	templateUrl: './select.component.html',
	standalone: true,
	imports: [CommonModule, MatIconModule, DropdownModule, ReactiveFormsModule, ControlErrorComponent],
	styleUrls: ['./select.component.scss']
})
export class SelectComponent {
	@Input() controlName: string;
	@Input() label: string;
	@Input() filter: boolean = false;
	@Input() placeholder: string;
	@Input() options: ISelect[] = [];
	@Input() form: FormGroup;
	@Input() showImg: boolean;
	@Input() appendToBody: boolean = false;
	@Input() width: string = '';
	@Output() onChangeSelection = new EventEmitter<any>();
	@Input() set disabled(disabled: boolean) {
		if (disabled) {
			this.control?.disable();
		} else {
			this.control?.enable();
		}
	}

	constructor(private cdr: ChangeDetectorRef) { }

	public changeSelection(event: any) {
		const item = this.options.find((option) => option.value === event.value);
		this.onChangeSelection.emit(item);
	}


	get selectedItem() {
		const value = this.control.value;
		return this.options.find((option: any) => option.value === value);
	}

	private get control() {
		return this.form.get(this.controlName);
	}
}
