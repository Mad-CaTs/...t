import { Component } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-modal-error',
  standalone: true,
  imports: [],
  templateUrl: './modal-error.component.html',
  styleUrl: './modal-error.component.scss'
})
export class ModalErrorComponent {

  constructor (
    private ref: DynamicDialogRef,
  ){}

  onCalcer() {
    this.ref.close(false);
  }

}
