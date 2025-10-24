import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ModalComponent } from '@shared/components/modal/modal.component';

@Component({
  selector: 'app-modal-success-promotor',
  standalone: true,
  imports: [CommonModule, ModalComponent, MatIconModule],
  templateUrl: './modal-success-promotor.component.html',
  styleUrls: ['./modal-success-promotor.component.css'],
})
export class ModalSuccessPromotorComponent {
  constructor(public instanceModal: NgbActiveModal) {}
}
