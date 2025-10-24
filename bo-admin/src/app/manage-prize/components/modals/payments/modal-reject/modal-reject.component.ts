import {
  Component, EventEmitter, HostListener, Input, Output
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type Reason = { id: number | string; label: string };

@Component({
  selector: 'app-modal-reject',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-reject.component.html',
  styleUrls: ['./modal-reject.component.scss'],
})
export class ModalRejectComponent {

  @Input() show = true;

  @Input() icon = 'bi bi-trash3';
  @Input() title = 'Rechazar';
  @Input() subtitle = 'Al rechazar deberás indicar el motivo.';


  @Input() reasons: Reason[] = [];
  @Input() maxLength = 250;
  @Input() placeholder = 'e.j.: Detalla brevemente el motivo y la alternativa.';


  @Input() cancelLabel = 'Cancelar';
  @Input() confirmLabel = 'Rechazar';
  
  @Input() loading = false;

  @Output() close = new EventEmitter<void>();
  @Output() reject = new EventEmitter<{ reasonId: number | string; detail: string }>();

  selectedReasonId: number | string | null = null;
  detail = '';

  
  trackByReason = (_: number, r: Reason) => r.id;

  get counter(): string {
    return `${this.detail.length}/${this.maxLength}`;
  }

  get canSubmit(): boolean {
    return !!this.selectedReasonId && this.detail.trim().length > 0 && !this.loading;
  }

  onBackdropClick() {
    this.onClose();
  }

  onClose() {
    if (this.loading) return;
    this.close.emit();
  }

  onConfirm() {
    if (!this.canSubmit) return;
    
    this.reject.emit({
      reasonId: this.selectedReasonId as number | string,
      detail: this.detail.trim(),
    });
  }

  @HostListener('document:keydown.escape')
  onEsc() {
    this.onClose();
  }
}
