import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { accountTreeOrganizationManager } from '../../mocks/mock';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '@shared/components/modal/modal.component';

@Component({
  selector: 'app-modal-account-tree-organization-manager',
  templateUrl: './modal-account-tree-organization-manager.component.html',
  standalone: true,
  imports: [CommonModule, ModalComponent],
  styleUrls: [],
})
export class ModalAccountTreeOrganizationManagerComponent {
  @Input() id: number = 0;

  public screen: number = 1;

  constructor(public instanceModal: NgbActiveModal) {}

  get userData() {
    const result = accountTreeOrganizationManager.find((a) => a.id === this.id);

    return result || accountTreeOrganizationManager[0];
  }

  get title() {
    if (this.screen === 2) return 'Dashboard';
    if (this.screen === 3) return 'Flyer';

    return 'Detalle';
  }
}
