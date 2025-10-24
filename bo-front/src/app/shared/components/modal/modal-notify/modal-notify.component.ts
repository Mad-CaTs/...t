import { Component, Input, Output, EventEmitter, ElementRef, Renderer2, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

type IconKind = 'success' | 'error' | 'info' | 'warning' | 'file';

@Component({
  selector: 'app-modal-notify',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-notify.component.html',
  styleUrls: ['./modal-notify.component.scss']
})
export class ModalNotifyComponent implements OnInit, OnDestroy {
  @Input() title: string = 'Operación completada';
  @Input() message: string = 'La acción se realizó correctamente.';
  @Input() iconType: IconKind = 'info';
  @Input() oneButton: boolean = true;
  @Input() primaryText?: string;
  @Input() secondaryText: string = 'Cancelar';
  @Input() closeOnConfirm: boolean = true;

  @Input() showBullets: boolean = false;
  @Input() bulletItems: string[] = [];

  @Input() showInfoBox: boolean = false;
  @Input() infoBoxMessage: string = '';

  @Output() confirmed = new EventEmitter<void>();
  @Output() canceled = new EventEmitter<void>();

  @Output() closed = new EventEmitter<void>();

  private appendedToBody = false;
  constructor(private el: ElementRef<HTMLElement>, private renderer: Renderer2) {}

  ngOnInit(): void {
    const host = this.el.nativeElement;
    if (host && host.parentElement !== document.body) {
      this.renderer.appendChild(document.body, host);
      this.appendedToBody = true;
    }
  }

  ngOnDestroy(): void {
    if (this.appendedToBody) {
      const host = this.el.nativeElement;
      if (host && document.body.contains(host)) {
        this.renderer.removeChild(document.body, host);
      }
    }
  }

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
