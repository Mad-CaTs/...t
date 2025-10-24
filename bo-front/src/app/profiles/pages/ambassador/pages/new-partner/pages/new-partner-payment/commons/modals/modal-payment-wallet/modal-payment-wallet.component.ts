import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { InputComponent } from '@shared/components/form-control/input/input.component';
import { ModalComponent } from '@shared/components/modal/modal.component';

@Component({
  selector: 'app-modal-payment-wallet',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    ModalComponent,
    InputComponent,
  ],
  templateUrl: './modal-payment-wallet.component.html',
  styleUrls: [],
})
export class ModalPaymentWalletComponent {
  form: FormGroup;

  constructor(
    public instanceModal: NgbActiveModal,
    private formBuilder: FormBuilder
  ) {
    this.form = formBuilder.group({
      amount: [''],
    });
  }
}
