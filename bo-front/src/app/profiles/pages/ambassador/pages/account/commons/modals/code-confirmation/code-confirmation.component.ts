import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CheckboxComponent } from '@shared/components/form-control/checkbox/checkbox.component';
import { DateComponent } from '@shared/components/form-control/date/date.component';
import { FileComponent } from '@shared/components/form-control/file/file.component';
import { InputComponent } from '@shared/components/form-control/input/input.component';
import { SelectComponent } from '@shared/components/form-control/select/select.component';
import { TextAreaComponent } from '@shared/components/form-control/text-area/text-area.component';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { DialogModule } from 'primeng/dialog';
import { DynamicDialogConfig, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AccountServiceService } from '../../services/account-service.service';

@Component({
  selector: 'app-code-confirmation',
  standalone: true,
  imports: [CommonModule,
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
    TextAreaComponent],
  templateUrl: './code-confirmation.component.html',
  styleUrl: './code-confirmation.component.scss'
})
export class CodeConfirmationComponent implements OnInit {
  isLoading: boolean = false;
  form: FormGroup;
  userId: any;

  constructor(public ref: DynamicDialogRef, private config: DynamicDialogConfig, private formBuilder: FormBuilder,
    private accountService: AccountServiceService
  ) {
    this.form = formBuilder.group({
      code: ['', [Validators.minLength(6), Validators.maxLength(6)]]
    });
  }

  ngOnInit(): void {
    this.userId = this.config.data.userId;
  }

  validate() {
    this.isLoading = true;
    this.accountService.validateCode(this.userId, this.form.get('code').value).subscribe({
      next: (response) => {
        this.ref.close(response.data);
      },
      error: () => {
        this.ref.close(false);
      }
    });
  }

}
