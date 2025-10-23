import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GracePeriodParameterService } from '@app/manage-business/services/grace-period-parameter-service.service';

@Component({
  selector: 'app-modal-grace-period-delete',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormControlModule,
    ModalComponent
  ],
  templateUrl: './modal-grace-period-delete.component.html',
  styleUrls: ['./modal-grace-period-delete.component.scss']
})
export class ModalGracePeriodDeleteComponent {
  buttonLoading: boolean = false;
  @Input() gracePeriodData: any;
  
  constructor(public instanceModal: NgbActiveModal, private gracePeriodParameterService: GracePeriodParameterService) { }

  onDelete() {
    this.buttonLoading = true;
    this.gracePeriodParameterService.deleteGracePeriodParameter(this.gracePeriodData.gracePeriodParameterId).subscribe({
      next: (response) => {
        this.buttonLoading = false;
        this.instanceModal.close();
      },
      error: (error) => {
        alert('Error al eliminar el parámetro de periodo de gracia');
        this.buttonLoading = false;
      }
    });
  }
}
