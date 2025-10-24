import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '@shared/components/modal/modal.component';

@Component({
  selector: 'app-modal-tool-image',
  templateUrl: './modal-tool-image.component.html',
  standalone: true,
  imports: [ModalComponent],
  styleUrls: [],
})
export class ModalToolImageComponent {
  constructor(public instanceModal: NgbActiveModal) {}
}
