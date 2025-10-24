import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ControlErrorComponent } from '@shared/components/control-error/control-error.component';
import { ISelect } from '@shared/interfaces/forms-control';
import { RadioButtonModule } from 'primeng/radiobutton';

@Component({
	selector: 'app-radios',
	templateUrl: './radios.component.html',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule, RadioButtonModule, FormsModule,ControlErrorComponent],
	styleUrls: ['./radios.component.scss']
})
export default class RadiosComponent {
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
