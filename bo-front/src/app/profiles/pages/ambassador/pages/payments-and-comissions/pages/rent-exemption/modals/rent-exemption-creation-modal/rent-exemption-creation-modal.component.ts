import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { CheckboxComponent } from '@shared/components/form-control/checkbox/checkbox.component';
import { InputComponent } from '@shared/components/form-control/input/input.component';
import { SelectComponent } from '@shared/components/form-control/select/select.component';
import { DialogModule } from 'primeng/dialog';
import { DynamicDialogConfig, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { ModalRentExemptionPresenter } from './rent-exemption-creation-modal.presenter';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DateComponent } from '@shared/components/form-control/date/date.component';
import { FileComponent } from '@shared/components/form-control/file/file.component';
import { TextAreaComponent } from '@shared/components/form-control/text-area/text-area.component';
import { RentExemptionService } from '../../services/rent-exemption.service';

@Component({
  selector: 'app-rent-exemption-creation-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    SelectComponent,
    DialogModule,
    DynamicDialogModule,
    InputComponent,
    CheckboxComponent,
    InputNumberModule,
    DateComponent,
    FileComponent,
    ProgressSpinnerModule,
    TextAreaComponent
  ],
  templateUrl: './rent-exemption-creation-modal.component.html',
  styleUrl: './rent-exemption-creation-modal.component.scss',
  providers: [ModalRentExemptionPresenter, DatePipe]
})
export class RentExemptionCreationModalComponent implements OnInit {
  rentExemptionForm: FormGroup;
  isLoading: boolean = false;
  userId: number;

  constructor(public modalRentExemptionPresenter: ModalRentExemptionPresenter, public ref: DynamicDialogRef,
    private config: DynamicDialogConfig, private rentExemptionService: RentExemptionService, private datePipe: DatePipe) {
  }

  convertDate(date: string): string {
    const dateObject = new Date(date);
    const convertedDate = this.datePipe.transform(dateObject, 'yyyy-MM-dd');
    return convertedDate;
  }

  ngOnInit(): void {
    this.rentExemptionForm = this.modalRentExemptionPresenter.rentExemptionForm;
    this.userId = this.config.data.userId;
  }

  setFormValueIfNotEmpty(controlName: string, value: string) {
    if (value && value.trim() !== '') {
      this.rentExemptionForm.get(controlName).setValue(value);
    }
  }

  saveRentExemption() {
    this.isLoading = true;
    let formData = new FormData();

    formData.append('userId', this.userId.toString());
    formData.append('number', this.rentExemptionForm.get('number').value);
    formData.append('date', this.convertDate(this.rentExemptionForm.get('date').value));
    formData.append('nroDocument', this.rentExemptionForm.get('nroDocument').value);
    formData.append('noteAditional', this.rentExemptionForm.get('noteAditional').value);
    formData.append('amount', this.rentExemptionForm.get('amount').value);
    formData.append('file', this.rentExemptionForm.get('file').value);
    this.rentExemptionService.saveRentExemption(formData).subscribe({
      next: () => {
        this.ref.close(true);
      },
      error: () => {
        this.ref.close(false);
      }
    });
  }

}
