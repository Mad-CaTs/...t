import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { InputComponent } from '@shared/components/form-control/input/input.component';
import { TextAreaComponent } from '@shared/components/form-control/text-area/text-area.component';
import { ModalComponent } from '@shared/components/modal/modal.component';
@Component({
  selector: 'app-modal-wallet-report-problem',
  templateUrl: './modal-wallet-report-problem.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ModalComponent,
    InputComponent,
    TextAreaComponent,
  ],
  styleUrls: [],
})
export class ModalWalletReportProblemComponent {
  public form: FormGroup;

  constructor(
    public instanceModal: NgbActiveModal,
    private formBuilder: FormBuilder
  ) {
    this.form = formBuilder.group({
      subject: ['', [Validators.required, Validators.minLength(4)]],
      message: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  /* === Events === */
  onSubmit() {
    this.instanceModal.close();
  }
}
