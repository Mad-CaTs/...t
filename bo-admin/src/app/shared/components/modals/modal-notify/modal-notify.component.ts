import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

type IconKind = 'success' | 'error' | 'info' | 'warning';

@Component({
  selector: 'app-modal-notify',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-notify.component.html',
  styleUrls: ['./modal-notify.component.scss']
})
export class ModalNotifyComponent {
  @Input() title: string = 'Operación completada';
  @Input() message: string = 'La acción se realizó correctamente.';
  @Input() iconType: IconKind = 'info';
  @Input() oneButton: boolean = true;
  @Input() primaryText?: string;
  @Input() secondaryText: string = 'Cancelar';
  @Input() closeOnConfirm: boolean = true;

  @Output() confirmed = new EventEmitter<void>();
  @Output() canceled = new EventEmitter<void>();

  @Output() closed = new EventEmitter<void>();

  get computedPrimaryText(): string {
    if (this.primaryText && this.primaryText.trim().length > 0) return this.primaryText;
    return this.oneButton ? 'Entendido' : 'Enviar';
  }

  onClose(): void {
    this.closed.emit();
  }

  onCancel(): void {
    this.canceled.emit();
    this.onClose();
  }

  onConfirm(): void {
    this.confirmed.emit();
    if (this.closeOnConfirm) this.onClose();
  }
}
