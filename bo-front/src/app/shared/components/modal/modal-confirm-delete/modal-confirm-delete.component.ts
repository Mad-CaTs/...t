import { Component, EventEmitter, Input, Output, ElementRef, Renderer2, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-confirm-delete',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-confirm-delete.component.html',
  styleUrls: ['./modal-confirm-delete.component.scss'],
})
export class ModalConfirmDeleteComponent implements OnInit, OnDestroy {
  @Input() title = 'Eliminar elemento';
  @Input() message = '¿Estás seguro de que deseas eliminar este elemento? Esta acción no se puede deshacer.';
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  private appendedToBody = false;

  constructor(private el: ElementRef<HTMLElement>, private renderer: Renderer2) {}

  ngOnInit(): void {
    // Teleport host to body to ensure overlay covers entire viewport
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

  onConfirm(): void {
    this.confirm.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
