import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from "../../../../shared/components/modal/modal.component";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GracePeriodParameterService } from '@app/manage-business/services/grace-period-parameter-service.service';

@Component({
  selector: 'app-modal-grace-period-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormControlModule,
    ModalComponent
  ],
  templateUrl: './modal-grace-period-edit.component.html',
  styleUrls: ['./modal-grace-period-edit.component.scss']
})
export class ModalGracePeriodEditComponent {
  form: FormGroup;
  buttonLoading: boolean = false;
  @Input() gracePeriodData: any;

  constructor(private modal: NgbModal, public instanceModal: NgbActiveModal, public formBuilder: FormBuilder,
    private gracePeriodParameterService: GracePeriodParameterService
  ) {
    this.form = this.formBuilder.group({
      valueDays: ['', Validators.required],
      status: [Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.gracePeriodData && this.gracePeriodData.valueDays) {
      this.form.patchValue({
        valueDays: this.gracePeriodData.valueDays,
        status: this.gracePeriodData.status
      });
    }
  }

  onStatusChange(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.form.get('status')?.setValue(isChecked ? 1 : 0);
  }

  onSubmit() {
    this.buttonLoading = true;
    this.gracePeriodParameterService.updateGracePeriodParameter(this.form.value, this.gracePeriodData.gracePeriodParameterId).subscribe({
      next: (response) => {
        this.buttonLoading = false;
        this.instanceModal.close();
      },
      error: (error) => {
        alert('Error al actualizar el parámetro de periodo de gracia');
        this.buttonLoading = false;
      }
    });
  }

}
