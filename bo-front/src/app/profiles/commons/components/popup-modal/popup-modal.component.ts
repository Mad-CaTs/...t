import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-popup-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './popup-modal.component.html',
  styleUrl: './popup-modal.component.scss'
})
export class PopupModalComponent {
  showModal: boolean = false;
  private dialogRef: DynamicDialogRef | null = null;  
  imageUrl: string = ''; 
  constructor(public config: DynamicDialogConfig) {
    this.imageUrl = this.config.data?.imageUrl || 'assets/images/default-image.jpeg';
  }

/*   constructor(private dialogService: DialogService) {}
 */

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }





}
