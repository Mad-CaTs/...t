import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-modal-documentos',
  standalone: true,
  imports: [CommonModule,DialogModule],
  templateUrl: './modal-documentos.component.html',
  styleUrl: './modal-documentos.component.scss'
})
export class ModalDocumentosComponent {

  constructor(public ref: DynamicDialogRef, private router:Router) {}



  closeModal() {
    this.ref.close();
  }

  goToValidateDocuments(): void {
    this.router.navigate(['/profile/partner/my-products/validate-documents']);

    this.closeModal();
  }
  

}
