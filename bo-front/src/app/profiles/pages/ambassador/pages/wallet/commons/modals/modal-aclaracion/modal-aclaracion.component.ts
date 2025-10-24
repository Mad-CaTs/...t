import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DialogModule } from 'primeng/dialog';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-modal-aclaracion',
  standalone: true,
  imports: [CommonModule, MatIconModule, DialogModule],
  templateUrl: './modal-aclaracion.component.html',
  styleUrl: './modal-aclaracion.component.scss'
})
export class ModalAclaracionComponent {
  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) { }
  public disabledUser: boolean = false
  get isValidBtn() {
    return true
  }
  closeModal() {
    this.ref.close(false);
  }
  confirmar() {
    this.ref.close(true);

  }
}
