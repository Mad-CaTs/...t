import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modals-bulk-succes',
  templateUrl: './modals-bulk-succes.component.html',
  styleUrls: ['./modals-bulk-succes.component.scss']
})
export class ModalsBulkSuccesComponent {
  @Input() totalReject : number
  @Input() approved : number
  @Input() rejected : number

  constructor (
    private activeModal: NgbActiveModal
  ) {}

  closeModal() {
    this.activeModal.close();
  }

}
