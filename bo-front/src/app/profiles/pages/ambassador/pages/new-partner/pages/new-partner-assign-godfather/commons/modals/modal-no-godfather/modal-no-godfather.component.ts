import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-modal-no-godfather',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './modal-no-godfather.component.html'
})
export class ModalNoGodfatherComponent {
  
  constructor(public ref: DynamicDialogRef) {}

  onConfirm(): void {
    this.ref.close(true);
  }

  onCancel(): void {
    this.ref.close(false);
  }
}

