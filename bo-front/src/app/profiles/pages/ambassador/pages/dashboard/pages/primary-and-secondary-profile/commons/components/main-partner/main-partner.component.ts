import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalChangeProfileComponent } from '../../../../../commons/modals/modal-change-profile/modal-change-profile.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main-partner',
  templateUrl: './main-partner.component.html',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./style.scss'],
})
export class MainPartnerComponent {
  constructor(private modal: NgbModal) {}

  onChangeProfile() {
    this.modal.open(ModalChangeProfileComponent, { centered: true });
  }
}
