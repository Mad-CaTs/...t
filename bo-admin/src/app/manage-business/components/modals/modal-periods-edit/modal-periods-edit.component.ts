import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { TablesModule } from '@shared/components/tables/tables.module';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { PeriodService } from '@app/manage-business/services/period-service.service';
import { getCokkie } from '@utils/cokkies';

@Component({
  selector: 'app-modal-periods-edit',
  standalone: true,
  imports: [CommonModule, FormControlModule, TablesModule, FormsModule, ReactiveFormsModule, ModalComponent],
  templateUrl: './modal-periods-edit.component.html',
  styleUrls: ['./modal-periods-edit.component.scss']
})
export class ModalPeriodsEditComponent {
  form: FormGroup;
  buttonLoading: boolean = false;
  title: string;
  @Input() data: any;

  constructor(private modal: NgbModal, public instanceModal: NgbActiveModal, public formBuilder: FormBuilder,
    private periodService: PeriodService
  ) {
    this.title = 'Editar periodo';
    this.form = this.formBuilder.group({
      id: [],
      initialDate: [null, Validators.required],
      endDate: [null, Validators.required],
      payDate: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.data) {
      this.populateForm(this.data);
    }
  }

  populateForm(data: any) {
    this.form.patchValue({
      id: data.id,
      initialDate: this.convertArrayToDate(data.initialDate),
      endDate: this.convertArrayToDate(data.endDate),
      payDate: this.convertArrayToDate(data.payDate)
    });
  }

  convertArrayToDate(dateArray: number[]): Date {
    return new Date(
      dateArray[0],
      dateArray[1] - 1,
      dateArray[2],
      dateArray[3] || 0,
      dateArray[4] || 0
    );
  }

  normalizeToISODate(date: any): string | null {
    if (date instanceof Date) {
      return this.toISODateMidnight(date);
    } else if (Array.isArray(date)) {
      const [year, month, day] = date;
      const normalizedDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
      return isNaN(normalizedDate.getTime()) ? null : this.toISODateMidnight(normalizedDate);
    } else if (typeof date === 'string' || typeof date === 'number') {
      const normalizedDate = new Date(date);
      return isNaN(normalizedDate.getTime()) ? null : this.toISODateMidnight(normalizedDate);
    }
    return null;
  }

  private toISODateMidnight(date: Date): string {
    const utcDate = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
    return utcDate.toISOString().split('T')[0] + 'T00:00:00.000Z';
  }


  onSubmit() {
    this.buttonLoading = true;
    let username = getCokkie('USERNAME') ?? 'master';
    const data = {
      id: this.form.get('id')?.value,
      initialDate: this.normalizeToISODate(this.form.get('initialDate')?.value),
      endDate: this.normalizeToISODate(this.form.get('endDate')?.value),
      payDate: this.normalizeToISODate(this.form.get('payDate')?.value),
      isActive: 1
    };

    this.periodService.updatePeriod(data, username).subscribe({
      next: (response) => {
        this.buttonLoading = false;
        this.instanceModal.close();
      },
      error: () => {
        this.buttonLoading = false;
        alert('Error al editar periodo.');
      }
    });
  }




}
