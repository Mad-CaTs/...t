import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { accountTreeRangesMock } from '../../mocks/mock';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '@shared/components/modal/modal.component';

@Component({
  selector: 'app-modal-account-tree-ranges-detail',
  templateUrl: './modal-account-tree-ranges-detail.component.html',
  standalone: true,
  imports: [CommonModule, ModalComponent],
  styleUrls: [],
})
export class ModalAccountTreeRangesDetailComponent {
  @Input() data: any;

  constructor(public instanceModal: NgbActiveModal) { }

}
