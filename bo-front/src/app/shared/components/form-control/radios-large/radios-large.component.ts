import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ISelect } from '@shared/interfaces/forms-control';
import { RadioButtonModule } from 'primeng/radiobutton';

@Component({
	selector: 'app-radios-large',
	templateUrl: './radios-large.component.html',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule, RadioButtonModule, FormsModule],
	styleUrls: ['./radios-large.component.scss']
})
export default class RadiosLargeComponent {
	@Input() verticalLayout: boolean;
	@Input() horizontalLayout: boolean;
	@Input() options: ISelect[] = [];
	@Input() controlName: string;
	@Input() label: string;
	@Input() form: FormGroup;
	@Input() disabled: boolean;
	@Output() changeSelection = new EventEmitter<string>();

	public onChangeRadios({ value }) {
		return this.changeSelection.emit(value);
	}
}
