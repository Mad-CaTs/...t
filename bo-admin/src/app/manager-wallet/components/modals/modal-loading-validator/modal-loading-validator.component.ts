import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { ModalComponent } from '@shared/components/modal/modal.component';

@Component({
  selector: 'app-modal-loading-validator',
  standalone: true,
  imports: [CommonModule, LoadingComponent, ModalComponent],
  templateUrl: './modal-loading-validator.component.html',
  styleUrls: ['./modal-loading-validator.component.scss']
})
export class ModalLoadingValidatorComponent {
   @Input() data: any;
   @Input() totalWithdrawals: number;
   @Input() message: string = 'Validando registros...';
   @Input() title: string = '';
   @Input() subtitle: string = '';
   @Input() currentStepIndex: number;
   @Input() activeTab: string;

   constructor(public activeModal: NgbActiveModal) {}

  continuar() {
    this.activeModal.close();
  }
}
