import { CommonModule } from '@angular/common';
import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-cancel-affiliate-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cancel-affiliate-modal.component.html',
  styleUrl: './cancel-affiliate-modal.component.scss'
})
export class CancelAffiliateModalComponent {

  dateActualal: string = '';
  @Output() goToBackChild = new EventEmitter<boolean>();
 
  constructor(
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private router: Router
  ) {
    const fecha = new Date();
    const day = fecha.getDate().toString().padStart(2, '0');
    const month = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const year = fecha.getFullYear();
    this.dateActualal = `${day}/${month}/${year}`;
  }

  onCancel() {
    this.ref.close(false);
  }

  onConfirm() {
    this.ref.close(true);
  }
  
}
