import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { PercentOverdueDetailService } from '@app/manage-business/services/percent-overdue-detail.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-percent-overdue-detail-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormControlModule,
    ModalComponent
  ],
  templateUrl: './modal-percent-overdue-detail-edit.component.html',
  styleUrls: ['./modal-percent-overdue-detail-edit.component.scss']
})
export class ModalPercentOverdueDetailEditComponent {
  form: FormGroup;
  buttonLoading: boolean = false;
  title: string;
  percentOverdueId: number;
  @Input() percentOverdueTypeId: number;
  @Input() percentOverdueDetail: any;

  constructor(private modal: NgbModal, public instanceModal: NgbActiveModal, public formBuilder: FormBuilder,
    private percentOverdueDetailService: PercentOverdueDetailService
  ) {
    this.title = 'Editar porcentaje de mora';
    this.form = this.formBuilder.group({
      percentOverdue: [''],
      idPercentOverdueType: [''],
      status: [Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.percentOverdueTypeId) {
      this.form.patchValue({
        idPercentOverdueType: this.percentOverdueTypeId,
        percentOverdue: this.percentOverdueDetail.percentOverdue,
        status: this.percentOverdueDetail.status
      });
    }
    this.percentOverdueId = this.percentOverdueDetail.idPercentOverdueDetail;
  }

  onStatusChange(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.form.get('status')?.setValue(isChecked ? 1 : 0);
  }

  onSubmit() {
    this.buttonLoading = true;
    this.percentOverdueDetailService.updatePercentOverdueDetail(this.form.value, this.percentOverdueId).subscribe({
      next: () => {
        this.buttonLoading = false;
        this.instanceModal.close();
      },
      error: () => {
        alert('Error al guardar el porcentaje de mora');
        this.buttonLoading = false
      }
    });
  }

}
