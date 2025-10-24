import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';

@Component({
	selector: 'app-email-input',
	standalone: true,
	imports: [InputTextModule, FormsModule, ReactiveFormsModule],
	templateUrl: './email-input.component.html',
	styleUrl: './email-input.component.scss'
})
export class EmailInputComponent {
	@Output() writeEmail = new EventEmitter<string>();
	@Input() form: FormGroup;
	@Input() controlName: string;

	sendEmail(email: string) {
		this.writeEmail.emit(email);
	}
}
