import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '@shared/components/modal/modal.component';

@Component({
  selector: 'app-modal-confirmation',
  templateUrl: './modal-confirmation.component.html',
  standalone: true,
  imports: [CommonModule, ModalComponent],
  styleUrls: [],
})
export class ModalConfirmationComponent {
  @Input() title: string = 'Confirmation title';
  @Input() btnSuccessText: string = '';
  @Input() text: string[] = [''];

  @Output() clickBtn = new EventEmitter();

  constructor() {}
}
