import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DialogModule } from 'primeng/dialog';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-modal-retiro-proceso',
  standalone: true,
  imports: [CommonModule, MatIconModule, DialogModule],
  templateUrl: './modal-retiro-proceso.component.html',
  styleUrl: './modal-retiro-proceso.component.scss'
})
export class ModalRetiroProcesoComponent {
 constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) { }
confirmar(){
  this.ref.close()
}
}
