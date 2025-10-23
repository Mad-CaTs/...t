import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PercentOverdueDetailService } from '../../../services/percent-overdue-detail.service';

@Component({
  selector: 'app-modal-percent-overdue-detail-delete',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormControlModule,
    ModalComponent
  ],
  templateUrl: './modal-percent-overdue-detail-delete.component.html',
  styleUrls: ['./modal-percent-overdue-detail-delete.component.scss']
})
export class ModalPercentOverdueDetailDeleteComponent {
  buttonLoading: boolean = false;
  @Input() idPercentOverdueDetail: any;

  constructor(public instanceModal: NgbActiveModal, private percentOverdueDetailService: PercentOverdueDetailService) { }

  onDelete() {
    this.buttonLoading = true;
    this.percentOverdueDetailService.deletePercentOverdueDetail(this.idPercentOverdueDetail).subscribe({
      next: () => {
        this.buttonLoading = false;
        this.instanceModal.close();
      },
      error: (error) => {
        let message = error.error.message;
        if (message) {
          alert(message)
        } else {
          alert('Error al eliminar el porcentaje de mora');
        }
        this.buttonLoading = false;
      }
    });
  }
}
