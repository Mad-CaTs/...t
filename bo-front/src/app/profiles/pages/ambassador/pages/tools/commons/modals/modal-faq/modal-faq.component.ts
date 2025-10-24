import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
	selector: 'app-modal-faq',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './modal-faq.component.html',
	styleUrl: './modal-faq.component.scss'
})
export class ModalFaqComponent {
	@Input() title: string = 'Registro exitoso';
	@Input() message: string = 'El envió de la pregunta no fue exitoso, intente nuevamente.';
	@Input() iconType: 'success' | 'error' | 'info' = 'info';
	@Output() closed = new EventEmitter<void>();

	onClose(): void {
		this.closed.emit();
	}
}
