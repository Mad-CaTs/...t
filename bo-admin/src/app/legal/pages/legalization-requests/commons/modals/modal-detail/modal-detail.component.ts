import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../../../../../../shared/components/modal/modal.component';

@Component({
  selector: 'app-modal-detail',
  standalone: true,
  imports: [CommonModule,ModalComponent],
  templateUrl: './modal-detail.component.html',
  styleUrls: ['./modal-detail.component.scss']
})
export class ModalDetailComponent {
  @Input() title: string = 'Detail';
  @Input() data: Record<string, any> | null = null;

  constructor(public instanceModal: NgbActiveModal) {}


}
