import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-modal-opcion-inhabilitada',
  standalone: true,
  imports: [CommonModule, MatIconModule],
    providers: [DialogService],
  templateUrl: './modal-opcion-inhabilitada.component.html',
  styleUrl: './modal-opcion-inhabilitada.component.scss'
})
export class ModalOpcionInhabilitadaComponent {
  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig) { }

  get data() {
    return this.config.data;
  }

  closeModal() {
    this.ref.close();
  }

}
