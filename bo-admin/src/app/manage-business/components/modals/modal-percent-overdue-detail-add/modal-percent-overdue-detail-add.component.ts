import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PercentOverdueDetailService } from '@app/manage-business/services/percent-overdue-detail.service';

@Component({
  selector: 'app-modal-percent-overdue-detail-add',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormControlModule,
    ModalComponent
  ],
  templateUrl: './modal-percent-overdue-detail-add.component.html',
  styleUrls: ['./modal-percent-overdue-detail-add.component.scss']
})
export class ModalPercentOverdueDetailAddComponent {
  form: FormGroup;
  buttonLoading: boolean = false;
  title: string;
  @Input() percentOverdueTypeId: number;

  constructor(private modal: NgbModal, public instanceModal: NgbActiveModal, public formBuilder: FormBuilder,
    private percentOverdueDetailService: PercentOverdueDetailService
  ) {
    this.title = 'Agregar porcentaje de mora';
    this.form = this.formBuilder.group({
      percentOverdue: [''],
      idPercentOverdueType: ['']
    });
  }

  ngOnInit(): void {
    if (this.percentOverdueTypeId) {
      this.form.patchValue({
        idPercentOverdueType: this.percentOverdueTypeId
      });
    }
  }

  onSubmit() {
    this.buttonLoading = true;
    this.percentOverdueDetailService.savePercentOverdueDetail(this.form.value).subscribe({
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
