import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-retiro-rechazar',
  templateUrl: './modal-retiro-rechazar.component.html',
  styleUrls: ['./modal-retiro-rechazar.component.scss']
})
export class ModalRetiroRechazarComponent {
    constructor(
      public instanceModal: NgbActiveModal,
    ){}

}
