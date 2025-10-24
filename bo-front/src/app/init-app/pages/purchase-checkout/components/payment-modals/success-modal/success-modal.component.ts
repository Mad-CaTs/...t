import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-success-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './success-modal.component.html',
  styleUrls: ['./success-modal.component.scss']
})
export class SuccessModalComponent {
  @Input() isOpen = false;
  @Input() title = '¡Pago Exitoso!';
  @Input() message = 'Tu pago ha sido procesado correctamente. Recibirás una confirmación por correo electrónico.';
  @Input() icon = '✓';
  @Input() iconColor = '#10b981'; // Verde por defecto
  @Output() closeModal = new EventEmitter<void>();

  onClose(): void {
    this.closeModal.emit();
  }
}
