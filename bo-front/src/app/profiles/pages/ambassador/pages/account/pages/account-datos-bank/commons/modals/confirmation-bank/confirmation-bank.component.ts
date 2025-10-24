import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-confirmation-bank',
  standalone: true,
  imports: [CommonModule],
    providers: [DialogService],
  templateUrl: './confirmation-bank.component.html',
  styleUrl: './confirmation-bank.component.scss'
})
export class ConfirmationBankComponent {
  constructor(public ref: DynamicDialogRef,
    public config: DynamicDialogConfig) { }

  closeModal() {
    this.ref.close();
  }
  next() {
    this.ref.close(true);
  }
}
