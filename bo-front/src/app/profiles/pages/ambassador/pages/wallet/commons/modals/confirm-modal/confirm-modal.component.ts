import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [],
  templateUrl: './confirm-modal.component.html',
  styleUrl: './confirm-modal.component.scss'
})
export class ConfirmModalComponent {


  constructor(
    private ref: DynamicDialogRef,
    private router: Router
  ) { }

  onConfirm() {
    this.ref.close(false);
    this.router.navigate([`/profile/ambassador/wallet/desafiliate-payment`]).then(() => {
      window.location.reload(); 
    });
  }

}
