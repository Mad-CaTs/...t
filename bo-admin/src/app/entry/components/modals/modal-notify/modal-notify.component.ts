import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-notify',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-notify.component.html',
  styleUrls: ['./modal-notify.component.scss']
})
export class ModalNotifyComponent {

  @Input() title: string = 'Registro exitoso';
  @Input() message: string = 'El pago de las entradas ha sido validado.';
  @Input() iconType: 'success' | 'error' | 'info' = 'info';
  @Output() closed = new EventEmitter<void>();

  onClose(): void {
    this.closed.emit();
  }
  
}
