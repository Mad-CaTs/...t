import { Component } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [],
  templateUrl: './confirm-modal.component.html',
  styleUrl: './confirm-modal.component.scss'
})
export class ConfirmModalComponent {


  constructor (
    private ref: DynamicDialogRef,
  ){}

  onConfirm(){
    this.ref.close(false);
    // Logic to handle confirmation action
    console.log('Action confirmed');
  }

}
