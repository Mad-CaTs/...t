import { Component } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-modal-confirm-delete',
  templateUrl: './modal-confirm-delete.component.html',
  styleUrls: ['./modal-confirm-delete.component.scss']
})
export class ModalConfirmDeleteComponent {

  title = 'Eliminar beneficiario';
  text = '¿Seguro que deseas eliminar este beneficiario? Esta acción no se puede deshacer.';
  confirmLabel = 'Eliminar';
  cancelLabel = 'Cancelar';
  loading = false;

  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig) {
    const d = config?.data || {};
    this.title = d.title ?? this.title;
    this.text = d.text ?? this.text;
    this.confirmLabel = d.confirmLabel ?? this.confirmLabel;
    this.cancelLabel = d.cancelLabel ?? this.cancelLabel;
  }

  confirm() { this.ref.close({ confirmed: true }); }
  cancel()  { this.ref.close({ confirmed: false }); }

}
