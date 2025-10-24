import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { InputComponent } from '@shared/components/form-control/input/input.component';
import { SelectComponent } from '@shared/components/form-control/select/select.component';
import { DialogModule } from 'primeng/dialog';
import { DynamicDialogRef, DialogService, DynamicDialogModule, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { ModalGracePeriodPresenter } from './modal-grace-period.presenter';
import { CheckboxComponent } from '@shared/components/form-control/checkbox/checkbox.component';
import { GracePeriodService } from '../../services/grace-period.service';

@Component({
  selector: 'app-modal-grace-period',
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
    InputNumberModule
  ],
  templateUrl: './modal-grace-period.component.html',
  styleUrls: ['./modal-grace-period.component.scss'],
  providers: [ModalGracePeriodPresenter]
})
export class ModalGracePeriodComponent implements OnInit {
  maxDays: number;
  gracePeriodForm: FormGroup;
  totalOverdueDetail: number;
  daysAvailable: number;
  quote: number;
  amountOverdue: number;
  percentOverdueDetailId: number;

  constructor(private dialogService: DialogService, public ref: DynamicDialogRef, private modalGracePeriod: ModalGracePeriodPresenter,
    public config: DynamicDialogConfig, private gracePeriodService: GracePeriodService
  ) { }

  ngOnInit(): void {
    this.gracePeriodForm = this.modalGracePeriod.gracePeriodForm;
    this.daysAvailable = this.config.data.daysAvailable;
    this.totalOverdueDetail = this.config.data.totalOverdueDetail;
    this.quote = this.config.data.quote;
    this.amountOverdue = this.config.data.amountOverdue;
    this.percentOverdueDetailId = this.config.data.percentOverdueDetailId;
    if (this.totalOverdueDetail > this.daysAvailable) {
      this.maxDays = this.daysAvailable;
    } else {
      this.maxDays = this.totalOverdueDetail;
    }
  }

  submit() {
    const params = {
      daysApplied: this.gracePeriodForm.value.daysUsed,
      flagSchedule: this.gracePeriodForm.value.flagSchedule == true ? 1 : 2,
      daysAvailable: this.daysAvailable,
      amountOverdue: this.amountOverdue,
      percentOverdueDetailId: this.percentOverdueDetailId,
      quoteUsd: this.quote
    };
    this.gracePeriodService.calculateNormalGracePeriod(params).subscribe((response) => {
      const result = {
        response: response,
        flagSchedule: params.flagSchedule
      };
      this.ref.close(result);
    });
  }

  closeModal() {
    this.ref.close();
  }

}
