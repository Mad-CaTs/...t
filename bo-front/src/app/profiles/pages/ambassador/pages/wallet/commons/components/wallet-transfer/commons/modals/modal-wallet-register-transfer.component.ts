import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectComponent } from '@shared/components/form-control/select/select.component';
import { InputComponent } from '@shared/components/form-control/input/input.component';
import { FileComponent } from '@shared/components/form-control/file/file.component';
import { ModalComponent } from '@shared/components/modal/modal.component';

@Component({
  selector: 'app-modal-wallet-register-transfer',
  templateUrl: './modal-wallet-register-transfer.component.html',
  standalone: true,
  imports: [
    CommonModule,
    SelectComponent,
    InputComponent,
    ModalComponent,
    FileComponent,
  ],
  styleUrls: [],
})
export class ModalWalletRegisterTransferComponent {
//   public form: FormGroup;

//   public optDestinyAccount = optDestinyAccountMock;

  constructor(
    // public instanceModal: NgbActiveModal,
    // private formBuilder: FormBuilder
  ) {
    // this.form = formBuilder.group({
    //   destinyAccount: [0],
    //   amount: [0, [Validators.required, Validators.min(0.01)]],
    //   file: [null],
    // });
  }
}
