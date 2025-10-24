import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-delete-bank',
  standalone: true,
  imports: [CommonModule],
  providers: [DialogService],
  templateUrl: './delete-bank.component.html',
  styleUrl: './delete-bank.component.scss'
})
export class DeleteBankComponent {
  constructor(public ref: DynamicDialogRef,
    public config: DynamicDialogConfig) { }

  closeModal() {
    this.ref.close();
  }
}
