import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ControlErrorComponent } from '@shared/components/control-error/control-error.component';
import { CalendarModule } from 'primeng/calendar';

@Component({
	selector: 'app-date',
	templateUrl: './date.component.html',
	standalone: true,
	imports: [CommonModule, MatIconModule, ReactiveFormsModule, CalendarModule, ControlErrorComponent],
	styleUrls: ['./date.component.scss']
})
export class DateComponent implements OnInit {
	@Input() controlName!: string;
	@Input() label!: string;
	@Input() form!: FormGroup;
	@Input() placeholder: string = '';
	@Input() readonly: boolean = false;
	@Input() config: boolean = false;
	@Input() set disabled(disabled: boolean) {
		const ctrl = this.form.get(this.controlName);
		if (disabled) {
			ctrl?.disable();
		} else {
			ctrl?.enable();
		}
	};

	// Nuevas propiedades para rangos de fecha
	minDate?: Date;
	@Input() maxDate?: Date;           // input externo
	maxDateInternal?: Date;           // valor final usado por el calendario

	ngOnInit() {
		if (this.config && this.maxDate) {
			// Si config=true y nos pasan maxDate, lo usamos
			this.maxDateInternal = this.maxDate;
		} else {
			// cálculo genérico de minDate y maxDateInternal
			const today = new Date();

			// Fecha mínima: 80 años atrás
			this.minDate = new Date();
			this.minDate.setFullYear(today.getFullYear() - 80);

			// Fecha máxima: 17 años atrás (para config=false)
			this.maxDateInternal = new Date();
			this.maxDateInternal.setFullYear(today.getFullYear() - 17);
		}
	}

	onSelect(event: Date) {
		this.form.get(this.controlName)?.setValue(event);
	}

	private get control() {
		return this.form.get(this.controlName);
	}
}
