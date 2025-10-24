import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RecoveryMethod } from '../../commons/enums/recovery.enum';
import { RecoveryMethodLabels } from '../../commons/constants/recovery.constants';

@Component({
	selector: 'app-recovery-method-button',
	standalone: true,
	imports: [RadioButtonModule, CommonModule, FormsModule, ReactiveFormsModule],
	templateUrl: './recovery-method-button.component.html',
	styleUrl: './recovery-method-button.component.scss'
})
export class RecoveryMethodButtonComponent {
	@Input() method: RecoveryMethod;
	@Input() form: FormGroup;
	@Input() controlName: string;
	
	public selectedMethod: string = null;
	public RecoveryMethodLabels = RecoveryMethodLabels;

	selectMethod() {
		this.form.get(this.controlName)?.setValue(this.method);
	}
}
