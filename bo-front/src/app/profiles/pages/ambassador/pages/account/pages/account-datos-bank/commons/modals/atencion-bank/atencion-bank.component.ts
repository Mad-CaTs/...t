import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-atencion-bank',
  standalone: true,
  imports: [CommonModule],
  providers: [DialogService],
   templateUrl: './atencion-bank.component.html',
  styleUrl: './atencion-bank.component.scss'
})
export class AtencionBankComponent {
  constructor(public ref: DynamicDialogRef,
    public config: DynamicDialogConfig) { }

      closeModal() {
    this.ref.close();
  }
}
